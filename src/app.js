require("./db/mongoose");
const userRoutes = require("../src/routes/userRoutes");
const taskRoutes = require("../src/routes/taskRoutes");
const express = require("express");

const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

module.exports = app;
