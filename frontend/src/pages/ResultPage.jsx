// ResultPage.jsx
import { useParams } from "react-router-dom";

function ResultPage() {
  const { score, total } = useParams();

  return (
    <div className="result-page">
      <h2>Итог тестирования</h2>
      <p>
        Вы правильно ответили на {score} из {total} вопросов
      </p>
    </div>
  );
}

export default ResultPage;
