import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

function TestPage() {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    answerOptions: [{ value: "" }, { value: "" }],
    correctAnswer: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await api.get("/user");
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/tests/${id}/questions`);
        const formattedQuestions = response.data.map((question) => ({
          ...question,
          answerOptions:
            typeof question.answerOptions === "string"
              ? JSON.parse(question.answerOptions)
              : question.answerOptions,
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        setError("Ошибка при загрузке вопросов");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    fetchQuestions();
    setResult(null); // Сброс результата при смене теста
  }, [id]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post("/results", {
        answers,
        testId: id, // Убедитесь, что id передается как число
      });

      setResult({
        testTitle: response.data.testTitle,
        currentScore: response.data.currentScore,
        bestScore: response.data.bestScore,
        totalQuestions: response.data.totalQuestions,
      });
    } catch (error) {
      setError("Ошибка при отправке теста");
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="test-container">
      {isAdmin && (
        <div className="admin-question-form">
          <button onClick={() => setIsAddingQuestion(!isAddingQuestion)}>
            {isAddingQuestion ? "Отмена" : "Добавить вопрос"}
          </button>

          {isAddingQuestion && (
            <div className="question-editor">
              <input
                type="text"
                placeholder="Текст вопроса"
                value={newQuestion.questionText}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    questionText: e.target.value,
                  })
                }
              />

              {newQuestion.answerOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option.value}
                  placeholder={`Вариант ${index + 1}`}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.answerOptions];
                    newOptions[index].value = e.target.value;
                    setNewQuestion({
                      ...newQuestion,
                      answerOptions: newOptions,
                    });
                  }}
                />
              ))}

              <select
                value={newQuestion.correctAnswer}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correctAnswer: e.target.value,
                  })
                }
              >
                <option value="">Правильный ответ</option>
                {newQuestion.answerOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>

              <button
                onClick={async () => {
                  try {
                    const createdQuestion = await api.createQuestion(
                      id,
                      newQuestion
                    );
                    setQuestions([
                      ...questions,
                      {
                        ...createdQuestion.data,
                        answerOptions: JSON.parse(
                          createdQuestion.data.answerOptions
                        ),
                      },
                    ]);
                    setNewQuestion({
                      questionText: "",
                      answerOptions: [{ value: "" }, { value: "" }],
                      correctAnswer: "",
                    });
                    setIsAddingQuestion(false);
                  } catch (error) {
                    console.error("Ошибка создания вопроса:", error);
                  }
                }}
              >
                Сохранить вопрос
              </button>
            </div>
          )}
        </div>
      )}

      {!result ? (
        <>
          <div className="progress">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
            {isAdmin && questions[currentQuestionIndex] && (
              <button
                className="delete-question-button"
                onClick={async () => {
                  if (window.confirm("Удалить вопрос?")) {
                    try {
                      const currentQuestionId =
                        questions[currentQuestionIndex].id;
                      await api.deleteQuestion(currentQuestionId);
                      setQuestions(
                        questions.filter((q) => q.id !== currentQuestionId)
                      );
                    } catch (error) {
                      console.error("Ошибка удаления вопроса:", error);
                    }
                  }
                }}
              >
                ×
              </button>
            )}
          </div>

          {questions[currentQuestionIndex] && (
            <div
              key={questions[currentQuestionIndex].id}
              className="question-card"
            >
              <p className="question-text">
                {questions[currentQuestionIndex].questionText}
              </p>
              <div className="options">
                {questions[currentQuestionIndex].answerOptions?.map(
                  (option) => (
                    <label key={option.value} className="option-label">
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestionIndex].id}`}
                        value={option.value}
                        checked={
                          answers[questions[currentQuestionIndex].id] ===
                          option.value
                        }
                        onChange={() =>
                          handleAnswer(
                            questions[currentQuestionIndex].id,
                            option.value
                          )
                        }
                        className="radio-input"
                      />
                      <span className="option-text">{option.value}</span>
                    </label>
                  )
                )}
              </div>
            </div>
          )}

          <div className="navigation">
            <button
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              className="nav-button"
            >
              Назад
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="submit-button"
                disabled={Object.keys(answers).length !== questions.length}
              >
                Завершить тест
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="nav-button"
              >
                Далее
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="result-container">
          <h2>Результат теста: {result.testTitle}</h2>
          <p>
            Правильных ответов: {result.currentScore}/{result.totalQuestions}
          </p>
          <p>
            Лучший результат: {result.bestScore}/{result.totalQuestions}
          </p>
          <div className="result-buttons">
            <button onClick={() => navigate("/")} className="nav-button">
              На главную
            </button>
            <button onClick={handleRestart} className="submit-button">
              Повторить тест
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestPage;
