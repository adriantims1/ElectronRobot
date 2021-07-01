import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  MenuItem,
  withStyles,
  Typography,
} from "@material-ui/core";
import Chart from "../Utilities/Chart";

import { allMarket } from "../Utilities/TradeTools";

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

const Trade = () => {
  const [open, setOpen] = useState(false);
  const [availableMarket, setAvailableMarket] = useState([]);
  const [market, setMarket] = useState(0);
  const [chartProps, setChartProps] = useState(null);
  const [startTrade, setStartTrade] = useState(false);
  const [int2, setInt2] = useState();

  useEffect(() => {
    //get all available assets
    //<------------------------------------------->
    console.log(allMarket);
    setAvailableMarket(allMarket);
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
    console.log({
      name: availableMarket[market].name,
      ric: availableMarket[market].ric,
    });
    setChartProps({
      name: availableMarket[market].name,
      ric: availableMarket[market].ric,
    });
    handleClose();
  };
  const start = () => {
    if (startTrade) {
      clearInterval(int2);
    } else {
      setInt2(setInterval(() => {}, 1000));
    }
    setStartTrade((prev) => !prev);
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
          <Typography>Balance: $5,800</Typography>
          <Typography>Status: Winning</Typography>
          <Typography>Investment: $1.8</Typography>
          <Typography>Trend: Call</Typography>
        </div>
        <StyledButton onClick={start}>
          {startTrade ? "Stop Trade" : "Start Trade"}
        </StyledButton>
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
