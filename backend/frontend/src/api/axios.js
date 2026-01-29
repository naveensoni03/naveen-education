import axios from "axios";

const api = axios.create({
  // 👇 Dhyan dein: Ye Render wala link hona chahiye, Localhost nahi!
  baseURL: "https://naveen-education.onrender.com/api/", 
  withCredentials: true,
});

// ✅ FORCE UPDATE: Switching to Render Backend
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