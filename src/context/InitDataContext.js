import React, { useReducer } from "react";

const InitDataContext = React.createContext();

const initDataReducer = (state, action) => {
  switch (action.type) {
    case "set_settings":
      return { ...state, settings: action.payload };
    case "set_balance":
      return { ...state, balance: action.payload };
    case "set_todayProfit":
      return { ...state, todayProfit: action.payload };
    case "set_iso":
      return { ...state, iso: action.payload };
    case "set_tradeHistory":
      return { ...state, tradeHistory: action.payload };
    case "set_isLoggedIn":
      return { ...state, isLoggedIn: action.payload };

    default:
      return state;
  }
};

export const InitDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(initDataReducer, {
    balance: { real: 0, demo: 0 },
    todayProfit: {
      demo: 0,
      real: 0,
    },
    settings: { maxLoss: 20, maxProfit: 0, balanceType: "demo" },
    //tradeData = {asset_name, status, trend, win, uuid}
    tradeHistory: { demo: [], real: [] },
    iso: "USD",
    isLoggedIn: false,
  });
  const setSettings = (Settings) => {
    //Settings = String

    dispatch({ type: "set_settings", payload: Settings });
  };

  const setTodayProfit = (profit) => {
    dispatch({ type: "set_todayProfit", payload: profit });
  };
  const setBalance = (balance) => {
    dispatch({ type: "set_balance", payload: balance });
  };
  const setIso = (iso) => {
    dispatch({ type: "set_iso", payload: iso });
  };
  const setTradeHistory = (tradeHistory) => {
    dispatch({ type: "set_tradeHistory", payload: tradeHistory });
  };
  const setIsLoggedIn = (isLoggedIn) => {
    dispatch({ type: "set_isLoggedIn", payload: isLoggedIn });
  };

  return (
    <InitDataContext.Provider
      value={{
        state,
        setSettings,
        setTodayProfit,
        setBalance,
        setIso,
        setTradeHistory,
        setIsLoggedIn,
      }}
    >
      {children}
    </InitDataContext.Provider>
  );
};

export default InitDataContext;
