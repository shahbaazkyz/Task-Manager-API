const fahrenheitToCelsius = (temp) => {
  return (temp - 32) / 1.8;
};

const celsiusToFahrenheit = (temp) => {
  return temp * 1.8 + 32;
};

const calcluateTip = (total, tipPercent = 0.25) => total + total * tipPercent;

module.exports = { fahrenheitToCelsius, celsiusToFahrenheit, calcluateTip };
