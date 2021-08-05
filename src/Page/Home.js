import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  makeStyles,
  Tabs,
  Tab,
  withStyles,
  List,
  Divider,
  Link,
} from "@material-ui/core";

import InitDataContext from "../context/InitDataContext";
import ChartDataContext from "../context/ChartDataContext";
import getSymbolFromCurrency from "currency-symbol-map";

import TradePanel from "../components/TradePanel";

import {
  getBalanceFromBank,
  getTradeHistory,
} from "../Utilities/BusinessLogic";

import Error from "./Error";

const styles = makeStyles((theme) => ({
  balanceCard: {
    width: "45%",
    backgroundColor: theme.palette.secondary.main,
  },
}));

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const StyledTabs = withStyles((theme) => ({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: theme.palette.secondary.main,
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const Home = () => {
  const classes = styles();
  const { state, setBalance, setIso, setTradeHistory } =
    useContext(InitDataContext);

  const [error, setError] = useState(false);
  const [tradeTab, setTradeTab] = useState(0);
  const [balanceTypeIsDemo, setBalanceTypeIsDemo] = useState(true);
  const [todayProfitTypeIsDemo, setTodayProfitTypeIsDemo] = useState(true);
  useEffect(() => {
    // if (!state.isLoggedIn) {
    //   return;
    // }
    try {
      getBalanceFromBank(setBalance, setIso);
      getTradeHistory(setTradeHistory);
    } catch (err) {
      setError(true);
    }
  }, [state.isLoggedIn]);

  return error ? (
    <Error />
  ) : (
    <div
      style={{
        display: "flex",
        marginTop: "5%",
        marginBottom: "5%",
        height: "90%",
        flexDirection: "column",

        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Box
        display="flex"
        flex={2}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Card className={classes.balanceCard}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography style={{ color: "white" }}>
                {balanceTypeIsDemo ? "Demo" : "Real"} Balance
              </Typography>
              <Link
                component="span"
                onClick={() => {
                  setBalanceTypeIsDemo((prev) => !prev);
                }}
                underline="none"
                style={{ cursor: "pointer" }}
              >
                Change Balance Type
              </Link>
            </Box>
          </CardContent>
          <CardContent style={{ color: "white", fontSize: "30px" }}>
            {balanceTypeIsDemo
              ? `${getSymbolFromCurrency(state.iso)} ${
                  state.balance.demo % 100 === 0
                    ? numberWithCommas(state.balance.demo / 100) + ".00"
                    : numberWithCommas(state.balance.demo / 100)
                }`
              : `${getSymbolFromCurrency(state.iso)} ${
                  state.balance.real % 100 === 0
                    ? numberWithCommas(state.balance.real / 100) + ".00"
                    : numberWithCommas(state.balance.real / 100)
                }`}
          </CardContent>
        </Card>
        <Card className={classes.balanceCard} style={{ marginRight: "10px" }}>
          <CardContent>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography style={{ color: "white" }}>
                Today {todayProfitTypeIsDemo ? "Demo" : "Real"} Profit
              </Typography>
              <Link
                component="span"
                onClick={() => {
                  setTodayProfitTypeIsDemo((prev) => !prev);
                }}
                underline="none"
                style={{ cursor: "pointer" }}
              >
                Change Profit Type
              </Link>
            </Box>
          </CardContent>
          <CardContent style={{ color: "white", fontSize: "30px" }}>
            {todayProfitTypeIsDemo
              ? `${getSymbolFromCurrency(state.iso)} ${
                  state.todayProfit.demo % 100 === 0
                    ? numberWithCommas(state.todayProfit.demo / 100) + ".00"
                    : numberWithCommas(state.todayProfit.demo / 100)
                }`
              : `${getSymbolFromCurrency(state.iso)} ${
                  state.todayProfit.real % 100 === 0
                    ? numberWithCommas(state.todayProfit.real / 100) + ".00"
                    : numberWithCommas(state.todayProfit.real / 100)
                }`}
          </CardContent>
        </Card>
      </Box>

      <Box flex={4} width="100%">
        <Typography variant="h5">Trade History: </Typography>
        <Divider />
        <Box width="100%" height="15%">
          <StyledTabs
            value={tradeTab}
            onChange={(e, newValue) => {
              setTradeTab(newValue);
            }}
            centered
          >
            <StyledTab label="Demo" />
            <StyledTab label="Real" />
          </StyledTabs>
        </Box>
        <Box maxHeight="85%" width="100%" overflow="hidden">
          <List
            style={{
              height: 300,
              overflowY: "auto",
              position: "relative",
              padding: "10px",
              boxSizing: "content-box",
            }}
          >
            <TradePanel tradeTab={tradeTab} />
          </List>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
