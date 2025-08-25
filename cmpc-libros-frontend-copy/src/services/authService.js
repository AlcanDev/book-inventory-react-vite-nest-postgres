import api from './api';

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api?.post('/auth/login', credentials);
      return response?.data;
    } catch (error) {
      throw error?.response?.data || error;
    }
  },
};