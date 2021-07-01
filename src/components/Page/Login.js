import React, { useState } from "react";
import { Button } from "@material-ui/core";
import {
  connectDataWebSocket,
  connectUserWebSocket,
  ws,
  asSocket,
  getCandles,
} from "../Utilities/TradeTools";

const Login = () => {
  const [connect, setConnect] = useState(false);

  function handleConnect() {
    if (!connect) {
      connectUserWebSocket();
      ws.addEventListener("open", function () {
        getCandles();
        console.log("User Authentication Successful");
      });
      ws.onError = function () {
        console.log("Cannot Connect");
      };
      connectDataWebSocket();
      asSocket.onError = function () {
        console.log("Cannot Connect");
      };
      asSocket.addEventListener("open", function () {
        console.log("As Socket Ready");
      });

      setConnect(true);
    }
  }
  return (
    <>
      <div>Enter AuthToken</div>
      <Button onClick={handleConnect}>Connect</Button>
    </>
  );
};

export default Login;
