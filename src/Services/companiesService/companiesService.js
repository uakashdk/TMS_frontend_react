import api from "../axios";
import toast from "react-hot-toast";

export const getAllCompanies = async () => {
  try {
    const token = localStorage.getItem("accessToken");
     console.log("token ============>",token);
    const response = await api.get("/companies/get-all-companies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "There is no company"
    );
  }
};


export const getMyCompanies =async()=>{
  try {
    const token = localStorage.getItem("accessToken");
    const response = await api.get("/companies/get-my-company",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })

    return response.data;
  } catch (error) {
    toast.error(error.message || "you are not logged in properluy please login again")
  }
}



export const addNewCompany = async (payload) => {
  try {
    const response = await api.post(
      "/companies/add-new-companies",
      payload // ✅ body only
    );

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Server is not responding, please try again"
    );
  }
};

export const updateExistingCompany = async (
  payload,
  companyId,
  documentId
) => {
  try {
    const response = await api.patch(
      `/companies/${companyId}/documents/${documentId}/verify`,
      payload
    );

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Server is not responding, please try again"
    );
  }
};

export const getCompanyDetailsById= async(companyId)=>{
  try {
    const response = await api.get(`/companies/company/${companyId}`)
    return response.data

  } catch (error) {
    toast.error(error.message|| "Server is busy right now please refresh the page")
  }
}

export const statusVerification = async (status, companyId) => {
  try {
    const response = await api.post(
      `/companyStatus/${companyId}`,
      null,
      {
        params: { status }, // ✅ query param
      }
    );

    toast.success(
      response?.data?.message || "Company status updated successfully"
    );

    return response.data;

  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Company status not updated"
    );
    throw error;
  }
};

export const DeleteCompany = async(companyId)=>{
 try {
     const response = await api.delete(`/companies/company-delete/${companyId}`);
     toast.success(response?.data?.message || "company deleted successfully")
 } catch (error) {
    toast.error( error.message||"server is busy try after some times")
 }
}

