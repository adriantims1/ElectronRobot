import React, { useContext } from "react";

import InitDataContext from "../context/InitDataContext";

import TradeCard from "./TradeCard";

function TradePanel({ tradeTab }) {
  const { state } = useContext(InitDataContext);

  return (
    <>
      {tradeTab === 0
        ? state.tradeHistory.demo.map(({ name, status, trend, win }, index) => (
            <TradeCard
              name={name}
              status={status}
              trend={trend}
              win={win}
              key={index}
            />
          ))
        : state.tradeHistory.real.map(({ name, status, trend, win }, index) => (
            <TradeCard
              name={name}
              status={status}
              trend={trend}
              win={win}
              key={index}
            />
          ))}
    </>
  );
}

export default TradePanel;
