import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  FormControl,
  FormControlLabel,
  makeStyles,
  Snackbar,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  connectDataWebSocket,
  connectUserWebSocket,
  ws,
  asSocket,
  getCandles,
} from "../Utilities/TradeTools";

import axios from "axios";

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

const Login = (props) => {
  const classes = styles();
  const [snackbar, setSnackBar] = useState(false);
  const [authorization, setAuthorization] = useState(
    localStorage.getItem("authtoken") !== null
      ? localStorage.getItem("authtoken")
      : ""
  );
  const [device, setDevice] = useState(
    localStorage.getItem("deviceid") !== null
      ? localStorage.getItem("deviceid")
      : ""
  );
  const [loading, setLoading] = useState(false);

  const handleAuthorization = (e) => {
    setAuthorization(e.target.value);
  };

  const handleDevice = (e) => {
    setDevice(e.target.value);
  };

  const handleSnackbar = (e) => {
    setSnackBar(false);
  };

  async function getBalance() {
    let config = {
      headers: {
        "Authorization-Token": authorization,
        "Device-Id": device,
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    let data = await axios.get(
      "https:api.binomo.com/bank/v1/read?locale=en",
      config
    );
    data = data.data.data;
    console.log(data);
    props.setDemo(data[0].amount / 100);
    props.setReal(data[1].amount / 100);
    props.setIso(data[0].currency);
  }

  function handleConnect() {
    localStorage.setItem("authtoken", authorization);
    localStorage.setItem("deviceid", device);
    setLoading(true);
    connectUserWebSocket();
    let wsOpen,
      asOpen = false;
    ws.addEventListener("error", function () {
      setLoading(false);
      setSnackBar(true);
      console.log("Cannot Connect");
    });
    ws.addEventListener("open", function () {
      wsOpen = true;
      getCandles();
      getBalance();
      if (asOpen) {
        setLoading(false);
        props.setConnected(true);
      }

      console.log("User Authentication Successful");
    });

    connectDataWebSocket();
    asSocket.onError = function () {
      console.log("Cannot Connect");
    };
    asSocket.addEventListener("open", function () {
      asOpen = true;
      if (wsOpen) {
        setLoading(false);
        props.setConnected(true);
      }
      console.log("As Socket Ready");
    });
  }
  return (
    <>
      <Dialog open={!props.connected}>
        <DialogTitle>Get the information from the website</DialogTitle>
        <DialogContent>
          <FormControl fullWidth={true}>
            <FormControlLabel
              control={
                <TextField
                  variant="outlined"
                  value={authorization}
                  onChange={handleAuthorization}
                  autoFocus={true}
                />
              }
              label="Authorization Token: "
              labelPlacement="top"
              className={classes.controlContainer}
              style={{ marginBottom: "20px" }}
            />
          </FormControl>

          <FormControl fullWidth={true}>
            <FormControlLabel
              control={
                <TextField
                  variant="outlined"
                  value={device}
                  onChange={handleDevice}
                />
              }
              label="Device Id: "
              labelPlacement="top"
              className={classes.controlContainer}
              style={{ marginBottom: "20px" }}
            />
          </FormControl>
          <Fade in={loading} unmountOnExit>
            <CircularProgress color="secondary" />
          </Fade>
        </DialogContent>

        <DialogActions>
          <StyledButton onClick={handleConnect}>Connect</StyledButton>
        </DialogActions>
        <Snackbar
          open={snackbar}
          autoHideDuration={10000}
          onClose={handleSnackbar}
        >
          <Alert severity="error">
            Error Authenticating (Wrong Email or Password)
          </Alert>
        </Snackbar>
      </Dialog>

      <div
        style={{
          display: "flex",
          marginTop: "5%",
          marginBottom: "5%",
          height: "90%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Box>
          <Typography variant="h1" color="secondary">
            Hello!
          </Typography>
        </Box>

        <Box>
          <Typography>Check your settings before trade</Typography>
        </Box>
      </div>
    </>
  );
};

export default Login;
