import axios from "axios";

const api = axios.create({
  // baseURL: "https://shivadda-backend-updated-software.onrender.com/api",
  baseURL: "http://127.0.0.1:8000/api", // 🔥 FIX: Removed trailing slash
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    // 🚀 MEGA FIX: Agar URL mein 'send-otp' ya 'login' hai, toh Token MAT bhejo!
    if (token && !config.url.includes('send-otp') && !config.url.includes('login')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🚀 SMART FIX FOR ALL REQUESTS (File upload vs JSON)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 ==========================================
    // 🔥 LICENSE EXPIRED LOGIC (402 Payment Required)
    // ==============================================
    if (error.response?.status === 402 && error.response?.data?.code === "LICENSE_EXPIRED") {
      document.body.innerHTML = `