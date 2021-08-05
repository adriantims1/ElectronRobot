import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  withStyles,
  ListItemText,
} from "@material-ui/core";

import ApexCharts from "apexcharts";

//Components
import Chart from "../components/Chart";

//Context
import ChartDataContext from "../context/ChartDataContext";
import InitDataContext from "../context/InitDataContext";

//
import { initializeData } from "../Utilities/ChartLogic";
import { subscribeAsSocket } from "../Utilities/WebSocket";
import Error from "./Error";

import { startRobot, stopRobot } from "../Utilities/TradeLogic";

const StyledButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    width: "30%",
    alignSelf: "center",
  },
  label: {
    textTransform: "capitalize",
  },
  disabled: {
    opacity: 0.5,
  },
}))(Button);

const Trade = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loadMarket, setLoadMarket] = useState(true);
  const { state, setSelectedMarket, setTrade, setTitle } =
    useContext(ChartDataContext);
  const { state: idState } = useContext(InitDataContext);
  const [marketSelected, setMarketSelected] = useState(state.selectedMarket);
  const [prevMarket, setprevMarket] = useState(state.selectedMarket);

  const getTodayProfit = () => {
    if (idState.settings.balanceType === "demo") {
      return idState.todayProfit.demo;
    } else {
      return idState.todayProfit.real;
    }
  };
  useEffect(() => {
    try {
      setLoadMarket(true);
      initializeData(true, state.selectedMarket.ric);
      subscribeAsSocket(prevMarket.ric, state.selectedMarket.ric, true);
      setprevMarket(state.selectedMarket);
      setTitle(state.selectedMarket.name);
      setLoadMarket(false);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, [state.selectedMarket]);

  const handleStartRobot = () => {
    if (
      idState.balance[idState.settings.balanceType] < idState.settings.maxLoss
    ) {
      return;
    }
    if (state.isTradeOpen === "close") {
      setTrade("loading");
      startRobot(
        {
          ric: state.selectedMarket.ric,
          iso: state.selectedMarket.iso,
          balanceType: idState.settings.balanceType,
        },
        idState.settings.maxProfit,
        idState.settings.maxLoss,
        getTodayProfit,
        setTrade
      );
    } else {
      setTrade("close");
      stopRobot();
    }
  };

  return error ? (
    <Error />
  ) : (
    <>
      <Box width="100%" height="70%">
        {loadMarket ? <CircularProgress color="secondary" /> : <Chart />}
      </Box>
      <Box
        width="100%"
        height="30%"
        display="flex"
        alignItems="center"
        justifyContent="space-evenly"
      >
        <StyledButton
          onClick={() => {
            setOpenDialog(true);
          }}
          disabled={state.isTradeOpen === "loading"}
        >
          Change Market
        </StyledButton>
        <StyledButton
          disabled={state.isTradeOpen === "loading"}
          onClick={handleStartRobot}
        >
          {state.isTradeOpen === "close" ? (
            "Start Trade"
          ) : state.isTradeOpen === "open" ? (
            "Stop Trade"
          ) : (
            <CircularProgress color="primary" size={25} />
          )}
        </StyledButton>
      </Box>
      <Dialog open={openDialog}>
        <DialogTitle>Select the Available Market</DialogTitle>
        <DialogContent>
          <List>
            {state.allMarkets.map((el, index) => (
              <ListItem
                button
                selected={el.ric === marketSelected.ric}
                style={{ justifyContent: "space-between", display: "flex" }}
                onClick={() => {
                  setMarketSelected(el);
                }}
                key={index}
              >
                <ListItemAvatar>
                  <img src={el.url} height="25px" />
                </ListItemAvatar>
                <ListItemText primary={el.name} />
                <ListItemText primary={el.percent + "%"} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <StyledButton
            onClick={() => {
              setOpenDialog(false);
              setMarketSelected(state.selectedMarket);
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={() => {
              setSelectedMarket(marketSelected);
              setOpenDialog(false);
            }}
          >
            Save
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Trade;
