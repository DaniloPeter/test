const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("./models");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/login", async (req, res) => {
  const { user, password } = req.body;

  const existingUser = await User.findOne({ where: { username: user } });
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log("server listening on http://localhost:" + port);
});
