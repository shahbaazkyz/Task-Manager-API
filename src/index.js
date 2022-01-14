require("./db/mongoose");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("../src/routes/userRoutes");
const taskRoutes = require("../src/routes/taskRoutes");
const express = require("express");

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
// if (req.method === 'GET') {
//     res.send("GET request isn't allowed!")
// }
// else {
//     next()
// }
//     res.status(503).send("Site is under maintenance , please come back later.")
// })

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
