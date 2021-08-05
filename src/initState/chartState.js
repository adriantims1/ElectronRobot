let options = {
  chart: {
    id: "tradeChart",
    type: "candlestick",
    height: "100%",
    animations: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  title: {
    text: "",
    align: "left",
  },
  xaxis: {
    type: "datetime",
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    tooltip: {
      enabled: false,
    },
  },
};

const addAnnotations = (price, trend) => {
  options = {
    ...options,
    annotations: {
      yaxis: [
        {
          y: price,
          borderColor: "#0b4870",
          label: {
            position: "left",
            borderColor: "#0b4870",
            style: {
              color: "#fff",
              background: "#0b4870",
            },
            text: `Win if ${trend === "call" ? "higher" : "lower"}`,
          },
        },
      ],
    },
  };
};

const removeAnnotations = () => {
  options = { ...options, annotations: {} };
};

export { options, addAnnotations, removeAnnotations };
