const express = require("express");
const router = express.Router();
const { Test, Question } = require("../models");
const authenticateToken = require("../middleware/auth");

// Создание теста (только для админов)
router.post("/", authenticateToken, async (req, res) => {
  // if (!req.user.isAdmin) return res.sendStatus(403);

  try {
    const newTest = await Test.create({
      title: req.body.title,
    });
    res.status(201).json(newTest);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании теста" });
  }
});

// Удаление теста (только для админов)
router.delete("/:id", authenticateToken, async (req, res) => {
  console.log("User", req.user);
  // if (!req.user.isAdmin) return res.sendStatus(403);

  try {
    await Test.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении теста" });
  }
});

// Получить все тесты
router.get("/", async (req, res) => {
  try {
    const tests = await Test.findAll({
      attributes: ["id", "title"],
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении тестов" });
  }
});

// === НОВЫЙ РОУТ ДЛЯ ПОЛУЧЕНИЯ ВОПРОСОВ ТЕСТА ===
router.get("/:id/questions", async (req, res) => {
  try {
    const questions = await Question.findAll({
      where: { testId: req.params.id },
      attributes: ["id", "questionText", "answerOptions", "correctAnswer"],
    });

    if (!questions.length) {
      return res.status(404).json({ message: "Вопросы не найдены" });
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении вопросов" });
  }
});

// Создание вопроса в тесте (только для админов)
router.post("/:testId/questions", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.sendStatus(403);
  try {
    const newQuestion = await Question.create({
      testId: req.params.testId,
      questionText: req.body.questionText,
      answerOptions: JSON.stringify(req.body.answerOptions),
      correctAnswer: req.body.correctAnswer,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании вопроса" });
  }
});

// Удаление вопроса (только для админов)
router.delete("/questions/:id", authenticateToken, async (req, res) => {
  if (!req.user.isAdmin) return res.sendStatus(403);
  try {
    await Question.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении вопроса" });
  }
});

module.exports = router;
