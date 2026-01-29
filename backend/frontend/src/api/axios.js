import axios from "axios";

const api = axios.create({
  // ✅ FIX: Ab ye Localhost nahi, balki Render wale Backend se baat karega
  baseURL: "https://naveen-education.onrender.com/api/", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;