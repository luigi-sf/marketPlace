// src/contexts/auth/authProvider.tsx
import { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import type { User } from "../../types/user";
import type { Credentials, SignupDTO } from "../../types/auth/auth";
import { authService } from "../../services/authService";
import { tokenService } from "../../services/tokenService";
import { connectSocket, disconnectSocket, getSocket } from "../../sockets";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenService.get());

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;

  // 🔹 Configura listeners do socket
  const setupSocketListeners = useCallback((socket: ReturnType<typeof getSocket>) => {
    if (!socket) return;

    socket.on("seller:updated", (data) => {
      console.log("🔔 seller:updated recebido:", data);
      if (user?.id === data.userId) {
        setUser((prev) => (prev ? { ...prev, ...data } : prev));
        localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
      }
    });

    socket.on("seller:approved", (data) => {
      console.log("🎉 seller:approved recebido:", data);
      alert(data.message || "Seu perfil de seller foi aprovado!");
    });

    socket.on("seller:new-pending", (data) => {
      console.log("🆕 novo seller pendente (admin):", data);
    });
  }, [user]);

  // 🔹 Reconecta socket no refresh
  useEffect(() => {
    const storedToken = tokenService.get();
    if (storedToken) {
      const socket = connectSocket(storedToken);
      setupSocketListeners(socket);
    }

    return () => {
      disconnectSocket();
    };
  }, [setupSocketListeners]);

  // 🔹 LOGIN
  async function login(credentials: Credentials): Promise<User | null> {
    setLoading(true);
    try {
      const response = await authService.login(credentials);

      tokenService.set(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);

      const socket = connectSocket(response.token);
      setupSocketListeners(socket);

      return response.user;
    } catch (err) {
      console.error("❌ Erro no login:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }

  // 🔹 SIGNUP
  async function signup(data: SignupDTO): Promise<boolean> {
    setLoading(true);
    try {
      const response = await authService.signup(data);

      tokenService.set(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setToken(response.token);
      setUser(response.user);

      const socket = connectSocket(response.token);
      setupSocketListeners(socket);

      return true;
    } catch (err) {
      console.error("❌ Erro no signup:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  // 🔹 LOGOUT
  function logout() {
    disconnectSocket();
    setUser(null);
    setToken(null);
    tokenService.remove();
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}