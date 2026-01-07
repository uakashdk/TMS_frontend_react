import api from "./axios"

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logout = async () => {
  const token = localStorage.getItem("accessToken");

  const response = await api.post(
    "/auth/logout",
    {}, // no body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // REQUIRED for refreshToken cookie
    }
  );

  return response.data;
};


export const refreshToken = async () => {
  try {
    const response = await api.post(
      "/auth/refresh-token", 
      {},                    
      {
        withCredentials: true
      }
    );

   
    return response.data;

  } catch (error) {
    console.error("Refresh token error:", error.response?.data || error.message);
    throw error;
  }
};

