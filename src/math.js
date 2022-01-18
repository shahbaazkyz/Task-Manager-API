const fahrenheitToCelsius = (temp) => {
  return (temp - 32) / 1.8;
};

const celsiusToFahrenheit = (temp) => {
  return temp * 1.8 + 32;
};

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("Numbers must be non-negative ");
      }

      resolve(a + b);
    }, 2000);
  });
};

const calcluateTip = (total, tipPercent = 0.25) => total + total * tipPercent;

module.exports = {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  calcluateTip,
  add,
};
