import React, { useState, useContext } from "react";
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
  connectAsSocket,
  connectWsSocket,
  wsSocket,
  asSocket,
  subscribeAsSocket,
} from "../Utilities/WebSocket";

import { isSameDay } from "date-fns";
import { v4 as uuidv4 } from "uuid";

//Context
import ChartDataContext from "../context/ChartDataContext";
import InitDataContext from "../context/InitDataContext";

//Chart Setter Initialization
import { setInitializeFunction } from "../Utilities/ChartLogic";

//SVG
import Hello from "../assets/Hello.svg";

//annotation
import { initializeAnnotation } from "../Utilities/WebSocketLogic";

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

const Login = ({ setConnected, connected }) => {
  const classes = styles();
  const { setAvailableMarket, addAnnotation, removeAnnotation, setYAxis } =
    useContext(ChartDataContext);
  const { setTodayProfit: setTodayProfitFunc } = useContext(InitDataContext);
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

  const setTodayProfit = () => {
    //todayProfits = {demo: Number, real: Number, date: Date}
    let todayProfits = JSON.parse(localStorage.getItem("todayprofits"));
    if (todayProfits && isSameDay(todayProfits.date, new Date.now())) {
      setTodayProfitFunc({ real: todayProfits.real, demo: todayProfits.demo });
      localStorage.setItem(
        "todayprofits",
        JSON.stringify({
          real: todayProfits.real,
          demo: todayProfits.demo,
          date: new Date.now(),
        })
      );
      console.log("new profit updated");
    }
    console.log("no profit updated");
  };
  function handleConnect() {
    localStorage.setItem("authtoken", authorization);
    localStorage.setItem("deviceid", device);
    setLoading(true);
    connectWsSocket(authorization, device);

    wsSocket.onerror = function () {
      setLoading(false);
      setSnackBar(true);
    };
    wsSocket.addEventListener("open", function () {
      connectAsSocket();
      asSocket.onError = function () {};
      asSocket.addEventListener("open", function () {
        setLoading(false);
        setConnected(true);
        wsSocket.removeEventListener("open", () => {});
        asSocket.removeEventListener("open", () => {});
        subscribeAsSocket("", "Z-CRY/IDX", false);
        setInitializeFunction(setYAxis);
        setAvailableMarket();
        setTodayProfit();
        initializeAnnotation(addAnnotation, removeAnnotation);
      });
    });
  }
  return (
    <>
      <Dialog open={!connected}>
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
        </DialogContent>

        <DialogActions>
          <StyledButton onClick={handleConnect} disabled={loading}>
            {!loading ? (
              "Connect"
            ) : (
              <CircularProgress color="primary" size={25} />
            )}
          </StyledButton>
        </DialogActions>
        <Snackbar
          open={snackbar}
          autoHideDuration={10000}
          onClose={handleSnackbar}
        >
          <Alert severity="error">
            Error Authenticating (Wrong Authorization Token or Device Id)
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
        <img src={Hello} width="100%" />
        <Typography
          variant="h1"
          color="secondary"
          style={{ margin: "10px 0px" }}
        >
          Hello!
        </Typography>
        <Typography>Check your settings before trade</Typography>
      </div>
    </>
  );
};

export default Login;
