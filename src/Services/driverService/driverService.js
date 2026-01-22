import api from "../axios";
import toast from "react-hot-toast";

export const getAllDriver = async (search = "") => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/driver/driver-getAll", {
      params: {
        search: search || undefined, // clean URL
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Server error, please try again later"
    );
  }
};


export const createNewDriver = async(payload)=>{
    try {
        const token = localStorage.getItem("accessToken");
        const response = await api.post('/driver/create-driver',payload,{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        })

        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message||"")
    }
}


export const geDriverDetailById= async(id)=>{
    try {
        const token = localStorage.getItem('accessToken');
        const response = await api.get(`/driver/getdriverDetailById/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message ||"Internal server error please try after some times")
    }
}


export const  updateDriverById = async (payload,id)=>{
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.put(`/driver/update-driver/${id}`,payload,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    return response?.data;
  } catch (error) {
      toast.error(error?.response?.data?.message|| " Internal server error")
  }
}
