"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          login: "admin",
          password: "admin",
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          login: "user1",
          password: "password",
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          login: "user2",
          password: "password",
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
