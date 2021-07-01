import React, { useState } from "react";
import { Switch, Route, NavLink, Redirect } from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  Paper,
  Container,
} from "@material-ui/core";

import Login from "./components/Page/Login";
import Trade from "./components/Page/Trade";
import Navbar from "./components/Navbar";
import Logout from "./components/Page/Logout";

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
              <Container maxWidth="lg" style={{ height: "100%" }}>
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
                <Route exact path="/logout">
                  <Logout />
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
