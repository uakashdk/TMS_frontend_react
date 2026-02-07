import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
    AddTripAdvance,
    getTripAdvance,
} from "../../../services/TripService/TripService";

const TripAdvance = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        amount: "",
        payment_mode: "UPI",
        remarks: "",
    });

     const { user } = useSelector((state) => state.auth);
      const role = user?.role;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const fetchTripAdvance = async () => {
            try {
                const res = await getTripAdvance(id);

                if (res?.success && res?.data) {
                    setForm({
                        amount: res.data.amount || "",
                        payment_mode: res.data.payment_mode || "UPI",
                        remarks: res.data.remarks || "",
                    });
                    setIsEdit(true);
                }
            } catch (error) {
                toast.error("Failed to load trip advance");
            } finally {
                setPageLoading(false);
            }
        };

        fetchTripAdvance();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.amount || Number(form.amount) <= 0) {
            toast.error("Advance amount must be greater than zero");
            return;
        }

        const payload = {
            trip_id: Number(id),
            amount: Number(form.amount),
            payment_mode: form.payment_mode,
            remarks: form.remarks,
        };

        try {
            setLoading(true);

            const res = await AddTripAdvance(payload);

            if (res?.success) {
                toast.success(res.message);
                navigate("/trips");
            } else {
                toast.error(res?.message || "Failed to save trip advance");
            }

        } catch (error) {
            toast.error("Something went wrong while saving trip advance");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- PAGE LOADER -------------------- */
    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
                Loading trip advance...
            </div>
        );
    }

    /* -------------------- UI -------------------- */
    return (
        <div className="min-h-screen bg-fleet-bg flex justify-center items-start p-6">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-sm">

                {/* Header */}
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-fleet-text-primary">
                        Trip Advance
                    </h2>
                    <p className="text-sm text-fleet-text-secondary">
                        {isEdit ? "Update" : "Record"} advance payment for Trip #{id}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Amount */}
                    <div>
                        <label className="label">Advance Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            className="input"
                        />
                    </div>

                    {/* Payment Mode */}
                    <div>
                        <label className="label">Payment Mode</label>
                        <select
                            name="payment_mode"
                            value={form.payment_mode}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="UPI">UPI</option>
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="CHEQUE">Cheque</option>
                        </select>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="label">Remarks</label>
                        <textarea
                            name="remarks"
                            value={form.remarks}
                            onChange={handleChange}
                            placeholder="Optional notes for this advance"
                            rows="3"
                            className="input resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                         {(role === "Company-Admin" || role === "Accounts-manager")&&(
                              <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2 rounded-md text-sm text-white
                ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-fleet-primary hover:opacity-90"
                                }`}
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                    ? "Update Advance"
                                    : "Save Advance"}
                        </button>
                         )}
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TripAdvance;
