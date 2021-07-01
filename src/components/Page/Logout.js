import React from "react";
import { useHistory } from "react-router";

export default function Logout() {
  const history = useHistory();
  return history.push("/");
}
