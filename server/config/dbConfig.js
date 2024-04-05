const mongoose = require("mongoose");
mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("mongo connected successfully");
});
connection.on("error", (err) => {
  console.log("mongo connection error", err);
});

module.exports = mongoose;
