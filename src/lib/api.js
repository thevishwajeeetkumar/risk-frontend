import axios from "axios";

const DEFAULT_BASE_URL = "https://risk-analysis-3bwh.onrender.com";

const resolveBaseUrl = () => {
  const fromEnv = import.meta?.env?.VITE_API_BASE_URL;
  if (fromEnv && typeof fromEnv === "string" && fromEnv.trim().length > 0) {
    return fromEnv.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "[risk-frontend] VITE_API_BASE_URL not set, falling back to production API:",
      DEFAULT_BASE_URL
    );
  }
  return DEFAULT_BASE_URL;
};

const BASE_URL = resolveBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

export const getApiBaseUrl = () => BASE_URL;

// token helpers
export const getToken = () => sessionStorage.getItem("token") || "";
export const setToken = (token) => {
  if (token) {
    sessionStorage.setItem("token", token);
  } else {
    sessionStorage.removeItem("token");
  }
};
export const clearToken = () => sessionStorage.removeItem("token");
export const clearAuth = () => {
  clearToken();
  sessionStorage.removeItem("user");
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.detail || error?.message || "Unexpected error";

    if (status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.assign("/login?reason=expired");
      }
    }

    const normalizedError = new Error(message);
    normalizedError.original = error;
    return Promise.reject(normalizedError);
  }
);

export default api;
