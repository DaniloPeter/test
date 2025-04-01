import React, { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Профиль</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Логин: {user.login}, Админ: {user.isAdmin ? "Да" : "Нет"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
