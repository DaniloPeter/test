// src/Main.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Main() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error + " Ошибка");
        setLoading(false);
      });
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
