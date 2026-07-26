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
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem("bb_token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${status}`;
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(
        new Error("Cannot reach the server. Is the backend running?")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
