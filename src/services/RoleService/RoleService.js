import api from "../axios";
import toast from "react-hot-toast";

export const getRoles = async () => {
    try {
        const response = await api.get("/roles/get-all-roles");
        return response.data;
    } catch (error) {
        toast.error("Error fetching roles");
        throw error;
    }
};

export const getAllPermissions = async () => {
    try {
        const response = await api.get("/roles/permissions");
        return response.data;
    } catch (error) {
        toast.error("Error fetching permissions");
        throw error;
    }
};


export const createRole = async (roleData) => {
    try {
        const response = await api.post("/roles/create-role", roleData);
        return response.data;
    } catch (error) {
        toast.error(
            error?.response?.data?.message || "Error while creating role"
        );
        throw error;
    }
};

export const deleteRole = async (roleId) => {
    try {
        const response = await api.delete(`/roles/delete-role/${roleId}`);
        return response.data;
    }
    catch (error) {
        toast.error(
            error?.response?.data?.message || "Error while deleting role"
        );
        throw error;
    }
};


export const updateRole = async (id, roleData) => {
    try {
        const response = await api.put(
            `/roles/update-role/${id}`,
            roleData
        );
        return response.data;
    } catch (error) {
        toast.error(
            error?.response?.data?.message || "Error while updating role"
        );
        throw error;
    }
};

export const getRoleById = async (roleId) => {
    try {
        const response = await api.get(`/roles/getroleById/${roleId}`);
        return response.data;
    }
    catch (error) {
        toast.error(
            error?.response?.data?.message || "Error while fetching role details");

        throw error;
    }
};
