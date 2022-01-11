const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();

//* Creating task resource
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});


//* Deleting task.
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("No task found!");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//* Getting task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("task not found!");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

//* Getting Tasks
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    // res.send(tasks)
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});


//* Updating Task
router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));

  if (!isAllowed) {
    return res.status(400).send("Invalid updates!");
  }

  try {
    const newTask = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!newTask) {
      return res.status(404).send("Task not found!");
    }

    updates.forEach((update) => (newTask[update] = req.body[update]));

    await newTask.save();
    res.send(newTask);
  } catch (error) {
    res.status(400).send();
  }
});





module.exports = router;
