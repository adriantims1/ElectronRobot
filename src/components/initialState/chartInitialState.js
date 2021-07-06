var options = {
  chart: {
    id: "realtime",
    zoom: {
      type: "x",
      enabled: false,
      autoScaleYaxis: true,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      forceNiceScale: true,
      min: function (min) {
        return min;
      },

      decimalsInFloat: 8,
    },
    animations: {
      enabled: false,
    },
  },
};
const addAnnotations = (annotationSettings) => {
  options = {
    ...options,
    annotations: annotationSettings,
  };
  console.log(options);
};

const removeAnnotations = () => {
  const { annotations, ...optionS } = options;
  options = optionS;
};

export { options, addAnnotations, removeAnnotations };
