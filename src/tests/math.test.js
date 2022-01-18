const { celsiusToFahrenheit, fahrenheitToCelsius , calcluateTip } = require("../math");

test("should Convert 32F° to 0C°", () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test("should Convert 0C° to 32F°", () => {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

test('should Calculate total with tip', () => {
    const total = calcluateTip(10, .3)
     expect(total).toBe(13)
})

test('should Calculate total with Default tip', () => {
    const total = calcluateTip(10)
     expect(total).toBe(12.5)
})
