import axios from "axios";

const API_URL = "http://localhost:5000/api/quizzes";

export const createQuiz = async (quizData) => {
  return await axios.post(`${API_URL}/create`, quizData);
};

export const fetchQuizzes = async () => {
  return await axios.get(`${API_URL}/`);
};
