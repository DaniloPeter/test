import { useState } from "react";
import api from "../api";

function Registration() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", { login, password });
      alert("Регистрация успешна!");
      window.location.href = "/login";
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Ошибка: " + error.response.data.message);
      } else {
        alert("Произошла ошибка");
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default Registration;
