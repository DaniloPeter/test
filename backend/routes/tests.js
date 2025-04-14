const express = require("express");
const router = express.Router();
const { Test, Question } = require("../models"); // Импортируем Question

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

module.exports = router;
