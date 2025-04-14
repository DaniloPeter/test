const express = require("express");
const router = express.Router();
const { TestResult, Question, Test } = require("../models");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { answers, testId } = req.body;

  try {
    // Получаем все вопросы теста
    const questions = await Question.findAll({
      where: { testId, id: Object.keys(answers) },
      attributes: ["id", "correctAnswer"],
    });

    // Считаем правильные ответы
    const correctCount = questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    // Находим или создаем результат
    const [testResult, created] = await TestResult.findOrCreate({
      where: { userId: req.user.id, testId },
      defaults: { score: correctCount },
    });

    // Обновляем если новый результат лучше
    if (!created && correctCount > testResult.score) {
      testResult.score = correctCount;
      await testResult.save();
    }

    // Получаем полную информацию о тесте
    const test = await Test.findByPk(testId);

    res.json({
      testTitle: test.title,
      currentScore: correctCount,
      bestScore: testResult.score,
      totalQuestions: questions.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при сохранении результата" });
  }
});

module.exports = router;
