import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Axios API client configured with base URL and auth interceptor.
 * Reads VITE_API_BASE_URL from Vite env.
 */
const api: AxiosInstance = axios.create({
  baseURL:
    (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ||
    "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Adds auth token to request headers if available.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Passes response through, or rejects with error.
 */
api.interceptors.response.use(
  (resp: AxiosResponse): AxiosResponse => resp,
  (error) => Promise.reject(error),
);

export default api;
