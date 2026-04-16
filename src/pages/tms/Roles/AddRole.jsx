import React, { useEffect, useState } from "react";
import { createRole, getAllPermissions } from "../../../services/RoleService/RoleService";
import api from "../../../services/axios";
import toast from "react-hot-toast";

const AddRole = () => {
  const [role, setRole] = useState({
    name: "",
    description: "",
  });

  const [roleId, setRoleId] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch permissions
  const fetchPermissions = async () => {
    try {
      const res = await getAllPermissions();
      setPermissions(res.data || {});
    } catch (err) {
      toast.error("Failed to load permissions");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Handle role create
  const handleCreateRole = async () => {
    try {
      if (!role.name) {
        return toast.error("Role name is required");
      }

      setLoading(true);
      const res = await createRole(role);

      setRoleId(res.data.id); // store created role id
      toast.success("Role created successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle permission
  const togglePermission = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  // Save permissions
  const handleSavePermissions = async () => {
    try {
      await api.post("/roles/assign-permissions", {
        role_id: roleId,
        permission_ids: selectedPermissions,
      });

      toast.success("Permissions assigned successfully");
    } catch (err) {
      toast.error("Failed to assign permissions");
    }
  };

  return (
    <div className="p-6 bg-fleet-bg min-h-screen">
      <div className="max-w-4xl mx-auto bg-fleet-card rounded-2xl shadow p-6">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-fleet-text-primary mb-6">
          Create Role & Assign Permissions
        </h2>

        {/* STEP 1 - CREATE ROLE */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-fleet-text-secondary mb-3">
            Step 1: Create Role
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

          <button
            onClick={handleCreateRole}
            disabled={loading || roleId}
            className="mt-4 bg-fleet-primary text-white px-5 py-2 rounded-lg text-sm hover:bg-fleet-primary-dark transition disabled:opacity-50"
          >
            {roleId ? "Role Created" : "Create Role"}
          </button>
        </div>

        {/* STEP 2 - PERMISSIONS */}
        <div className={`${!roleId ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="text-sm font-semibold text-fleet-text-secondary mb-3">
            Step 2: Assign Permissions
          </h3>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(permissions).map(([group, perms]) => (
              <div key={group} className="border border-fleet-border rounded-lg p-3">

                {/* Group Title */}
                <h4 className="text-sm font-semibold text-fleet-primary mb-2">
                  {group}
                </h4>

                {/* Permissions */}
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
            onClick={handleSavePermissions}
            className="mt-4 bg-fleet-accent text-white px-5 py-2 rounded-lg text-sm hover:bg-fleet-accent-light transition"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;