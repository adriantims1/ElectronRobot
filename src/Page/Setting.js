import React, { useState, useContext } from "react";
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

import getSymbolFromCurrency from "currency-symbol-map";
import { Alert } from "@material-ui/lab";

//Context
import InitDataContext from "../context/InitDataContext";

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
const styles = makeStyles((theme) => ({
  controlContainer: {
    alignItems: "flex-start",
  },
}));

function Setting() {
  const classes = styles();
  const { state, setSettings } = useContext(InitDataContext);

  const [maxLoss, setMaxLoss] = useState(state.settings.maxLoss);
  const [maxProfit, setMaxProfit] = useState(state.settings.maxProfit);
  const [balanceType, setBalanceType] = useState(state.settings.balanceType);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const handleBalanceChange = (e) => {
    setBalanceType(e.target.value);
  };
  const handleMaxProfit = (e) => {
    setMaxProfit(Number(e.target.value));
  };
  const handleMaxLoss = (e) => {
    setMaxLoss(Number(e.target.value));
  };
  const handleSave = (e) => {
    if (maxLoss < 20 || maxProfit < 0) {
      setErrorSnackbar(true);
    } else {
      setSettings({ maxLoss, maxProfit, balanceType });
      setSuccessSnackbar(true);
    }
  };
  const handleErrorSnackbar = (e) => {
    setErrorSnackbar(false);
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
                    <InputAdornment position="start">
                      {getSymbolFromCurrency(state.iso)}
                    </InputAdornment>
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
                    <InputAdornment position="start">
                      {getSymbolFromCurrency(state.iso)}
                    </InputAdornment>
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
          open={errorSnackbar}
          autoHideDuration={10000}
          onClose={handleErrorSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="error">
            Max Loss must be greater than $10 and Max profit must be greater
            than $0
          </Alert>
        </Snackbar>
        <Snackbar
          open={successSnackbar}
          autoHideDuration={10000}
          onClose={() => {
            setSuccessSnackbar(false);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity="success">Successful!</Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default Setting;
