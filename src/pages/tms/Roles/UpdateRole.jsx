import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPermissions, getRoleById, updateRole } from "../../../services/RoleService/RoleService";
import api from "../../../services/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UpdateRole = () => {
  const { id } = useParams();

  const [role, setRole] = useState({
    name: "",
    description: "",
  });

  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch role details + permissions
  const fetchRoleDetails = async () => {
    try {
      const res = await getRoleById(id);

      const data = res.data;

      // ✅ Set role correctly
      setRole({
        name: data.name,
        description: data.description,
      });

      // ✅ Permissions already IDs
      setSelectedPermissions(data.permissions);

    } catch (err) {
      toast.error("Failed to load role details");
    }
  };

  // ✅ Fetch all permissions
  const fetchPermissions = async () => {
    try {
      const res = await getAllPermissions();
      setPermissions(res.data || {});
    } catch (err) {
      toast.error("Failed to load permissions");
    }
  };

  useEffect(() => {
    fetchRoleDetails();
    fetchPermissions();
  }, []);

  // Toggle permission
  const togglePermission = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };



  // ✅ Update role + permissions
  const handleUpdate = async () => {
    try {
      if (!role.name) {
        return toast.error("Role name is required");
      }

      setLoading(true);
      await api.put(`/roles/update-role/${id}`, {
        name: role.name,
        description: role.description,
        permission_ids: selectedPermissions
      });

      toast.success("Role updated successfully");
      navigate("/roles");

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-fleet-bg min-h-screen">
      <div className="max-w-4xl mx-auto bg-fleet-card rounded-2xl shadow p-6">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-fleet-text-primary mb-6">
          Update Role & Permissions
        </h2>

        {/* ROLE DETAILS */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-fleet-text-secondary mb-3">
            Role Details
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Role Name</label>
              <input
                type="text"
                className="input"
                value={role.name}
                onChange={(e) =>
                  setRole({ ...role, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">Description</label>
              <input
                type="text"
                className="input"
                value={role.description}
                onChange={(e) =>
                  setRole({ ...role, description: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* PERMISSIONS */}
        <div>
          <h3 className="text-sm font-semibold text-fleet-text-secondary mb-3">
            Assign Permissions
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(permissions).map(([group, perms]) => (
              <div key={group} className="border border-fleet-border rounded-lg p-3">

                <h4 className="text-sm font-semibold text-fleet-primary mb-2">
                  {group}
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {perms.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-2 text-sm text-fleet-text-primary hover:bg-fleet-table-row-hover px-2 py-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      {perm.name}
                    </label>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="mt-4 bg-fleet-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-fleet-primary-dark transition"
          >
            Update Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateRole;