import axios from "axios";

// ─── Base instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Request interceptor — attach JWT when present ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bb_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — surface clean error messages ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a non-2xx status
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${error.response.status}`;
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      // Request was made but no response received
      return Promise.reject(
        new Error("Cannot reach the server. Is the backend running?")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
