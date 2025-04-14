"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем тесты из БД
    const tests = await queryInterface.sequelize.query(
      "SELECT id FROM Tests;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Если тестов нет - прерываем выполнение
    if (!tests.length) {
      throw new Error("Тесты не найдены. Сначала выполните сидер для тестов.");
    }

    await queryInterface.bulkInsert("Questions", [
      // Вопросы для первого теста
      {
        testId: tests[0].id,
        questionText: "Что такое ECMAScript?",
        answerOptions: JSON.stringify([
          { value: "Язык разметки" },
          { value: "Спецификация языка" },
          { value: "Фреймворк" },
        ]),
        correctAnswer: "Спецификация языка",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        testId: tests[0].id,
        questionText: "Как объявить переменную в JS?",
        answerOptions: JSON.stringify([
          { value: "var x = 5" },
          { value: "let x = 5" },
          { value: "const x = 5" },
          { value: "Все варианты верны" },
        ]),
        correctAnswer: "Все варианты верны",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      // Вопросы для теста React (testId: 2)
      {
        testId: tests[1].id,
        questionText: "Что такое JSX?",
        answerOptions: JSON.stringify([
          { value: "Шаблонизатор" },
          { value: "Синтаксический сахар для React" },
          { value: "Язык стилей" },
        ]),
        correctAnswer: "Синтаксический сахар для React",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Questions", null, {});
  },
};
