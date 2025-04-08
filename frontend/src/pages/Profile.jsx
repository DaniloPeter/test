import React, { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data);
        setNewLogin(response.data.login);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        setError(error.response?.data?.message || "Ошибка");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
    <div>
      <h2>Профиль {user.login}</h2>
      <form onSubmit={handleUpdate}>
        <h3>Редактировать</h3>
        <label>
          Логин:
          <input
            type="text"
            value={newLogin}
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
        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  );
}

export default Profile;
