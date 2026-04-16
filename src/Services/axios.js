import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/fleetlio",
  // baseURL:"http://15.134.220.228/api/v1/fleetlio",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // ❌ DO NOT use withCredentials for bearer token auth
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
