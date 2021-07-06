var aMarket = [];
var m = 0;
var cProps = null;
var sTrade = false;
var i = 0;
var t,
  s = "";

const setter = (toChange, payload) => {
  switch (toChange) {
    case "aMarket":
      aMarket = payload;
      break;
    case "m":
      m = payload;
      break;
    case "cProps":
      cProps = payload;
      break;
    case "sTrade":
      sTrade = payload;
      break;
    case "i":
      i = payload;
      break;
    case "t":
      t = payload;
      break;
    case "s":
      s = payload;
      break;
    default:
  }
};

export { aMarket, m, cProps, sTrade, i, t, s, setter };
