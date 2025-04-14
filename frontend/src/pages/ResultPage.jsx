// ResultPage.jsx
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function TestResultPage() {
  const { testId, bestScore, total } = useParams();

  return (
    <div className="result-container">
      <h2>Результат теста</h2>
      <p>
        Лучший результат: {bestScore}/{total}
      </p>
      <p>
        Текущая попытка: {currentScore}/{total}
      </p>
      <button onClick={() => navigate(`/test/${testId}`)}>
        Повторить тест
      </button>
    </div>
  );
}

export default ResultPage;
