import api from "../axios";
import toast from "react-hot-toast";

export const getTrips = async (job_id,driver_id,vehicle_id,trip_status,start_date,end_date,search,page) => {
  try {
    const response = await api.get("/trips/get-all-trips", {
      params: {
        job_id,
        driver_id,
        vehicle_id,
        trip_status,
        start_date,
        end_date,
        search,
        page
      }
    });
    return response.data;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to fetch trips");
    throw error;
  }
};

export const addTrip = async (tripData) => {
  try {
    const response = await api.post("/trips/crete-trip", tripData);
    return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add trip");
        throw error;
    }
};


export const updateTrip = async(tripData,tripId)=>{
    try {
        const response = await api.put(`/trips/update-trip/${tripId}`,tripData);
        return response?.data;  
    } catch (error) {
        toast.error(error?.response?.data?.message|| "Internal Server error please try after some times")
    }
}

export const getTripById = async(tripId)=>{
    try {
        const response = api.get(`/trips/get-trip-by-id/${tripId}`);

        return (await response)?.data
    } catch (error) {
        toast.error(error?.response?.data?.message|| "Error while fetching trip details")
    }
}


export const changeTripStatus = async (id, statusBody)=>{
    try {
         const response = api.patch(`/trips/update-trip-status/${id}`,statusBody);

         return response?.data;
    } catch (error) {
        toast.error(error?.response?.message || "Internal Server error please try after some times")
    }
}