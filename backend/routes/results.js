// routes/results.js
const express = require("express");
const router = express.Router();
const { User, Question } = require("../models");
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { answers } = req.body;

  if (!answers || Object.keys(answers).length === 0) {
    return res.status(400).json({ message: "Ответы не предоставлены" });
  }

  try {
    const questions = await Question.findAll({
      where: { id: Object.keys(answers) },
      attributes: ["id", "correctAnswer"],
    });

    const correctCount = questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    const user = await User.findByPk(req.user.id);
    user.score += correctCount;
    await user.save();

    res.json({
      score: correctCount,
      total: questions.length,
      userScore: user.score,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при обработке результатов" });
  }
});

module.exports = router;
