const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const port = process.env.PORT;

app.use(express.json());

app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
