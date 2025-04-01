import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", { login, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      alert(error, +" Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2>Авторизация</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
