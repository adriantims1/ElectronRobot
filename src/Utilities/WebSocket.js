import { setOpenDealInfo, calculateWinOrLoss } from "./WebSocketLogic";

//Sockets required component
var wsSocket, asSocket, wsInitializationInterval;
var ref = 1;

//Connect Socket Function

function connectWsSocket(authToken, deviceId) {
  wsSocket = new WebSocket(
    `wss://ws.strategtry.com/?authtoken=${authToken}&device=android&device_id=${deviceId}&v=2&vsn=2.0.0`
  );

  //WS Socket initialization
  wsSocket.onopen = function (e) {
    const toSend = JSON.stringify({
      topic: "base",
      event: "phx_join",
      payload: {},
      ref: ref,
    });
    wsSocket.send(toSend);
    ref += 2;
  };

  wsSocket.onmessage = (res) => {
    res = JSON.parse(res.data);

    if (res.ref === 1) {
      if (res.payload.status === "ok") {
        var toSend = JSON.stringify({
          topic: "base",
          event: "ping",
          payload: {},
          ref: ref,
        });
        wsSocket.send(toSend);
        ref += 1;

        wsInitializationInterval = setInterval(() => {
          toSend = JSON.stringify({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: ref,
          });
          wsSocket.send(toSend);
          ref += 1;
          toSend = JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
          });
          wsSocket.send(toSend);
          ref += 1;
        }, 50e3);
      }
    } else if (res.event === "close_deal_batch") {
      //Calculate win or loss
      console.log(res.payload);
      calculateWinOrLoss(res.payload);
    } else if (res.event === "deal_created") {
      const {
        amount,
        payment,
        open_rate,
        deal_type,
        trend,
        uuid,
        asset_name,
        status,
        win,
      } = res.payload;
      setOpenDealInfo({
        amount,
        payment,
        open_rate,
        deal_type,
        trend,
        uuid,
        asset_name,
        status,
        win,
      });
    } else if (res.event === "change_balance") {
    }
  };
  wsSocket.onclose = function () {
    clearInterval(wsInitializationInterval);
  };
}

function connectAsSocket() {
  asSocket = new WebSocket("wss://as.strategtry.com/");
}

function subscribeAsSocket(prevRic, ric, shouldUnsubcribe) {
  if (shouldUnsubcribe) unsubscribeAsSocket(prevRic);
  let toSend = JSON.stringify({
    action: "subscribe",
    rics: [ric],
  });

  asSocket.send(toSend);
}

function unsubscribeAsSocket(ric) {
  let toSend = JSON.stringify({
    action: "unsubscribe",
    rics: [ric],
  });

  asSocket.send(toSend);
}

function sendTrade(toSendArgs) {
  const toSend = { ...toSendArgs, ref: ref };
  wsSocket.send(JSON.stringify(toSend));
}

export {
  asSocket,
  wsSocket,
  connectAsSocket,
  connectWsSocket,
  subscribeAsSocket,
  unsubscribeAsSocket,
  sendTrade,
};
