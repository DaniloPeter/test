import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
      } catch (err) {
        setError("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="user-info">
        <p>Логин: {user.login}</p>
        <p>Роль: {user.isAdmin ? "Администратор" : "Пользователь"}</p>
      </div>

      <div className="test-results">
        <h3>Результаты тестов:</h3>
        {user.testResults?.length > 0 ? (
          user.testResults.map((result) => (
            <div key={result.testId} className="test-result-item">
              <div className="test-title">
                {result.test.title}
                <span className="best-score">
                  Лучший результат: {result.bestScore}/
                  {result.test.questions.length}
                </span>
                <Link to={`/test/${result.testId}`}>
                  <button className="retry-button">Повторить тест</button>
                </Link>
              </div>
              <progress
                value={result.bestScore}
                max={result.test.questions.length}
                className="progress-bar"
              />
            </div>
          ))
        ) : (
          <p>Вы еще не проходили тесты</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
