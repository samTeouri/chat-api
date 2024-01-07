require("dotenv").config();

const express = require("express");
const app = express();
const auth = require("./middleware/auth");

var usersRouter = require('./routes/users');
var chatsRouter = require('./routes/chats');
var messagesRouter = require('./routes/messages');

// const User = require("./model/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

app.use(express.json());

app.use("/users", usersRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

module.exports = app;