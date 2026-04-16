import React, { useEffect, useState } from "react";
import { getRoles, deleteRole } from "../../../services/RoleService/RoleService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RoleList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Delete role
  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      toast.success("Role deleted successfully");
      fetchRoles(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">

      {/* Header with button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Roles</h2>

        <button
          onClick={() => navigate("/add-role")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          + Add Role
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : roles.length === 0 ? (
        <p className="text-gray-400">No roles found</p>
      ) : (
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-4 text-sm text-gray-500 px-2">
            <span>#</span>
            <span>Name</span>
            <span>Description</span>
            <span className="text-right">Action</span>
          </div>

          {/* Rows */}
          {roles.map((role, index) => (
            <div
              key={role.id}
              className="grid grid-cols-4 items-center bg-white px-3 py-3 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <span className="text-gray-500">{index + 1}</span>

              <span className="font-medium text-gray-800">
                {role.name}
              </span>

              <span className="text-gray-500">
                {role.description || "-"}
              </span>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate(`/edit-role/${role.id}`)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleList;