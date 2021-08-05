import React, { useState } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  Paper,
  Container,
} from "@material-ui/core";
import Settings from "./Page/Setting";
import Login from "./Page/Login";
import Trade from "./Page/Trade";
import Navbar from "./components/Navbar";
import Home from "./Page/Home";

const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      root: {
        position: "relative",
        "& $notchedOutline": {
          borderColor: "rgba(0, 0, 0, 0.23)",
          borderWidth: 3,
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "#0b4870",
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },
        },
        "&$focused $notchedOutline": {
          borderColor: "#0b4870",
          borderWidth: 3,
        },
      },
    },

    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "#4A90E2",
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: "0px",
        marginRight: "0px",
      },
      labelPlacementTop: {
        marginLeft: "0px",
        flexDirection: "column-reverse",
      },
    },
    MuiButton: {
      disabled: {
        opacity: 0.5,
        color: "white",
      },
    },
  },
  palette: {
    action: {
      disabled: "white",
    },
    primary: {
      main: "#fdfeff",
      dark: "#f7f9fb",
    },
    secondary: {
      light: "#B0D2E8",
      main: "#0b4870",
    },
  },
});

function App() {
  const [connected, setConnected] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Navbar setConnected={setConnected} />
        <div
          style={{
            width: "80%",
            height: "95%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper style={{ width: "90%" }} elevation={3}>
            <Switch>
              <Container maxWidth="lg" style={{ height: "100%" }}>
                <Route exact path="/setting">
                  <Settings />
                </Route>
                <Route exact path="/trade">
                  <Trade connected={connected} />
                </Route>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/">
                  <Login setConnected={setConnected} connected={connected} />
                </Route>
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Container>
            </Switch>
          </Paper>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
