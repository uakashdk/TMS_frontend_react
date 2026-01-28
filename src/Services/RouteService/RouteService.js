import api from "../axios";
import toast from "react-hot-toast";

export const getAllRoutes = async ({ search = "", page = 1 }) => {
  try {
    const response = await api.get("/routes/get-all-routes", {
      params: {
        search,
        page,
        limit: 10,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch routes");
    throw error;
  }
};


export const addRoute = async (routeData) => {
  try {
    const response = await api.post("/routes/create-route", routeData);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to add route");
    throw error;
  } 
};

export const editRoute = async (routeId, routeData) => {
  try {
    const response = await api.put(`/routes/update-route/${routeId}`, routeData);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to edit route");
    throw error;
  }
};

export const getRouteById = async (routeId) => {
  try {
    const response = await api.get(`/routes/get-route-by-id/${routeId}`);
    return response.data;
  }
    catch (error) { 
    toast.error(error.response?.data?.message || "Failed to fetch route details");
    throw error;
  }
};

export const deleteRoute = async (routeId) => {
  try {
    const response = await api.delete(`/routes/delete-route/${routeId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete route");
    throw error;
  }
};