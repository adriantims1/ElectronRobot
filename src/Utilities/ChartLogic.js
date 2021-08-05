import { asSocket } from "./WebSocket";
import ApexCharts from "apexcharts";
import axios from "axios";

//function to set data in Chart context
var candles; //cannot get state candles, therefore need to create a copy of it
var flag = true; //push and pop only once when seconds strike 00
var min = Number.MAX_SAFE_INTEGER;
var max = 0; //for chart min and max

let setYAxis;

const setInitializeFunction = (setYAxisArgs) => {
  initializeData(false);
  asSocket.onmessage = updateData;
  setYAxis = setYAxisArgs;
};

const updateData = (res) => {
  res = JSON.parse(res.data);

  if (res.data[0].action !== "assets") {
    return;
  }

  res = res.data[0].assets[0];
  try {
    if (res.created_at.slice(17, 19) === "00" && flag) {
      flag = false;
      setTimeout(() => {
        flag = true;
      }, 2000);
      if (candles.length >= 30) candles.shift();
      let a = new Date(res.created_at);
      candles.push({
        x: a.setMinutes(a.getMinutes() + 1),
        y: [res.rate, res.rate, res.rate, res.rate],
      });

      ApexCharts.exec("tradeChart", "updateSeries", [
        {
          data: candles,
        },
      ]);
      let arrCandles = [];
      candles.forEach((el) => {
        el.y.forEach((el1) => {
          arrCandles.push(el1);
        });
      });

      min = Math.min(...arrCandles);
      max = Math.max(...arrCandles);

      setYAxis(min, max);
      return;
    } else if (res.rate > candles[candles.length - 1].y[1] /*candles.high*/) {
      candles[candles.length - 1].y[1] = res.rate;
    } else if (res.rate < candles[candles.length - 1].y[2] /*candles.low*/) {
      candles[candles.length - 1].y[2] = res.rate;
    }
    candles[candles.length - 1].y[3] = res.rate;

    if (res.rate < min) {
      min = res.rate;
      //setOptions
      // ApexCharts.exec("tradeChart", "updateOptions", {
      //   yaxis: {
      //     min,
      //   },
      // });
      setYAxis(min, max);
    } else if (res.rate > max) {
      max = res.rate;
      //setOptions
      // ApexCharts.exec("tradeChart", "updateOptions", {
      //   yaxis: {
      //     max,
      //   },
      // });
      setYAxis(min, max);
    }
    ApexCharts.exec("tradeChart", "updateSeries", [
      {
        data: candles,
      },
    ]);
  } catch (err) {}
};

const initializeData = (updateChart, ric) => {
  getCandles(ric, updateChart);
};

const getCandles = async (ric, updateChart) => {
  if (!ric) {
    return;
  }
  candles = [];
  max = 0;
  min = Number.MAX_SAFE_INTEGER;
  const today = new Date().toISOString().split("T")[0];
  let candle = await axios.get(
    `https://api.binomo.com/platform/candles/${ric}/${today}T00:00:00/60?locale=en`
  );
  candle = candle.data.data;
  if (candle.length > 30) candle = candle.slice(candle.length - 30);

  const series = candle.map((el, index) => {
    min = Math.min(el.open, el.high, el.low, el.close, min);
    max = Math.max(el.open, el.high, el.low, el.close, max);
    if (updateChart) {
      // ApexCharts.exec("tradeChart", "updateOptions", {
      //   yaxis: {
      //     min,
      //     max,
      //   },
      // });
      setYAxis(min, max);
    }

    return {
      x: new Date(el.created_at),
      y: [el.open, el.high, el.low, el.close],
    };
  });
  candles = series;

  if (updateChart) {
    ApexCharts.exec("tradeChart", "updateSeries", [
      {
        data: candles,
      },
    ]);
  }
};

export { setInitializeFunction, initializeData };
