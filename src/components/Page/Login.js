import React from "react";
import Connect from "./ConnectWebSocket";
const Login = () => {
  return localStorage.getItem("authtoken") ? (
    <Connect />
  ) : (
    <div>Enter authToken</div>
  );
};

export default Login;
