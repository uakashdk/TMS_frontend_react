import api from "../axios";
import {toast} from "react-hot-toast";

export const getAllParties = async({ search = "", page = 1 })=>{
    try {
         const response = await api.get('/parties/get-all-parties',{
      params: {
        search,
        page,
        limit: 10,
      },
    }); 
         return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch parties");

    }
}


export const addParty = async(partyData)=>{
    try {
         const response = await api.post('/parties/create-parties', partyData);  
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add party");
    }
};

export const editParty = async(partyId, partyData)=>{
    try {
         const response = await api.put(`/parties/update-party/${partyId}`, partyData);
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to edit party");
    }
};

export const deleteParty = async(partyId)=>{
    try {
         const response = await api.delete(`/parties/delete-parties/${partyId}`);
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete party");
    }
};
export const getPartyById = async (partyId) => {
  try {
    const response = await api.get(
      `/parties/get-parties-By-Id/${partyId}`
    );
    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to fetch party details"
    );
  }
};




export const getPartyDropdown = async()=>{
    try {
         const response = await api.get('/parties/parties/dropdown');  
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch party dropdown");
    }   
};

export const getAllStates = async()=>{
    try {
         const response = await api.get('/routes/get-all-states');
            return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch states");
    }   
};