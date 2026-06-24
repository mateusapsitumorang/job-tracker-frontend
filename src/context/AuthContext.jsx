import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/axios.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Saat aplikasi pertama dibuka, coba pakai refresh token (cookie) untuk
  // mendapatkan access token baru tanpa user harus login manual lagi.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data.user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, name) => {
    await api.post("/auth/register", { email, password, name });
  };

  const forgotPassword = async (email) => {
    // Ganti yang lama (pakai axios) dengan ini:
    await api.post("/auth/forgot-password", { email });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, forgotPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
