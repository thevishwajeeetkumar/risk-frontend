// src/hooks/useAuth.jsx
import { useMemo } from "react";
import api, { setToken, clearAuth } from "../lib/api";

export function useAuth() {
  const user = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "{}"); }
    catch { return {}; }
  }, []);

  const isCRO = user?.role === "CRO";

  const register = async ({ username, email, password, role }) => {
    const { data } = await api.post("/auth/register",
      { username, email, password, role },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  };

  const login = async (username, password) => {
    // OAuth2 password flow: x-www-form-urlencoded
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);

    const { data } = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    setToken(data.access_token);

    const me = await api.get("/auth/me");
    sessionStorage.setItem("user", JSON.stringify(me.data));
    return me.data;
  };

  const logout = () => { clearAuth(); window.location.assign("/login"); };

  return { api, user, isCRO, register, login, logout };
}
