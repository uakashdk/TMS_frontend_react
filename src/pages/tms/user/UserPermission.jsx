import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPermissions } from "../../../services/RoleService/RoleService";
import {
    AssignUserPermission,
    getUserPermissions
} from "../../../services/userService/userService";
import toast from "react-hot-toast";

const UserPermission = () => {
    const { userId } = useParams();

    const [permissions, setPermissions] = useState({});
    const [userPermissions, setUserPermissions] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedPermission, setSelectedPermission] = useState(null);

    const [formData, setFormData] = useState({
        start_at: "",
        end_at: ""
    });

    // ==========================================
    // FETCH PERMISSIONS
    // ==========================================

    const fetchPermissions = async () => {
        try {
            const res = await getAllPermissions();

            setPermissions(res.data || {});
        } catch (err) {
            toast.error("Failed to load permissions");
        }
    };

    // ==========================================
    // FETCH USER PERMISSIONS
    // ==========================================

    const fetchUserPermissions = async () => {
    try {
        const res = await getUserPermissions(userId);

        const userPermissionList = res.data?.data || [];

        const mappedPermissions = {};

        userPermissionList.forEach((permission) => {
            mappedPermissions[permission.permission_id] = permission;
        });

        setUserPermissions(mappedPermissions);

    } catch (err) {
        console.error("fetchUserPermissions error:", err);
        toast.error("Failed to load user permissions");
    }
};

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                fetchPermissions(),
                fetchUserPermissions()
            ]);

            setLoading(false);
        };

        loadData();
    }, [userId]);

    // ==========================================
    // OPEN PERMISSION
    // ==========================================

    const handlePermissionClick = (permission) => {
        const existingPermission = userPermissions[permission.id];

        setSelectedPermission(permission);

        setFormData({
            start_at: existingPermission?.start_at
                ? formatDateTimeForInput(existingPermission.start_at)
                : "",
            end_at: existingPermission?.end_at
                ? formatDateTimeForInput(existingPermission.end_at)
                : ""
        });
    };

    // ==========================================
    // FORMAT DATE FOR INPUT
    // ==========================================

    const formatDateTimeForInput = (date) => {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ==========================================
    // ASSIGN / UPDATE PERMISSION
    // ==========================================

    const handleSavePermission = async () => {
        if (!selectedPermission) {
            toast.error("Please select a permission");
            return;
        }

        if (!formData.start_at || !formData.end_at) {
            toast.error("Please select start and end time");
            return;
        }

        const startDate = new Date(formData.start_at);
        const endDate = new Date(formData.end_at);

        if (endDate <= startDate) {
            toast.error("End time must be later than start time");
            return;
        }

        try {
            setLoadingId(selectedPermission.id);

            await AssignUserPermission({
                user_id: Number(userId),
                permission_id: selectedPermission.id,
                is_allowed: true,
                start_at: startDate.toISOString(),
                end_at: endDate.toISOString()
            });

            setUserPermissions((prev) => ({
                ...prev,
                [selectedPermission.id]: {
                    permission_id: selectedPermission.id,
                    is_allowed: true,
                    start_at: startDate.toISOString(),
                    end_at: endDate.toISOString()
                }
            }));

            toast.success("Permission assigned successfully");

            setSelectedPermission(null);

        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                "Failed to update permission"
            );
        } finally {
            setLoadingId(null);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-sm text-gray-500">
                    Loading permissions...
                </div>
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}

                <div className="mb-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                User Permissions
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage additional permissions and their access duration.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                Role Permission
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                Temporary Permission
                            </div>

                        </div>

                    </div>

                </div>


                {/* PERMISSION GROUPS */}

                <div className="space-y-6">

                    {Object.entries(permissions).map(([group, perms]) => (

                        <div
                            key={group}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                        >

                            {/* GROUP HEADER */}

                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        {group}
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Manage access for this module
                                    </p>
                                </div>

                                <span className="text-xs font-medium text-slate-400">
                                    {perms.length} permissions
                                </span>

                            </div>


                            {/* PERMISSIONS */}

                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                                {perms.map((perm) => {

                                    const userPermission =
                                        userPermissions[perm.id];

                                    const hasUserPermission =
                                        userPermission?.is_allowed === true;

                                    return (

                                        <div
                                            key={perm.id}
                                            onClick={() =>
                                                handlePermissionClick(perm)
                                            }
                                            className={`
                                                group
                                                relative
                                                p-4
                                                rounded-xl
                                                border
                                                cursor-pointer
                                                transition-all
                                                duration-200
                                                ${
                                                    hasUserPermission
                                                        ? "border-emerald-200 bg-emerald-50/50"
                                                        : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                                                }
                                            `}
                                        >

                                            {/* TOP */}

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        {perm.name}
                                                    </h3>

                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {perm.action}
                                                    </p>

                                                </div>


                                                {/* STATUS */}

                                                <div
                                                    className={`
                                                        shrink-0
                                                        w-9
                                                        h-5
                                                        rounded-full
                                                        p-0.5
                                                        transition
                                                        ${
                                                            hasUserPermission
                                                                ? "bg-emerald-500"
                                                                : "bg-slate-300"
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className={`
                                                            w-4
                                                            h-4
                                                            rounded-full
                                                            bg-white
                                                            shadow-sm
                                                            transition-transform
                                                            ${
                                                                hasUserPermission
                                                                    ? "translate-x-4"
                                                                    : "translate-x-0"
                                                            }
                                                        `}
                                                    />

                                                </div>

                                            </div>


                                            {/* STATUS INFORMATION */}

                                            <div className="mt-4">

                                                {hasUserPermission ? (

                                                    <div className="space-y-1">

                                                        <div className="flex items-center gap-2">

                                                            <span className="text-[11px] font-semibold text-emerald-700">
                                                                TEMPORARY ACCESS
                                                            </span>

                                                        </div>

                                                        <p className="text-xs text-slate-500">
                                                            {formatDateTimeForInput(
                                                                userPermission.start_at
                                                            ).replace("T", " ")}
                                                            {" "}
                                                            →{" "}
                                                            {formatDateTimeForInput(
                                                                userPermission.end_at
                                                            ).replace("T", " ")}
                                                        </p>

                                                    </div>

                                                ) : (

                                                    <div className="flex items-center gap-2">

                                                        <span className="w-2 h-2 rounded-full bg-slate-300" />

                                                        <span className="text-xs text-slate-400">
                                                            No additional permission
                                                        </span>

                                                    </div>

                                                )}

                                            </div>


                                            {/* ROLE INFORMATION */}

                                            {perm.has_role_permission && (

                                                <div className="mt-3 pt-3 border-t border-slate-200">

                                                    <div className="flex items-center gap-2">

                                                        <span className="w-2 h-2 rounded-full bg-blue-500" />

                                                        <span className="text-xs font-medium text-blue-600">
                                                            Inherited from role
                                                        </span>

                                                    </div>

                                                </div>

                                            )}

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    ))}

                </div>

            </div>


            {/* ==========================================
                PERMISSION MODAL
            ========================================== */}

            {selectedPermission && (

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    {/* BACKDROP */}

                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setSelectedPermission(null)}
                    />

                    {/* MODAL */}

                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200">

                        {/* HEADER */}

                        <div className="px-6 py-5 border-b border-slate-100">

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                        Permission Access
                                    </p>

                                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                                        {selectedPermission.name}
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {selectedPermission.action}
                                    </p>

                                </div>

                                <button
                                    onClick={() => setSelectedPermission(null)}
                                    className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                                >
                                    ✕
                                </button>

                            </div>

                        </div>


                        {/* BODY */}

                        <div className="p-6">

                            <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100">

                                <p className="text-xs font-semibold text-blue-700">
                                    Temporary permission
                                </p>

                                <p className="text-xs text-blue-600 mt-1">
                                    Select exactly when this permission should
                                    be available to the user.
                                </p>

                            </div>


                            {/* START */}

                            <div className="mb-5">

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Permission starts
                                </label>

                                <input
                                    type="datetime-local"
                                    name="start_at"
                                    value={formData.start_at}
                                    onChange={handleInputChange}
                                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                />

                                <p className="text-xs text-slate-400 mt-1.5">
                                    User will receive this permission from this time.
                                </p>

                            </div>


                            {/* END */}

                            <div className="mb-6">

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Permission expires
                                </label>

                                <input
                                    type="datetime-local"
                                    name="end_at"
                                    value={formData.end_at}
                                    onChange={handleInputChange}
                                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                />

                                <p className="text-xs text-slate-400 mt-1.5">
                                    User will lose this additional permission after this time.
                                </p>

                            </div>


                            {/* EXISTING PERMISSION */}

                            {userPermissions[selectedPermission.id] && (

                                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100">

                                    <div className="flex items-center gap-2">

                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />

                                        <span className="text-xs font-semibold text-emerald-700">
                                            Permission already assigned
                                        </span>

                                    </div>

                                    <p className="text-xs text-emerald-600 mt-2">
                                        You can change the start and end time above.
                                    </p>

                                </div>

                            )}


                            {/* ACTIONS */}

                            <div className="flex items-center justify-end gap-3">

                                <button
                                    onClick={() => setSelectedPermission(null)}
                                    className="px-5 h-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSavePermission}
                                    disabled={loadingId === selectedPermission.id}
                                    className="px-5 h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                    {loadingId === selectedPermission.id
                                        ? "Saving..."
                                        : "Save Permission"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default UserPermission;