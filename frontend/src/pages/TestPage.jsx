import { useParams } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

function TestPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchQuestions();
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
      // Здесь можно добавить отправку результатов на сервер
      console.log("Ответы:", answers);
      alert("Тест отправлен!");
    } catch (error) {
      setError("Ошибка при отправке теста");
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-container">
      <h2>Тест</h2>
      <div className="progress">
        Вопрос {currentQuestionIndex + 1} из {questions.length}
      </div>

      {currentQuestion && (
        <div key={currentQuestion.id} className="question-card">
          <p className="question-text">{currentQuestion.questionText}</p>
          <div className="options">
            {currentQuestion.answerOptions?.map((option) => (
              <label key={option.value} className="option-label">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.value}
                  checked={answers[currentQuestion.id] === option.value}
                  onChange={() =>
                    handleAnswer(currentQuestion.id, option.value)
                  }
                  className="radio-input"
                />
                <span className="option-text">{option.value}</span>
              </label>
            ))}
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
            disabled={Object.keys(answers).length === 0} // Блокировка при отсутствии ответов
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
    </div>
  );
}

export default TestPage;
