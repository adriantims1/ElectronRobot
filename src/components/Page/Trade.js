import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fade,
  MenuItem,
  Select,
  Typography,
  withStyles,
} from "@material-ui/core";
import Chart from "../Utilities/Chart";

import {
  allMarket,
  openTrade,
  closeTrade,
  setAsset,
  balanceType,
  ws,
  increaseCompIndex,
} from "../Utilities/TradeTools";

import {
  aMarket,
  m,
  cProps,
  sTrade,
  i,
  t,
  s,
  setter,
} from "../initialState/tradeInitialState";

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
}))(Button);

const Trade = ({ iso, real, demo, setDemo, setReal }) => {
  const [open, setOpen] = useState(false);
  const [availableMarket, setAvailableMarket] = useState(aMarket);
  const [market, setMarket] = useState(m);
  const [chartProps, setChartProps] = useState(cProps);
  const [startTrade, setStartTrade] = useState(sTrade);
  const [fade, setFade] = useState(false);
  const [investment, setInvestment] = useState(i);
  const [trend, setTrend] = useState(t);
  const [status, setStatus] = useState(s);

  useEffect(() => {
    //get all available assets
    //<------------------------------------------->
    setAvailableMarket(allMarket);
    setter("aMarket", allMarket);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setMarket(e.target.value);
  };
  const handleOk = () => {
    setChartProps({
      name: availableMarket[market].name,
      ric: availableMarket[market].ric,
    });
    setter("cProps", {
      name: availableMarket[market].name,
      ric: availableMarket[market].ric,
    });
    setAsset(availableMarket[market]);
    handleClose();
  };
  const start = () => {
    let trendInStart, openPriceInStart;
    if (startTrade) {
      closeTrade();
      setStartTrade((prev) => !prev);
      setter("sTrade", false);
      ws.removeEventListener("message", () => {});
    } else {
      ws.addEventListener("message", (res) => {
        res = JSON.parse(res.data);
        switch (res.event) {
          case "deal_created":
            setTrend(res.payload.trend === "call" ? "Up" : "Down");
            setter("t", res.payload.trend === "call" ? "Up" : "Down");
            trendInStart = res.payload.trend;
            openPriceInStart = res.payload.open_rate;
            setInvestment(res.payload.amount / 100);
            setter("i", res.payload.amount / 100);
            setStatus("Trading");
            setter("s", "Trading");
            break;
          case "close_deal_batch":
            setTrend("");
            setter("t", "");
            setInvestment(0);
            setter("i", "");
            if (trendInStart === "call") {
              setStatus(
                res.payload.end_rate > openPriceInStart
                  ? "Win"
                  : res.payload.end_rate < openPriceInStart
                  ? "Lose"
                  : "No Change"
              );
              setter(
                "s",
                res.payload.end_rate > openPriceInStart
                  ? "Win"
                  : res.payload.end_rate < openPriceInStart
                  ? "Lose"
                  : "No Change"
              );
              if (res.payload.end_rate < openPriceInStart) {
                increaseCompIndex();
              }
            } else {
              setStatus(
                res.payload.end_rate < openPriceInStart
                  ? "Win"
                  : res.payload.end_rate > openPriceInStart
                  ? "Lose"
                  : "No Change"
              );
              setter(
                "s",
                res.payload.end_rate < openPriceInStart
                  ? "Win"
                  : res.payload.end_rate > openPriceInStart
                  ? "Lose"
                  : "No Change"
              );
              if (res.payload.end_rate > openPriceInStart) {
                increaseCompIndex();
              }
            }
            break;
          case "change_balance":
            setDemo(res.payload.demo_balance / 100);
            setReal(res.payload.balance / 100);
            break;
          default:
        }
      });
      var d = new Date();
      var interval;
      if (d.getSeconds() !== 58) {
        setFade(true);
        interval = setInterval(() => {
          d.setSeconds(d.getSeconds() + 1);
          if (d.getSeconds() === 58) {
            openTrade(iso);
            setFade(false);
            clearInterval(interval);
            setStartTrade((prev) => !prev);
            setter("sTrade", true);
          }
        }, 1000);
      }
    }
  };
  return (
    <>
      <Chart
        market={
          chartProps !== null
            ? chartProps
            : { name: "Crypto IDX", ric: "Z-CRY/IDX" }
        }
      />
      <div
        style={{
          display: "flex",

          justifyContent: "space-between",
        }}
      >
        <StyledButton onClick={handleClickOpen}>Change Market</StyledButton>
        <div>
          <Typography>
            Balance: {balanceType === "demo" ? demo : real}
          </Typography>
          <Typography>Balance Type: {balanceType}</Typography>
          <Typography>Status: {status}</Typography>
          <Typography>
            Investment: {iso === "USD" ? "$" : iso}
            {investment}
          </Typography>
          <Typography>Trend: {trend}</Typography>
        </div>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            justifyContent: "center",
          }}
        >
          {fade ? (
            <Fade in={fade} unmountOnExit>
              <div>
                <CircularProgress color="secondary" />
                <Typography>Please Wait!</Typography>
              </div>
            </Fade>
          ) : (
            <StyledButton onClick={start} style={{ width: "100%" }}>
              {startTrade ? "Stop Trade" : "Start Trade"}
            </StyledButton>
          )}
        </Box>
      </div>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Choose the Market</DialogTitle>
        <DialogContent>
          <Select defaultValue={0} value={market} onChange={handleChange}>
            {availableMarket.map((el, index) => (
              <MenuItem value={index} key={el.ric}>
                {`${el.name} (${el.percent}%)`}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <StyledButton onClick={handleOk}>Ok</StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Trade;
