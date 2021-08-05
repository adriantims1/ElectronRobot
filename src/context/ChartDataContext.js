import React, { useReducer } from "react";

import { getAllMarket } from "../Utilities/BusinessLogic";

const ChartDataContext = React.createContext();

const ChartDataReducer = (state, action) => {
  switch (action.type) {
    case "set_allMarket":
      return { ...state, allMarkets: action.payload };
    case "set_selectedMarket":
      return { ...state, selectedMarket: action.payload };
    case "set_trade":
      return { ...state, isTradeOpen: action.payload };

    case "set_data":
      return { ...state, data: action.payload };

    case "set_iconPic":
      return { ...state, iconPic: action.payload };
    case "add_annotation":
      return {
        ...state,
        options: {
          ...state.options,
          annotations: {
            yaxis: [
              {
                y: action.payload.price,
                borderColor: "#0b4870",
                label: {
                  position: "left",
                  borderColor: "#0b4870",
                  style: {
                    color: "#fff",
                    background: "#0b4870",
                  },
                  text: `Win if ${
                    action.payload.trend === "call" ? "higher" : "lower"
                  }`,
                },
              },
            ],
          },
        },
      };
    case "remove_annotation":
      return {
        ...state,
        options: { ...state.options, annotations: { yaxis: [] } },
      };
    case "set_yaxis":
      return {
        ...state,
        options: {
          ...state.options,
          yaxis: {
            ...state.options.yaxis,
            min: action.payload.min,
            max: action.payload.max,
          },
        },
      };
    case "set_title":
      return {
        ...state,
        options: {
          ...state.options,
          title: {
            text: action.payload,
          },
        },
      };
    default:
      return state;
  }
};

export const ChartDataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ChartDataReducer, {
    allMarkets: [],
    selectedMarket: {},
    isTradeOpen: "close",
    data: [],
    iconPic: {},
    options: {
      chart: {
        id: "tradeChart",
        type: "candlestick",
        height: "100%",
        animations: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        type: "datetime",
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        tooltip: {
          enabled: false,
        },
      },
    },
  });
  const setAvailableMarket = async () => {
    let allMarkets = await getAllMarket(setIconPic);
    //Settings = String

    dispatch({ type: "set_allMarket", payload: allMarkets });

    if (Object.keys(state.selectedMarket).length === 0) {
      setSelectedMarket(allMarkets[0]);
    }
  };
  const setIconPic = (iconPic) => {
    dispatch({ type: "set_iconPic", payload: iconPic });
  };
  const setData = (candles) => {
    console.log("being called");
    dispatch({ type: "set_data", payload: candles });
  };
  const setSelectedMarket = (market) => {
    //deviceId = String
    dispatch({ type: "set_selectedMarket", payload: market });
  };
  const setTrade = (trade) => {
    //authToken = String
    dispatch({ type: "set_trade", payload: trade });
  };

  const addAnnotation = (price, trend) => {
    dispatch({ type: "add_annotation", payload: { price, trend } });
  };

  const removeAnnotation = () => {
    dispatch({ type: "remove_annotation", payload: {} });
  };

  const setYAxis = (min, max) => {
    dispatch({ type: "set_yaxis", payload: { min, max } });
  };

  const setTitle = (title) => {
    dispatch({ type: "set_title", payload: title });
  };

  return (
    <ChartDataContext.Provider
      value={{
        state,
        setAvailableMarket,
        setData,
        setSelectedMarket,
        setTrade,
        addAnnotation,
        removeAnnotation,
        setYAxis,
        setTitle,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  );
};

export default ChartDataContext;
