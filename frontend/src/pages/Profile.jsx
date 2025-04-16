import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put("/user", {
        login: newLogin,
        password: newPassword,
      });
      alert("Изменения сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении изменений:", error);
      console.error(error.response?.data?.message || "Ошибка");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-info">
        <h2>Профиль пользователя {user.login}</h2>
        <div className="user-info">
          <p className={`${user.isAdmin ? "info-visible" : "info-hidden"}`}>
            Роль: {user.isAdmin ? "Администратор" : "Пользователь"}
          </p>
        </div>
        <form onSubmit={handleUpdate}>
          <h3>Редактировать</h3>
          <label>
            Логин:
            <input
              type="text"
              value={user.login}
              onChange={(e) => setNewLogin(e.target.value)}
            />
          </label>
          <br />
          <label>
            Пароль:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <br />
          <button className="submit-btn" type="submit">
            Сохранить изменения
          </button>
        </form>
      </div>

      <div className="test-results">
        <h3>Результаты тестов:</h3>
        {user.testResults?.length > 0 ? (
          user.testResults
            ?.filter((result) => result.test)
            .map((result) => (
              <div key={result.testId} className="test-result-item">
                <div className="test-title">
                  {result.test?.title || "Неизвестный тест"}
                  <span className="best-score">
                    Лучший результат: {result.bestScore}/
                    {result.test?.questionsCount || 0}
                  </span>
                </div>
                <progress
                  value={result.bestScore}
                  max={result.test?.questionsCount || 0}
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
