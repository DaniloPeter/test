import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Методы для работы с тестами
api.createTest = (title) => api.post("/tests", { title });
api.deleteTest = (id) => api.delete(`/tests/${id}`);

// Вопросы
api.createQuestion = (testId, data) =>
  api.post(`/tests/${testId}/questions`, data);

api.deleteQuestion = (questionId) => api.delete(`/questions/${questionId}`);

// Существующие интерсепторы остаются без изменений
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
