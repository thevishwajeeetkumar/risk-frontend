import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, {
  getToken as getStoredToken,
  setToken as persistToken,
  clearToken,
  clearAuth,
} from "../lib/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));

  const persistUser = useCallback((profile) => {
    if (profile) {
      sessionStorage.setItem("user", JSON.stringify(profile));
    } else {
      sessionStorage.removeItem("user");
    }
  }, []);

  const saveSession = useCallback(
    (newToken, profile) => {
      setTokenState(newToken || "");
      setUser(profile || null);
      if (newToken) {
        persistToken(newToken);
      } else {
        clearToken();
      }
      persistUser(profile || null);
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    saveSession("", null);
    clearAuth();
  }, [saveSession]);

  useEffect(() => {
    const bootstrap = async () => {
      const existingToken = getStoredToken();
      if (!existingToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        persistUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [logout, persistUser]);

  const login = useCallback(
    async (username, password) => {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);
      const { data } = await api.post("/auth/login", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const profile = {
        user_id: data.user_id,
        username: data.username,
        role: data.role,
      };
      saveSession(data.access_token, profile);
      return profile;
    },
    [saveSession]
  );

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      api,
      token,
      user,
      loading,
      login,
      register,
      logout,
      isCRO: user?.role === "CRO",
    }),
    [token, user, loading, login, register, logout]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const context = useContext(AuthCtx);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
