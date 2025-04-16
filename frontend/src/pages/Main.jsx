import { Link } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await api.get("/tests");
        setTests(response.data);
      } catch (error) {
        setError("Ошибка при загрузке тестов");
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await api.get("/user");
        console.log("User data:", response.data);
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      }
    };

    fetchTests();
    checkAdminStatus();
  }, []);

  const handleCreateTest = async () => {
    if (!newTestTitle.trim()) return;

    try {
      const response = await api.post("/tests", { title: newTestTitle });
      setTests([...tests, response.data]);
      setNewTestTitle("");
    } catch (error) {
      console.error("Ошибка создания теста:", error);
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Удалить тест?")) return;

    try {
      await api.delete(`/tests/${id}`);
      setTests(tests.filter((test) => test.id !== id));
    } catch (error) {
      console.error("Ошибка удаления теста:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="test-grid">
      {/* Список существующих тестов */}
      {tests.map((test) => (
        <div key={test.id} className="test-card">
          <Link to={`/test/${test.id}`} className="test-link">
            <h3>{test.title}</h3>
          </Link>
          {isAdmin && (
            <button
              className="delete-test-button"
              onClick={() => handleDeleteTest(test.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {/* Форма создания теста для админов */}
      {isAdmin && (
        <div className="test-card create-test-card">
          <input
            type="text"
            placeholder="Название теста"
            value={newTestTitle}
            onChange={(e) => setNewTestTitle(e.target.value)}
            className="test-title-input"
          />
          <button onClick={handleCreateTest} className="create-test-button">
            Создать тест
          </button>
        </div>
      )}
    </div>
  );
}

export default Main;
