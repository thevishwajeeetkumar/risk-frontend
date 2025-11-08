import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

// token helpers
export const getToken = () => sessionStorage.getItem("token") || "";
export const setToken = (t) => sessionStorage.setItem("token", t);
export const clearToken = () => sessionStorage.removeItem("token");

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const status = err?.response?.status;
    const msg = err?.response?.data?.detail || err?.message || "Unexpected error";
    if (status === 401) {
      clearToken();
      sessionStorage.removeItem("user");
      window.location.assign("/login?reason=expired");
    }
    return Promise.reject(new Error(msg));
  }
);

export default api;
