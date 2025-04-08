const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("./models");

const app = express();
const port = 5000;

const jwtSecret =
  "3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

app.get("/api/user", authenticateToken, async (req, res) => {
  console.log(authenticateToken);
  try {
    const user = await User.findByPk(req.user.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка сервера" });
  }
});

app.post("/api/register", async (req, res) => {
  const { login, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const newUser = await User.create({
      login,
      password: password,
      isAdmin: false,
    });

    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка сервера" });
  }
});

app.post("/api/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(404).json({ message: "Неверный логин или пароль" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(404).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign({ id: user.id, login: user.login }, jwtSecret, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, login: user.login } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка сервера" });
  }
});

app.put("/api/user", authenticateToken, async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    user.login = login;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: "Данные успешно обновлены", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Произошла ошибка сервера" });
  }
});

app.listen(port, () => {
  console.log("server listening on http://localhost:" + port);
});
