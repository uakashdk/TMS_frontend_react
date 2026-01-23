import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    UpdateVehicles,
    getVehicleDetailById,
} from "../../../services/VehicleService/VehicleService";
import { uploadDocument } from "../../../services/document/DocumentService";

import { useNavigate } from "react-router-dom";
import UploadModal from "../../../component/common/UploadModal";


const UpdateVehicle = () => {
    const { id } = useParams();
     const navigate = useNavigate();
    const [vehicle, setVehicle] = useState({
        capacity_weight_kg: "",
        capacity_volume_cbm: "",
        fuel_type: "",
        fitness_expiry_date: "",
    });

    const [documents, setDocuments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [apiUrl, setApiUrl] = useState("");
    const [editDocId, setEditDocId] = useState(null);


    const [docForm, setDocForm] = useState({
        document_group: "",
        document_type: "",
        file: null,
    });

    /* ================= FETCH VEHICLE ================= */
    const fetchVehicle = async () => {
        const res = await getVehicleDetailById(id);
        if (res?.success) {
            const v = res.data;
            setVehicle({
                capacity_weight_kg: v.capacity_weight_kg || "",
                capacity_volume_cbm: v.capacity_volume_cbm || "",
                fuel_type: v.fuel_type || "",
                fitness_expiry_date: v.fitness_expiry_date
                    ? v.fitness_expiry_date.slice(0, 10)
                    : "",
            });
            setDocuments(res.documents || []);
            setApiUrl(res.api);
        }
    };

    useEffect(() => {
        fetchVehicle();
    }, [id]);

    /* ================= UPDATE VEHICLE ================= */
    const handleUpdate = async () => {
        const res = await UpdateVehicles(vehicle, id);
        if (res?.success) {
            toast.success("Vehicle updated successfully");
            fetchVehicle();
        navigate("/vehicle-list")
        }
    };

    /* ================= UPLOAD DOCUMENT ================= */
    const handleUpload = async () => {
        if (!docForm.document_group || !docForm.document_type || !docForm.file) {
            return toast.error("All fields are required");
        }

        const fd = new FormData();
        fd.append("entity_type", "Vehicle");
        fd.append("entity_id", id);
        fd.append("document_group", docForm.document_group);
        fd.append("document_type", docForm.document_type);
        fd.append("document", docForm.file);

        const res = await uploadDocument(fd);

        if (res?.success) {
            toast.success("Document uploaded");
            setShowModal(false);
            setDocForm({ document_group: "", document_type: "", file: null });

            const updated = await getVehicleDetailById(id);
            setDocuments(updated?.documents || []);
        }
    };


    /* ================= UI ================= */
    return (
        <div className="p-6 bg-fleet-bg min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-fleet-text-primary">
                    Update Vehicle
                </h2>

                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 text-sm rounded-md
      bg-fleet-primary
      text-white
      hover:bg-(--color-fleet-primary-dark)"
                >
                    Upload Document
                </button>
            </div>


            {/* FORM */}
            <div className="bg-fleet-card rounded-xl shadow-sm p-6 mb-8">
                <div className="grid grid-cols-4 gap-5">

                    <input
                        placeholder="Capacity Weight (KG)"
                        value={vehicle.capacity_weight_kg}
                        onChange={(e) =>
                            setVehicle({ ...vehicle, capacity_weight_kg: e.target.value })
                        }
                        className="bg-fleet-bg px-4 py-2 rounded-md text-sm
        outline-none focus:outline-none"
                    />

                    <input
                        placeholder="Capacity Volume (CBM)"
                        value={vehicle.capacity_volume_cbm}
                        onChange={(e) =>
                            setVehicle({ ...vehicle, capacity_volume_cbm: e.target.value })
                        }
                        className="bg-fleet-bg px-4 py-2 rounded-md text-sm
        outline-none focus:outline-none"
                    />

                    <select
                        value={vehicle.fuel_type}
                        onChange={(e) =>
                            setVehicle({ ...vehicle, fuel_type: e.target.value })
                        }
                        className="bg-fleet-bg px-4 py-2 rounded-md text-sm
        outline-none focus:outline-none"
                    >
                        <option value="">Fuel Type</option>
                        <option value="DIESEL">Diesel</option>
                        <option value="PETROL">Petrol</option>
                        <option value="CNG">CNG</option>
                        <option value="ELECTRIC">Electric</option>
                    </select>

                    <input
                        type="date"
                        value={vehicle.fitness_expiry_date}
                        onChange={(e) =>
                            setVehicle({ ...vehicle, fitness_expiry_date: e.target.value })
                        }
                        className="bg-fleet-bg px-4 py-2 rounded-md text-sm
        outline-none focus:outline-none"
                    />
                </div>

                <div className="mt-5">
                    <button
                        onClick={handleUpdate}
                        className="px-6 py-2 rounded-md text-sm
        bg-fleet-primary
        text-white
        hover:bg-(--color-fleet-primary-dark)"
                    >
                        Update Vehicle
                    </button>
                </div>
            </div>


            {/* DOCUMENT TABLE */}
            <div className="bg-fleet-card rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-fleet-table-header-bg">
                        <tr>
                            <th className="px-5 py-3 text-left text-(--color-fleet-table-header-text) font-medium">
                                Document Group
                            </th>
                            <th className="px-5 py-3 text-left text-(--color-fleet-table-header-text) font-medium">
                                Document Type
                            </th>
                            <th className="px-5 py-3 text-left text-(--color-fleet-table-header-text) font-medium">
                                Status
                            </th>
                            <th className="px-5 py-3 text-right text-(--color-fleet-table-header-text) font-medium">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {documents.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-fleet-text-muted">
                                    No documents found
                                </td>
                            </tr>
                        )}

                        {documents.map((doc) => (
                            <tr
                                key={doc.id}
                                className="hover:bg-fleet-table-row-hover transition"
                            >
                                <td className="px-5 py-3 text-fleet-text-primary">
                                    {doc.document_group}
                                </td>
                                <td className="px-5 py-3 text-fleet-text-secondary">
                                    {doc.document_type}
                                </td>
                                <td className="px-5 py-3">
                                    <span className="px-3 py-1 rounded-full text-xs
              bg-fleet-success-light
              text-fleet-success">
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-right flex justify-end gap-4">
                                    {/* VIEW */}
                                    <button
                                        onClick={() =>
                                            window.open(`${apiUrl}${doc.file_url}`, "_blank")
                                        }
                                        className="text-fleet-primary hover:underline"
                                    >
                                        View
                                    </button>

                                    {/* RE-UPLOAD (ONLY IF REJECTED) */}
                                    {doc.status === "REJECTED" && (
                                        <button
                                            onClick={() => {
                                                setEditDocId(doc.id);
                                                setDocForm({
                                                    document_group: doc.document_group,
                                                    document_type: doc.document_type,
                                                    file: null,
                                                });
                                                setShowModal(true);
                                            }}
                                            className="text-fleet-danger hover:underline"
                                        >
                                            Re-Upload
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* UPLOAD MODAL */}
            {showModal && (
                <UploadModal
                    docForm={docForm}
                    setDocForm={setDocForm}
                    onClose={() => {
                        setShowModal(false);
                        setEditDocId(null);
                    }}
                    onSave={handleUpload}
                    edit={!!editDocId}
                />
            )}

        </div>
    );
};

export default UpdateVehicle;
