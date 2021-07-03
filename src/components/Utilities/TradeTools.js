import axios from "axios";
import ApexCharts from "apexcharts";

var asSocket,
  ws,
  userWsInitializationInterval,
  allMarket,
  tradeInterval,
  timeout;

var ref = 1;

var compIndex = 0;
var currAsset = {
  id: 347,
  name: "Crypto IDX",
  ric: "Z-CRY/IDX",
  type: 1,
  sort: 5,
  active: true,
  icon: { url: "https://binomo.com/uploads/asset/1601403874_pic_3fe78126.png" },
  daily: false,
  currencies: [],
  trading_tools_settings: {
    option: {
      base_payment_rate_turbo: 83,
      base_payment_rate_binary: 83,
      payment_rate_turbo: 83,
      payment_rate_binary: 83,
      schedule: {
        sun: [["00:00", "24:00"]],
        mon: [["00:00", "24:00"]],
        tue: [["00:00", "24:00"]],
        wed: [["00:00", "24:00"]],
        thu: [["00:00", "24:00"]],
        fri: [["00:00", "24:00"]],
        sat: [["00:00", "24:00"]],
      },
      enabled_account_types: ["real", "demo", "tournament"],
    },
  },
};
var maxLoss = 10;
var maxProfit = 0;
var balanceType = "demo";

function setSettings(maxLossArg, maxProfitArg, balanceTypeArg) {
  maxLoss = maxLossArg;
  maxProfit = maxProfitArg;
  balanceType = balanceTypeArg;
}

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

    allMarket = temp;
  } catch (err) {
    console.log("error cannot connect", err);
  }
}

function connectUserWebSocket() {
  //<------------------------------------------->
  //Build user Websocket to open deal and get result
  //user Socket instances
  ws = new WebSocket(
    "wss://ws.strategtry.com/?authtoken=" +
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
    });
    ws.send(toSend);
    ref += 2;
  };

  //listening to event such as ping, close deal batch (will define the trade result), and heartbeat (user still connected or not)
  ws.onmessage = (res) => {
    res = JSON.parse(res.data);

    if (res.ref === 1) {
      if (res.payload.status === "ok") {
        var toSend = JSON.stringify({
          topic: "base",
          event: "ping",
          payload: {},
          ref: ref,
        });
        ws.send(toSend);
        ref += 1;

        userWsInitializationInterval = setInterval(() => {
          toSend = JSON.stringify({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: ref,
          });
          ws.send(toSend);
          ref += 1;
          toSend = JSON.stringify({
            topic: "base",
            event: "ping",
            payload: {},
            ref: ref,
          });
          ws.send(toSend);
          ref += 1;
        }, 50e3);
      }
    } else if (res.event === "close_deal_batch") {
      //Calculate win or loss
      ApexCharts.exec("realtime", "clearAnnotations");
    } else if (res.event === "deal_created") {
      ApexCharts.exec("realtime", "addYaxisAnnotation", {
        y: res.payload.open_rate,
        borderColor: "#0b4870",
        label: {
          offsetX: 50,
          borderColor: "#0b4870",
          style: {
            color: "#fff",
            background: "#0b4870",
            fontSize: "14px",
          },
          text: `Open trade direction: ${res.payload.trend}`,
          position: "left",
        },
      });
    }
  };
  ws.onclose = function () {
    clearInterval(userWsInitializationInterval);
  };
  //<------------------------------------------->
}

function increaseCompIndex() {
  compIndex += 1;
  console.log("Comp Index current value is", compIndex);
}
function connectDataWebSocket() {
  asSocket = new WebSocket("wss://as.strategtry.com/");
}
function setAsset(asset) {
  currAsset = asset;
}
function closeTrade() {
  clearTimeout(timeout);
  clearInterval(tradeInterval);
}
function openTrade(isoArgs) {
  var compensation = [
    Math.round(maxLoss * 0.05),
    Math.round(maxLoss * 0.1),
    Math.round(maxLoss * 0.25),
    Math.round(maxLoss * 0.6),
  ];

  timeout = setTimeout(() => {
    const a = new Date();
    const toSend = JSON.stringify({
      topic: "base",
      event: "create_deal",
      payload: {
        amount: compensation[compIndex] * 100,
        created_at: a.getTime(),
        deal_type: balanceType,
        expire_at: 60 * Math.ceil((Math.ceil(a.getTime() / 1e3) + 30) / 60),
        option_type: "turbo",
        iso: isoArgs,
        ric: currAsset.ric,
        trend: "call",
      },
      ref: ref,
    });

    ws.send(toSend);
    console.log("open with amoung", compensation[compIndex]);
    tradeInterval = setInterval(() => {
      //Open Trade

      if (compIndex < 4) {
        const a = new Date();

        const toSend = JSON.stringify({
          topic: "base",
          event: "create_deal",
          payload: {
            amount: compensation[compIndex] * 100,
            created_at: a.getTime(),
            deal_type: balanceType,
            expire_at: 60 * Math.ceil((Math.ceil(a.getTime() / 1e3) + 30) / 60),
            option_type: "turbo",
            iso: "USD",
            ric: currAsset.ric,
            trend: "call",
          },
          ref: ref,
        });

        ws.send(toSend);
        console.log("open with amoung", compensation[compIndex]);
        ref += 1;
      } else {
        closeTrade();
      }
    }, 120e3);
  }, 60e3);
}

export {
  ws,
  asSocket,
  connectUserWebSocket,
  connectDataWebSocket,
  getCandles,
  allMarket,
  setAsset,
  setSettings,
  openTrade,
  closeTrade,
  balanceType,
  increaseCompIndex,
};
