const request = require("supertest");
const Task = require("../models/task");
const app = require("./../app");
const { userOne, taskOne, setUpDatabase, userTwo } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "Testing" })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("should get All tasks for user 1", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const length = response.body.length;
  expect(length).toBe(2);
});

test("should not delete other users tasks", async () => {
  await request(app)
    .delete("/tasks/" + taskOne._id)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
