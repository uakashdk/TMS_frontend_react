import { data } from "autoprefixer";
import api from "../axios";
import toast from "react-hot-toast";

export const getAllPartyAdvanced= async()=>{
    try {
        const response = await api.get("/partyAdvance/get-all-party-advance");
        return response?.data;
    } catch (error) {
        toast.error(error.response.data.message || "internal server error")
    }
}


export const createPartyAdvance = async(advancedData)=>{

    try {
        const response = await api.post("/partyAdvance/create-party-advance",advancedData);
        return response?.data
    } catch (error) {
         toast.error(error?.response?.data?.message || "internal server error");
    }
}

export const PartyAdvanceAdjustMent= async(id)=>{
    try {
      const response = api.get(`/getPartyAdvance-adjustment/${id}`);
      return response?.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Internal server error")
    }
}