module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "Tests",
      timestamps: true,
    }
  );

  Test.associate = (models) => {
    Test.hasMany(models.Question, {
      foreignKey: "testId",
      as: "questions",
      onDelete: "CASCADE",
    });
    Test.hasMany(models.TestResult, {
      foreignKey: "testId",
      as: "results",
      onDelete: "CASCADE",
    });
  };

  return Test;
};
