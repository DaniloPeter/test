import { Link } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

function Main() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchTests();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="test-grid">
      {tests.map((test) => (
        <Link to={`/test/${test.id}`} key={test.id} className="test-card">
          <h3>{test.title}</h3>
        </Link>
      ))}
    </div>
  );
}

export default Main;
