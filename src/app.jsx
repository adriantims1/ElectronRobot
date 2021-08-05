import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import { ChartDataProvider } from "./context/ChartDataContext"
import { InitDataProvider } from "./context/InitDataContext"

ReactDOM.render(
  <ChartDataProvider>
    <InitDataProvider>
      <Router>
        <App />
      </Router>
    </InitDataProvider>
  </ChartDataProvider>
  ,
  document.body
);
