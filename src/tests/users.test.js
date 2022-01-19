const jwt = require("jsonwebtoken");
const monoose = require("mongoose");
const request = require("supertest");
const User = require("../models/user");
const app = require("./../app");

const userOneID = new monoose.Types.ObjectId();

const userOne = {
  _id: userOneID,
  name: "Ahmed",
  email: "ahmed@example.com",
  pass: "afksjdf223",
  tokens: [{ token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET) }],
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should signup new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "testing",
      email: "testing@gmail.com",
      pass: "1234534234",
    })
    .expect(201);
});

test("should Login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      pass: userOne.pass,
    })
    .expect(200);
});

test("should not Login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "hello@example.com",
      pass: "helloworld13",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete user account!", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});
