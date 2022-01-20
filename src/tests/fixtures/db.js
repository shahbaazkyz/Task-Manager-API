const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Task = require("../../models/task");
const User = require("../../models/user");

const userOneID = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneID,
  name: "Ahmed",
  email: "ahmed@example.com",
  pass: "afksjdf223",
  tokens: [{ token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET) }],
};

const userTwoID = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoID,
  name: "Umer",
  email: "umer@example.com",
  pass: "umershahbaz",
  tokens: [{ token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET) }],
};

const taskOne = {
  _id: mongoose.Types.ObjectId(),
  description: "Task 1",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  description: "Task 2",
  completed: true,
  owner: userOne._id,
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  description: "Task 3",
  completed: true,
  owner: userTwo._id,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneID,
  userOne,
  userTwo,
  userTwoID,
  taskOne,
  setUpDatabase,
};
