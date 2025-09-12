import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

type AuthContextValue = any; // laxo para compilar hoy

const __defaultAuth: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (_email: string, _password: string, _opts?: any) => {},
  logout: async () => {},
  setUser: (_u: any) => {},
};

const AuthContext = createContext<AuthContextValue>(__defaultAuth);

export const AuthProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;

  // Cargar sesión desde storage al iniciar
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (token && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { setUser({}); }
    } else if (token && !savedUser) {
      // No hay user: al menos marca sesión con objeto mínimo
      setUser({});
    }
  }, []);

  const login = async (email: string, password: string, opts?: any) => {
    setIsLoading(true);
    try {
      // Llama al backend
      const payload = await authService.login({ email, password, remember: !!opts?.remember });

      // === ADAPTACIÓN AL SHAPE QUE MANDAS ===
      // Espera: { success: true, data: { access_token: "..." } }
      const token =
        payload?.data?.access_token ??
        payload?.access_token ??
        payload?.token ??
        payload?.data?.token ??
        null;

      if (!token) {
        throw new Error("No se recibió access_token desde el servidor.");
      }

      // Guarda token
      localStorage.setItem("auth_token", token);

      // (Opcional) intenta obtener el perfil del usuario
      try {
        const me = await authService.me().catch(() => null);
        if (me) {
          localStorage.setItem("auth_user", JSON.stringify(me));
          setUser(me);
        } else {
          // Si no hay endpoint /auth/me, al menos guarda un user mínimo
          const minimalUser = { email, role: "user" };
          localStorage.setItem("auth_user", JSON.stringify(minimalUser));
          setUser(minimalUser);
        }
      } catch {
        const minimalUser = { email, role: "user" };
        localStorage.setItem("auth_user", JSON.stringify(minimalUser));
        setUser(minimalUser);
      }

      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Ignora errores del logout remoto
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setUser(null);
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
