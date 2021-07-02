import axios from "axios";

var asSocket,
  ws,
  userWsInitializationInterval,
  allMarket,
  time,
  tradeInterval,
  currPrice,
  assetTime;
var ref = 1;
var dealType = "demo";
var compIndex = 0;
var currAsset = {};

async function getCandles() {
  try {
    let config = {
      headers: {
        "Authorization-Token": localStorage.getItem("authtoken"),
        "Device-Id": localStorage.getItem("deviceid"),
        "Content-Type": "application/json",
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    var data = await axios.get(
      "https://api.binomo.com/platform/private/v3/assets?locale=en",
      config
    );

    data = data.data.data.assets;

    const d = new Date();
    const day = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var today =
      10 <= d.getUTCHours()
        ? d.getUTCHours() +
          ":" +
          (10 > d.getUTCMinutes() ? "0" + d.getUTCMinutes() : d.getUTCMinutes())
        : "0" +
          d.getUTCHours() +
          ":" +
          (10 > d.getUTCMinutes()
            ? "0" + d.getUTCMinutes()
            : d.getUTCMinutes());

    var temp = [];
    data.forEach((el) => {
      if (
        el.active &&
        el.trading_tools_settings.option.base_payment_rate_turbo >= 80 &&
        /*check the demo and real availability &&*/ today >
          el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][0] &&
        today <
          el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][1]
      ) {
        temp.push({
          name: el.name,
          ric: el.ric,
          percent: el.trading_tools_settings.option.base_payment_rate_turbo,
        });
      }
    });
    console.log("here is temp", temp);
    allMarket = temp;
    console.log("here is allMarket", allMarket);
  } catch (err) {
    console.log("error cannot connect", err);
  }
}

function connectUserWebSocket() {
  //<------------------------------------------->
  //Build user Websocket to open deal and get result
  //user Socket instances
  ws = new WebSocket(
    "wss://ws.binomo.com/?authtoken=" +
      localStorage.getItem("authtoken") +
      "&device=android&device_id=" +
      localStorage.getItem("deviceid") +
      "&v=2&vsn=2.0.0"
  );
  //user socket initialization, sending phx_join and interval ping
  ws.onopen = function (e) {
    const toSend = JSON.stringify({
      topic: "base",
      event: "phx_join",
      payload: {},
      ref: ref,
      join_ref: "1",
    });
    ws.send(toSend);
    ref += 2;
  };
  //listening to event such as ping, close deal batch (will define the trade result), and heartbeat (user still connected or not)
  ws.addEventListener("message", (res) => {
    if (res.ref === 1) {
      if (res.payload.status === "ok") {
        var toSend = JSON.stringify({
          topic: "base",
          event: "ping",
          payload: {},
          ref: ref,
          join_ref: "1",
        });
        ws.send(toSend);
        ref += 1;

        userWsInitializationInterval = setInterval(() => {
          toSend = JSON.stringify({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: ref,
            join_ref: "1",
          });
          ws.send(toSend);
          ref += 1;
          toSend = JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
            join_ref: "1",
          });
          ws.send(toSend);
          ref += 1;
        }, 50e3);
      }
    } else if (res.event === "close_deal_batch") {
      //Calculate win or loss
      console.log(res);
    }
  });
  ws.onclose = function () {
    clearInterval(userWsInitializationInterval);
  };
  //<------------------------------------------->
}

function connectDataWebSocket() {
  asSocket = new WebSocket("wss://as.strategtry.com/");
  asSocket.addEventListener("message", (res) => {
    assetTime = new Date(res.created_at).getTime();
    time = res.created_at.slice(17, 19);
    currPrice = res.rate;
  });
}
function setAsset(asset) {
  currAsset = asset;
}
function setDealType(type) {
  dealType = type;
}
function openTrade() {
  if (time === "30") {
    var maxloss = localStorage.getItem("maxloss");
    maxloss = Number(maxloss);
    var compensation = [
      Math.round(maxloss * 0.05),
      Math.round(maxloss * 0.1),
      Math.round(maxloss * 0.25),
      Math.round(maxloss * 0.6),
    ];
    tradeInterval = setInterval(() => {
      //Open Trade
      if (compIndex < 4) {
        const toSend = JSON.stringify({
          topic: "base",
          event: "create_deal",
          payload: {
            asset: currAsset.ric,
            asset_id: currAsset.id,
            asset_name: currAsset.name,
            amount: compensation[compIndex] * 100,
            source: "mouse",
            trend: "call",
            expire_at: 60 * Math.ceil((Math.ceil(a.time / 1e3) + 30) / 60),
            created_at: Date.now(),
            option_type: "turbo",
            deal_type: dealType,
            tournament_id: null,
          },
          ref: ref,
          join_ref: 1,
        });
        ws.send(toSend);
        ref += 1;
      } else {
        closeTrade();
      }
    }, 120e3);
  }
}

function closeTrade() {
  clearInterval(tradeInterval);
}

export {
  ws,
  asSocket,
  connectUserWebSocket,
  connectDataWebSocket,
  getCandles,
  allMarket,
  setAsset,
};
