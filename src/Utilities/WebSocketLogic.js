import { increaseCompIndex, resetCompIndex } from "./TradeLogic";

let addAnnotation, removeAnnotation;

var open_rate, trend, payment, amount, deal_type;

const setOpenDealInfo = ({
  amount: amountArgs,
  payment: paymentArgs,
  open_rate: openRateArgs,
  deal_type: dealTypeArgs,
  trend: trendArgs,
}) => {
  trend = trendArgs;
  open_rate = openRateArgs;
  payment = paymentArgs;
  amount = amountArgs;
  deal_type = dealTypeArgs;
  addAnnotation(openRateArgs, trendArgs);
};

const calculateWinOrLoss = ({ end_rate }) => {
  if (end_rate > open_rate && trend === "call") {
    //Calculate Win
    resetCompIndex();
  } else if (end_rate < open_rate && trend === "put") {
    //Calculate Win
    resetCompIndex();
  } else if (end_rate === open_rate) {
    //Calculate Tie
  } else {
    //Calculate Loss
    increaseCompIndex();
  }
  removeAnnotation();
};

const initializeAnnotation = (addAnnotationArgs, removeAnnotationArgs) => {
  addAnnotation = addAnnotationArgs;
  removeAnnotation = removeAnnotationArgs;
};

export { setOpenDealInfo, calculateWinOrLoss, initializeAnnotation };
