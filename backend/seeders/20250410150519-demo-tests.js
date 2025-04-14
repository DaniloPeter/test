"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tests", [
      {
        title: "Тест по JavaScript",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Тест по React",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tests", null, {});
  },
};
