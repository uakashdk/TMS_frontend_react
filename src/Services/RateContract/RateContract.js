import api from "../axios";
import toast from "react-hot-toast";


export const getAllRateContract = async ({
  party_id,
  route_id,
  from_date,
  to_date,
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await api.get(
      "/rate-contract/get-all-rateContract",
      {
        params: {
          party_id,
          route_id,
          from_date,
          to_date,
          page,
          limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Internal server error"
    );
  }
};


export const createRateContract = async(RateContractData)=>{
    try {
        const response = await api.post("/rate-contract/create-rate-contract",RateContractData);

        return  response.data
    } catch (error) {
        toast.error(error.data.message || "Internal server error")
    }
}

export const getRateContractById = async(id)=>{
    try {
         const response = await api.get(`/rate-contract/getRateContractById/${id}`);
         return response.data;
    } catch (error) {
        toast.error(error.data.message || "internal server error")
    }
}


export const deactivateRateContract = async (rateContractId) => {
  try {
    const response = await api.put(
      `/rate-contract/deactivate-rate-contract/${rateContractId}`
    );
    return response?.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Internal server error"
    );
  }
};


