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
} from "@material-ui/core";
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

function Setting() {
  const classes = styles();
  const [balanceType, setBalanceType] = useState("demo");

  const handleBalanceChange = (e) => {
    setBalanceType(e.target.value);
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
              ></TextField>
            }
            label={<Typography>Max Profit / Day:</Typography>}
            labelPlacement="top"
            className={classes.controlContainer}
          />
        </FormControl>
        <StyledButton>Save</StyledButton>
      </div>
    </>
  );
}

export default Setting;
