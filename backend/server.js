const express = require("express");
const cors = require("cors");
const { User } = require("./models");

const app = express();
const port = 5000;

app.use(cors());

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
