import { sendTrade } from "./WebSocket";
import axios from "axios";

var maxProfit, compensation, tradeInterval;

var compIndex = 0;

var setTrade;

const startRobot = async (
  tradeDetail,
  maxProfitArgs,
  maxLoss,
  getTodayProfit,
  setTradeArgs
) => {
  setTrade = setTradeArgs;
  const config = {
    headers: {
      "Authorization-Token": localStorage.getItem("authtoken"),
      "Device-Id": localStorage.getItem("deviceid"),
      "Device-Type": "android",
      "Authorization-Version": 2,
    },
  };
  let dateCreated = await axios.get(
    "https://api.binomo.com/platform/time?local=en",
    config
  );
  dateCreated = dateCreated.data.data.time;
  maxProfit = maxProfitArgs;
  const date = new Date(dateCreated);
  //Set the compensation
  setCompensation(maxLoss);

  //Wait Until the 58th Second
  let waitUntil58SecInterval;
  if (date.getSeconds() !== 58) {
    waitUntil58SecInterval = setInterval(() => {
      if (date.getSeconds() === 58) {
        clearInterval(waitUntil58SecInterval);
        startTrade(tradeDetail, getTodayProfit);
        setTrade("open");
      } else {
        date.setSeconds(date.getSeconds() + 1);
      }
    }, 1000);
  } else {
    startTrade(tradeDetail, getTodayProfit);
    setTrade("open");
  }
};

const startTrade = (tradeDetail, getTodayProfit) => {
  //First order must be send when function is called
  //Other order must be two minute apart from the previous one
  console.log(compIndex !== 4 && getTodayProfit() < maxProfit);
  if (compIndex !== 4 && getTodayProfit() < maxProfit) {
    sendOrder(tradeDetail);
    tradeInterval = setInterval(() => {
      if (compIndex === 4 || getTodayProfit() >= maxProfit) {
        stopRobot();
        setTrade("close");
      } else {
        sendOrder(tradeDetail);
      }
    }, 120e3);
  } else {
    setTrade("close");
  }
};

const setCompensation = (maxLoss) => {
  compensation = [
    Math.round(maxLoss * 0.05),
    Math.round(maxLoss * 0.1),
    Math.round(maxLoss * 0.25),
    Math.round(maxLoss * 0.6),
  ];
};

const calculateDirection = () => {
  return "call";
};

const sendOrder = ({ ric, iso, balanceType }) => {
  const direction = calculateDirection();
  const now = new Date();
  const toSend = {
    topic: "base",
    event: "create_deal",
    payload: {
      amount: compensation[compIndex] * 100,
      created_at: now.getTime(),
      deal_type: balanceType,
      expire_at: 60 * Math.ceil((Math.ceil(now.getTime() / 1e3) + 30) / 60),
      option_type: "turbo",
      iso: iso,
      ric: ric,
      trend: direction,
    },
  };
  sendTrade(toSend);
};

const stopRobot = () => {
  clearInterval(tradeInterval);
};

const increaseCompIndex = () => {
  compIndex += 1;
};
const resetCompIndex = () => {
  compIndex = 0;
};

export { startRobot, stopRobot, increaseCompIndex, resetCompIndex };
