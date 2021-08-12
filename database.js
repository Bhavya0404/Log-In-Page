const mongoose = require("mongoose");

const logInSchema = new mongoose.Schema({
  username: String,
  password: String,
});

// mongoose model

const logIn = mongoose.model("Detail", logInSchema); // (table Name, schema)

// new document
const data1 = new logIn({
  username: "Bhavya",
  password: "bhavya",
});

data1.save();

module.exports = logIn;
