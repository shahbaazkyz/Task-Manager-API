const jwt = require("jsonwebtoken");
const monoose = require("mongoose");
const User = require("../../models/user");

const userOneID = new monoose.Types.ObjectId();

const userOne = {
  _id: userOneID,
  name: "Ahmed",
  email: "ahmed@example.com",
  pass: "afksjdf223",
  tokens: [{ token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET) }],
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await new User(userOne).save();
};

module.exports = {
  userOneID,
  userOne,
  setUpDatabase,
};
