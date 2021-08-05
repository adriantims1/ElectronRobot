//Functions non-related to chart, trade, and websocket

import axios from "axios";

const getAllMarket = async (setIconPic) => {
  const authtoken = localStorage.getItem("authtoken");
  const deviceid = localStorage.getItem("deviceid");

  const config = {
    headers: {
      "Authorization-Token": authtoken,
      "Device-Id": deviceid,
      "Device-Type": "android",
      "Authorization-Version": 2,
    },
  };
  let data = await axios.get(
    "https:api.binomo.com/platform/private/v3/assets?locale=en",
    config
  );
  data = data.data.data.assets;
  let iconPics = {};
  data.forEach(({ name, icon }) => {
    iconPics[name] = icon.url;
  });

  setIconPic(iconPics);
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
        (10 > d.getUTCMinutes() ? "0" + d.getUTCMinutes() : d.getUTCMinutes());

  var temporaryCandle = [];

  data.forEach((el) => {
    if (
      el.active &&
      el.trading_tools_settings.option.base_payment_rate_turbo >= 80 &&
      /*check the demo and real availability &&*/ today >
        el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][0] &&
      today <
        el.trading_tools_settings.option.schedule[day[d.getUTCDay()]][0][1]
    ) {
      temporaryCandle.push({
        name: el.name,
        ric: el.ric,
        percent: el.trading_tools_settings.option.base_payment_rate_turbo,
        url: el.icon.url,
      });
    }
  });
  return temporaryCandle;
};

const getBalanceFromBank = async (setBalance, setIso) => {
  try {
    const config = {
      headers: {
        "Authorization-Token": localStorage.getItem("authtoken"),
        "Device-Id": localStorage.getItem("deviceid"),
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    let data = await axios.get(
      "https://api.binomo.com/bank/v1/read?locale=en",
      config
    );
    data = data.data.data;

    setBalance({ real: data[1].amount, demo: data[0].amount });
    setIso(data[0].currency);
  } catch (err) {}
};

const getTradeHistory = async (setTradeHistory) => {
  try {
    const config = {
      headers: {
        "Authorization-Token": localStorage.getItem("authtoken"),
        "Device-Id": localStorage.getItem("deviceid"),
        "Device-Type": "android",
        "Authorization-Version": 2,
      },
    };
    let realData = await axios.get(
      "https://api.binomo.com/platform/private/v2/deals/option?type=real&tournament_id=&locale=en",
      config
    );
    let demoData = await axios.get(
      "https://api.binomo.com/platform/private/v2/deals/option?type=demo&tournament_id=&locale=en",
      config
    );
    realData = realData.data.data.binary_option_deals;
    demoData = demoData.data.data.binary_option_deals;

    const demoHistory = demoData.map((el, index) => ({
      name: el.name,
      trend: el.trend,
      win: el.win,
      status: el.status,
    }));
    const realHistory = realData.map((el, index) => ({
      name: el.name,
      trend: el.trend,
      win: el.win,
      status: el.status,
    }));

    setTradeHistory({ demo: demoHistory, real: realHistory });
  } catch (err) {}
};

export { getAllMarket, getBalanceFromBank, getTradeHistory };
