// models/question.js
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Tests", key: "id" },
      },
      questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answerOptions: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      correctAnswer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "Questions",
      timestamps: true,
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.Test, { foreignKey: "testId", as: "test" });
  };

  return Question;
};
