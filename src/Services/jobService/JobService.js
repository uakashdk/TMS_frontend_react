import toast from "react-hot-toast";
import api from "../axios";


export const GetAllJobs = async(search="", page=1, limit=10)=>{
   try {
    const response = await api.get("/jobs/get-all-jobs", {
      params: {
        search,
        page,
        limit
      }
    });
    return response.data;
   } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs.");
      throw error;
   }
} 


export const AddJob = async(jobData)=>{
   try {
    const response = await api.post("/jobs/create-jobs", jobData);
    return response.data;
   }
    catch (error) {
        toast.error(error.response?.data?.message || "Failed to add job.");
        throw error;
    }
}


export const getJobById = async(jobId)=>{
   try {
    const response = await api.get(`jobs/get-job-by-id/${jobId}`);
    return response.data;
   }
    catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch job details.");
        throw error;
    }
};

export const UpdateJob = async(jobId, jobData)=>{
   try {
    const response = await api.put(`/jobs/update-job/${jobId}`, jobData);
    return response.data;
   }
    catch (error) {
        toast.error(error.response?.data?.message || "Failed to update job.");
        throw error;
    }
};

export const getJobDropdown = async()=>{    
    try {
        const response = await api.get('/jobs/get-jobs-dropdown');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch job dropdown");
        throw error;
    }
};