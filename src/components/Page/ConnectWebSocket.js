import React, { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const Login = () => {
  const [ref, setRef] = useState(1);
  const [int, setInt] = useState();

  const { sendJsonMessage } = useWebSocket(
    "wss://ws.binomo.com/?authtoken=" +
      localStorage.getItem("authtoken") +
      "&device=android&device_id=" +
      localStorage.getItem("deviceid") +
      "&v=2&vsn=2.0.0",
    {
      onOpen: () => {
        console.log("Sent");
        sendJsonMessage({
          topic: "base",
          event: "phx_join",
          payload: {},
          ref: ref,
          join_ref: "1",
        });
        setRef(ref + 2);
      },
      onClose: () => {
        clearInterval(int);
      },
      onMessage: (res) => {
        console.log(res);
        if (res.ref === "1") {
          if (res.payload.status === "ok") {
            sendJsonMessage({
              topic: "base",
              event: "ping",
              payload: {},
              ref: ref,
              join_ref: "1",
            });
            setRef(ref + 1);
            setInt(
              setInterval(() => {
                sendJsonMessage({
                  topic: "phoenix",
                  event: "heartbeat",
                  payload: {},
                  ref: ref,
                  join_ref: "1",
                });
                setRef(ref + 1);
                sendJsonMessage({
                  topic: "base",
                  event: "ping",
                  payload: {},
                  ref: ref,
                  join_ref: "1",
                });
                setRef(ref + 1);
              }, 50e3)
            );
          }
          console.log("success");
        } else if (ref.event === "close_deal_batch") {
          //Calculate win or loss
          console.log(ref);
        }
      },
    }
  );

  return <div>Connect Web Socket</div>;
};

export default Login;
