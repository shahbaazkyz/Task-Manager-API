const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}
