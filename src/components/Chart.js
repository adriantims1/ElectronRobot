import React, { useEffect, useContext } from "react";
import { initializeData } from "../Utilities/ChartLogic";
import ReactApexChart from "react-apexcharts";

import ChartDataContext from "../context/ChartDataContext";
function Chart() {
  const { state } = useContext(ChartDataContext);
  useEffect(() => {
    initializeData(true);
  }, []);

  return (
    //When using context, change series to be [{data: state.data}]
    <ReactApexChart
      type="candlestick"
      options={state.options}
      series={[{ data: [] }]}
      height="100%"
    />
  );
}

export default Chart;
