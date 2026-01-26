import api from "../axios.js";
import toast from "react-hot-toast";


export const createVehicleDriverAssignment = async(payload)=>{
    try {
        const token = await localStorage.getItem("accessToken");
        const response = await api.post("/Vehiclemap/create-vehicle-assignment",payload,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message ||"Internal server error")
    }
}

export const unAssignVehicleDriver = async(payload)=>{
    try {
        const token = await localStorage.getItem("accessToken");
        const response = await api.post("/Vehiclemap/unassign-vehicle-assignment",payload,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message||"Internal server error")
    }
}


export const getcurrentDriverVehicle = async(driverId)=>{
    try {
        const token = await localStorage.getItem("accessToken");
        const response = await api.get(`/Vehiclemap/get-current-vehicle-ofADriver/${driverId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message||"internal server error")
    }
}

export const checkDriverAvailability = async(driverId)=>{
    try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/Vehiclemap/drivers/${driverId}/availability`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal server error")
    }
}

export const getVehicleCurrentDriver = async(vehicleId)=>{
    try {
         const token = localStorage.getItem("accessToken");
         const response = await api.get(`/Vehiclemap/vehicle/${vehicleId}/assigned-drivers`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
         });
         return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "internal server error")
    }
}

export const vehicleDriverAssignmentHistory = async(vehicleId)=>{
    try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`/Vehiclemap/assignment-history/${vehicleId}`,{
            headers:{
            Authorization: `Bearer ${token}`
            }
        });
        return response?.data
    } catch (error) {
        toast.error(error?.response?.data?.message||"internal server error")
    }
}