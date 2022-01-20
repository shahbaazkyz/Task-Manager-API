const jwt = require("jsonwebtoken");
const monoose = require("mongoose");
const request = require("supertest");
const User = require("../models/user");
const { response } = require("./../app");
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
  const response = await request(app)
    .post("/users")
    .send({
      name: "testing",
      email: "testing@gmail.com",
      pass: "1234534234",
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);

  expect(user.pas).not.toBe("1234534234");
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: "testing",
      email: "testing@gmail.com",
    },
    token: user.tokens[0].token,
  });
});

test("should Login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      pass: userOne.pass,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  const resToken = response.body.token;

  expect(resToken).toBe(user.tokens[1].token);
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
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(response.body._id);
  expect(user).toBeNull();
});

test("should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Shahbaz" })
    .expect(200);

  const user = await User.findById(userOneID);
  expect(user.name).toBe("Shahbaz");
});

test("should not update invalid user fileds", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "karachi" })
    .expect(400);
});

// test("should upload user avatar", async () => {
//   await request(app)
//     .post("/users/me")
//     .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//     .attach("avatar", "./fixtures/1231.png")
//     .expect(200);

//   // const user = await User.findById(userOneID);
//   // expect(user.avatar).toEqual(expect.any(Buffer));
// });