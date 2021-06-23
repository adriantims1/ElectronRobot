import React, { useState } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  Paper,
  Container,
} from "@material-ui/core";
import Setting from "./components/Page/Setting";
import Statistic from "./components/Page/Statistic";
import Login from "./components/Page/Login";
import Trade from "./components/Page/Trade";
import Navbar from "./components/Navbar";
import useWebSocket from "react-use-websocket";
const theme = createMuiTheme({
  palette: {
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
  const [authToken, setAuthToken] = useState();
  const [deviceId, setDeviceId] = useState();
  const [ref, setRef] = useState(1);
  const socketURL = `wss://ws.binomo.com/?authtoken=${authToken}&device=android&device_id=${deviceId}&v=2&vsn=2.0.0`;

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
        <Navbar />
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
              <Container maxWidth="lg">
                <Route exact path="/setting">
                  <h2>Setting</h2>
                  <NavLink to="/">Click Me</NavLink>
                </Route>
                <Route exact path="/statistic">
                  <h2>Statistic</h2>
                  <NavLink to="/">Click Me</NavLink>
                </Route>
                <Route exact path="/trade">
                  <Trade />
                </Route>
                <Route exact path="/">
                  <Login />
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
