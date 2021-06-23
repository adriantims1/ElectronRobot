import React, { useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import useWebSocket from "react-use-websocket";

const Trade = () => {
  const [st, setSt] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
  });
  const [ws, setWs] = useState(
    useWebSocket("wss://as.binomo.com/", {
      onOpen: () => {},
      onClose: () => {},
      onMessage: () => {
        ApexCharts.exec("realtime", "updateSeries", [
          {
            data: temp2,
          },
        ]);
      },
    })
  );
  return (
    <Chart options={st.options} series={st.series} type="line" width="100%" />
  );
};

export default Trade;
