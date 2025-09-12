import api from "./api";

export const authService = {
  login: async (credentials: any) => {
    // credentials esperado: { email, password, remember? }
    try {
      const response = await api.post("/auth/login", credentials);
      return response?.data;
    } catch (error: any) {
      // Reenvía el mensaje legible si viene del backend
      throw error?.response?.data || error;
    }
  },

  logout: async () => {
    try {
      // Si tu API tiene endpoint de logout:
      // await api.post("/auth/logout");
      return true;
    } catch (error: any) {
      // No bloquear logout local si el endpoint falla
      return true;
    }
  },

  me: async () => {
    // Ejemplo: trae info del usuario autenticado
    try {
      const response = await api.get("/auth/me");
      return response?.data;
    } catch (error: any) {
      throw error?.response?.data || error;
    }
  },
};
