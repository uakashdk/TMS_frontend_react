import api from "../axios";
import toast from "react-hot-toast";


export const userList = async (search = "") => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/Admins/get-all-users", {
      params: { search }, // ✅ IMPORTANT
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "error while fetching users"
    );
  }
};

export const AssignUserPermission = async (payload)=>{
  try {
    const response = await api.post("/Admins/assign-permissions", payload);
    return response.data;
  } catch (error) {
     toast.error(
      error?.response?.data?.message || "Failed to assign permission"
    );
    throw error;
  }
}


/* ================= GET ROLES ================= */
export const getAllRoles = async () => {
    try {
        const response = await api.get("/roles/get-all-roles");
        return response.data;
    } catch (error) {
        toast.error("Error fetching roles");
        throw error;
    }
};

/* ================= CREATE USER ================= */
export const createNewUser = async (payload) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await api.post(
      "/Admins/create-new-user",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to create user"
    );
  }
};


export const  AssignPermission   = async (payload) => {
  try {
      const response = await api.post("/Admins/assign-permissions", payload);
      return response.data;
  } catch (error) {
     toast.error(
      error?.response?.data?.message || "Failed to assign permission"
    );
    throw error;
  }
}


export const getUserDetailsById = async (userId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await api.get(
      `/Admins/get-userdetailsById/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    toast.error("Failed to load user");
  }
};


export const UpdateUserById = async (payLoad, userId) => {
  try {
    const token = localStorage.getItem("accessToken"); // ✅ FIX

    console.log("payload========>", payLoad);
    console.log("userId====>", userId);

    const response = await api.put(
      `/Admins/update-users/${userId}`,
      payLoad,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Internal Server Error"
    );
  }
};

