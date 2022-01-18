const {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  calcluateTip,
  add,
} = require("../math");

test("should Convert 32F° to 0C°", () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test("should Convert 0C° to 32F°", () => {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

test("should Calculate total with tip", () => {
  const total = calcluateTip(10, 0.3);
  expect(total).toBe(13);
});

test("should Calculate total with Default tip", () => {
  const total = calcluateTip(10);
  expect(total).toBe(12.5);
});

//* Asynchronous testing with Done
test("should Add two numbers (with Done)", (done) => {
  add(11, 10).then((sum) => {
    expect(sum).toBe(21);
    done();
  });
});

//* Asynchronous testing with async/Await
test("should Add two numbers (Async/await", async () => {
  const sum = await add(10, 10);
  expect(sum).toBe(20);
});
