import React, { useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { asSocket } from "../Utilities/TradeTools";
import ApexCharts from "apexcharts";

function ToolChart(props) {
  const [dataState, setData] = useState([]);
  const [first, setFirst] = useState(true);

  const [options, setOptions] = useState({
    chart: {
      id: "realtime",
      zoom: {
        type: "x",
        enabled: false,
        autoScaleYaxis: true,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        forceNiceScale: true,
        min: function (min) {
          return min;
        },

        decimalsInFloat: 8,
      },
      animations: {
        enabled: false,
      },
    },
    title: {
      text: `${props.market.name} - 1 min interval`,
      align: "center",
    },
  });

  const memoizedCallBack = useCallback(() => {
    if (!first) {
      setData([]);
    }
    setFirst(false);
    var candles = [];
    var largest = 0;
    var minimum = 0;
    async function getCandles() {
      const today = new Date().toISOString().split("T")[0];

      var data = await axios.get(
        `https://api.binomo.com/platform/candles/${props.market.ric}/${today}T00:00:00/60?locale=en`
      );
      data = data.data.data;
      var tempData = [];

      data.forEach((el) => {
        var temp = [el.open, el.high, el.low, el.close];
        tempData.push({
          x: el.created_at.slice(11, 19),
          y: temp,
        });
        candles.push({
          x: el.created_at.slice(11, 19),
          y: temp,
        });
      });
      candles = candles.slice(candles.length - 29);
      candles.forEach((el) => {
        if (Math.max(...el.y) > largest) {
          largest = Math.max(...el.y);
        }
        if (minimum === 0 || Math.min(...el.y) < minimum) {
          minimum = Math.min(...el.y);
        }
      });
    }

    getCandles();

    //<------------------------------------------->
    //Socket to get live data from binomo

    //Subscribe to the live data

    var toSend = JSON.stringify({
      action: "subscribe",
      rics: [props.market.ric],
    });

    asSocket.send(toSend);
    //Change the table
    var firstTime = true;
    asSocket.onmessage = (res) => {
      res = JSON.parse(res.data).data[0].assets[0];

      if (res.created_at.slice(17, 19) === "01" && firstTime) {
        firstTime = false;
        if (candles.length === 29) {
          candles.shift();
        }
        candles.push({
          x: res.created_at,
          y: [res.rate, res.rate, res.rate, res.rate],
        });
        setTimeout(function () {
          firstTime = true;
        }, 1000);
      } else if (res.rate < candles[candles.length - 1].y[2]) {
        candles[candles.length - 1].y[2] = res.rate;
      } else if (res.rate > candles[candles.length - 1].y[1]) {
        candles[candles.length - 1].y[1] = res.rate;
      }
      candles[candles.length - 1].y[3] = res.rate;
      candles[candles.length - 1].x = res.created_at.slice(11, 19);

      ApexCharts.exec("realtime", "updateSeries", [
        {
          name: props.market.name,
          data: [...candles],
        },
      ]);
      if (res.rate > largest) {
        largest = res.rate;
      }
      if (res.rate < minimum) {
        minimum = res.rate;
      }
      ApexCharts.exec("realtime", "updateOptions", {
        yaxis: { max: largest, min: minimum },
      });
    };
  }, [props.market.ric]);

  useEffect(() => {
    memoizedCallBack();
    //<------------------------------------------->
    return function () {
      const toSend = JSON.stringify({
        action: "unsubscribe",
        rics: [props.market.ric],
      });
      asSocket.send(toSend);
      asSocket.removeEventListener("message", function () {});
    };
  }, [props.market.ric]);

  return (
    <Chart
      options={options}
      series={[{ name: props.market.name, data: dataState }]}
      type="candlestick"
      width="100%"
      height="80%"
    />
  );
}

export default ToolChart;
