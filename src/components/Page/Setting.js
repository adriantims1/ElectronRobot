import React, { useState } from "react";
import {
  makeStyles,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  withStyles,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";
import { setSettings } from "../Utilities/TradeTools";
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
const styles = makeStyles((theme) => ({
  controlContainer: {
    alignItems: "flex-start",
  },
}));

function Setting({ balanceType, setBalanceType }) {
  const classes = styles();

  const [maxLoss, setMaxLoss] = useState(20);
  const [maxProfit, setMaxProfit] = useState(0);
  const [snackbar, setSnackbar] = useState(false);

  const handleBalanceChange = (e) => {
    setBalanceType(e.target.value);
  };
  const handleMaxProfit = (e) => {
    setMaxProfit(e.target.value);
  };
  const handleMaxLoss = (e) => {
    setMaxLoss(e.target.value);
  };
  const handleSave = (e) => {
    if (maxLoss >= 20 && maxProfit >= 0) {
      setSettings(maxLoss, maxProfit, balanceType);
    } else {
      setSnackbar(true);
    }
  };
  const handleSnackbar = (e) => {
    setSnackbar(false);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "5%",
          marginBottom: "5%",
          height: "90%",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <FormControl fullWidth={true}>
          <Typography>Select Balance Type: </Typography>
          <RadioGroup
            row
            value={balanceType}
            onChange={handleBalanceChange}
            name="balance"
          >
            <FormControlLabel
              value="demo"
              control={<Radio />}
              label="Demo Balance"
            />
            <FormControlLabel
              value="real"
              control={<Radio />}
              label="Real Balance"
            />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth={true}>
          <FormControlLabel
            control={
              <TextField
                id="maxProfit"
                type="Number"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                margin="dense"
                value={maxLoss}
                onChange={handleMaxLoss}
              ></TextField>
            }
            label={<Typography>Max Loss / Day: </Typography>}
            labelPlacement="top"
            className={classes.controlContainer}
          />
        </FormControl>

        <FormControl fullWidth={true}>
          <FormControlLabel
            control={
              <TextField
                id="maxProfit"
                type="Number"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                margin="dense"
                value={maxProfit}
                onChange={handleMaxProfit}
              ></TextField>
            }
            label={<Typography>Max Profit / Day:</Typography>}
            labelPlacement="top"
            className={classes.controlContainer}
          />
        </FormControl>
        <StyledButton onClick={handleSave}>Save</StyledButton>
        <Snackbar
          open={snackbar}
          autoHideDuration={10000}
          onClose={handleSnackbar}
        >
          <Alert severity="error">
            Max Loss must be greater than $10 and Max profit must be greater
            than $0
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Setting;
