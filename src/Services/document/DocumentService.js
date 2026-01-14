
import api from "../axios";

import toast from "react-hot-toast";

export const uploadDocument = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");

    const response = await api.post(
      "/document/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        "Server is not responding, please try again"
    );
  }
};

export const DocumentStatus = async(documentId,DocumentStatus)=>{
  try {
     const response = await api.post(`/document/documentStatus/${documentId}`,{documentStatus: DocumentStatus});

     toast.success(response.data.message ||"document status updated");
  } catch (error) {
    toast.error(error.message ||"document not update please try again")
  }
}