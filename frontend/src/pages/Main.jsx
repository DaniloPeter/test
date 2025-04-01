import api from "../api";
import { useEffect, useState } from "react";

function Main() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.error(error);
          return;
        }
        setError(error + "Ошибка при загрузке пользователей");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <h1>Список пользователей</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Пароль</th>
            <th>Админ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.login}</td>
              <td>{user.password}</td>
              <td>{user.isAdmin ? "Да" : "Нет"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Main;
