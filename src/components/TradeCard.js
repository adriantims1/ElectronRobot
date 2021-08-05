import React, { useContext } from "react";
import { ListItem, makeStyles, Box, Typography } from "@material-ui/core";
import getSymbolFromCurrency from "currency-symbol-map";
import ChartDataContext from "../context/ChartDataContext";
import InitDataContext from "../context/InitDataContext";

const styles = makeStyles((theme) => ({
  panelCard: {
    margin: "10px 0px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
    width: "100%",
    boxShadow: theme.shadows[6],
  },
  win: {
    backgroundColor: theme.palette.secondary.main,
  },
  tradeText: {
    color: theme.palette.secondary.main,
  },
  tradeTextWin: {
    color: "white",
  },
}));
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
function TradeCard({ name, trend, status, win }) {
  const classes = styles();
  const { state: cdState } = useContext(ChartDataContext);
  const { state } = useContext(InitDataContext);
  return (
    <>
      <ListItem
        className={`${classes.panelCard} ${
          status === "won" ? classes.win : null
        }`}
      >
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <img src={cdState.iconPic[name]} height="20px" />

          <Typography
            className={`${classes.tradeText} ${
              status === "won" ? classes.tradeTextWin : null
            }`}
          >
            {name}
          </Typography>
          <Typography
            className={`${classes.tradeText} ${
              status === "won" ? classes.tradeTextWin : null
            }`}
          >
            {trend}
          </Typography>
          <Typography
            className={`${classes.tradeText} ${
              status === "won" ? classes.tradeTextWin : null
            }`}
          >
            {status}
          </Typography>
          <Typography
            className={`${classes.tradeText} ${
              status === "won" ? classes.tradeTextWin : null
            }`}
          >
            {win % 100 == 0
              ? `${getSymbolFromCurrency(state.iso)} ${
                  numberWithCommas(win / 100) + ".00"
                }`
              : `${getSymbolFromCurrency(state.iso)} ${numberWithCommas(
                  win / 100
                )}`}
          </Typography>
        </Box>
      </ListItem>
    </>
  );
}

export default TradeCard;
