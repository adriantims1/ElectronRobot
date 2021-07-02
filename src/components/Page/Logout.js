import React from "react";
import { useHistory } from "react-router";
import { ws, asSocket } from "../Utilities/TradeTools";

export default function Logout() {
  const history = useHistory();
  function disconnect() {
    ws.close();
    asSocket.close();
    localStorage.clear();
    history.push("/");
  }
  return disconnect();
}
