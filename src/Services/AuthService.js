import api from "./axios.js";

/* ================= LOGIN ================= */
export const login = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials,
    {
      withCredentials: true, // ✅ REQUIRED to receive refreshToken cookie
    }
  );
  return response.data;
};


/* ================= REFRESH TOKEN ================= */
export const refreshToken = async () => {
  try {
    const response = await api.post(
      "/auth/refresh-token",   // ✅ must match backend route
      {},
      {
        withCredentials: true, // ✅ sends refreshToken cookie
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Refresh token error:",
      error.response?.data || error.message
    );
    throw error;
  }
};


/* ================= LOGOUT ================= */
export const logout = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await api.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // ✅ so backend can clear cookie
    }
  );

  return response.data;
};
