"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TestResult extends Model {
    static associate(models) {
      TestResult.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      TestResult.belongsTo(models.Test, {
        foreignKey: "testId",
        as: "test",
      });
    }
  }

  TestResult.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tests",
          key: "id",
        },
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "TestResult",
      indexes: [
        {
          unique: true,
          fields: ["userId", "testId"],
        },
      ],
    }
  );

  return TestResult;
};
