const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const { User, TestResult, Test, Question } = require("./models");

const app = express();
const port = 5000;

const { jwtSecret } = require("./config");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const authenticateToken = require("./middleware/auth");

const testsRouter = require("./routes/tests");
app.use("/api/tests", testsRouter);

const resultsRouter = require("./routes/results");
app.use("/api/results", resultsRouter);

app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// server.js (GET /api/user)
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: TestResult,
          include: [
            {
              model: Test,
              include: [Question],
            },
          ],
        },
      ],
    });

    const formattedUser = {
      id: user.id,
      login: user.login,
      isAdmin: user.isAdmin,
      testResults: user.TestResults.map((result) => ({
        testId: result.testId,
        bestScore: result.score,
        test: {
          title: result.Test.title,
          questionsCount: result.Test.questions.length,
        },
      })),
    };

    res.json(formattedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
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
