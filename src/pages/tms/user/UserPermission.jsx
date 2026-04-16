import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPermissions } from "../../../services/RoleService/RoleService";
import { AssignUserPermission } from "../../../services/userService/userService";
import toast from "react-hot-toast";

const UserPermission = () => {
    const { userId } = useParams();

    const [permissions, setPermissions] = useState({});
    const [loadingId, setLoadingId] = useState(null); // per toggle loading
    const [userPermissions, setUserPermissions] = useState({});
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
        fetchPermissions();
    }, []);

    // ✅ Handle toggle (MAIN LOGIC)
    const handleToggle = async (permission_id, currentState) => {
        try {
            setLoadingId(permission_id);

            await AssignUserPermission({
                user_id: Number(userId),
                permission_id,
                is_allowed: !currentState,
            });

            // ✅ UPDATE UI STATE (THIS WAS MISSING)
            setUserPermissions(prev => ({
                ...prev,
                [permission_id]: !currentState
            }));

            toast.success("Permission updated");

        } catch (err) {
            toast.error("Failed to update permission");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        User Permission Management
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Control individual user access beyond role permissions
                    </p>
                </div>

                {/* PERMISSION GROUPS */}
                <div className="space-y-6">

                    {Object.entries(permissions).map(([group, perms]) => (
                        <div
                            key={group}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
                        >

                            {/* GROUP HEADER */}
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-md font-semibold text-indigo-600">
                                    {group}
                                </h3>
                                <span className="text-xs text-gray-400">
                                    {perms.length} permissions
                                </span>
                            </div>

                            {/* PERMISSIONS GRID */}
                            <div className="grid grid-cols-2 gap-4">

                                {perms.map((perm) => (
                                    <div
                                        key={perm.id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:shadow-md transition bg-gray-50"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {perm.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {perm.action}
                                            </p>
                                        </div>

                                        {/* MODERN TOGGLE */}
                                        <button
                                            onClick={() => handleToggle(perm.id, userPermissions[perm.id] || false)}
                                            disabled={loadingId === perm.id}
                                            className={`relative w-11 h-6 flex items-center rounded-full transition ${userPermissions[perm.id]
                                                ? "bg-green-400"
                                                : "bg-gray-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 bg-white rounded-full shadow transform transition ${userPermissions[perm.id]
                                                    ? "translate-x-5"
                                                    : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                ))}

                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default UserPermission;