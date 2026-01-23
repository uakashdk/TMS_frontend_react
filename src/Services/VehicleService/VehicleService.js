import api from "../axios";
import toast from "react-hot-toast";

export const getAllVehicle = async ({ page = 1, search = "" }) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await api.get(
      `/vehicle/get-allVehicles?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Internal Server Error"
    );
    throw error;
  }
};


export const createVehicle = async(payload)=>{
    try {
         const token = localStorage.getItem("accessToken");
         const response  = await api.post(`/vehicle/create-vehicles`,payload,{
            headers:{
                Authorization:`Bearer ${token}`
            }
         }) 
         return response?.data;   
    } catch (error) {
        toast.error(error?.response?.data?.message || "Error while fetching")
    }
}


export const UpdateVehicles = async(payload,id)=>{
    try {
        const token = await localStorage.getItem('accessToken');
        const response = await api.put(`/vehicle/update-vehicleById/${id}`,payload,{
         headers: {
          Authorization: `Bearer ${token}`,
        },
        })
        return response?.data;
    } catch (error) {
        toast.error(error.response.data.message||"Internal Server error please try after some times")
    }
}

export const getVehicleDetailById = async(id)=>{
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/vehicle/get-vehicleDetailsById/${id}`,{
            headers: {
          Authorization: `Bearer ${token}`,
        },
        })

        return response?.data
    } catch (error) {
        toast.error(error?.response?.data?.message||"Error while fetching Vehicles")
    }
}
