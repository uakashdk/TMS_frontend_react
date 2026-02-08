import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { AddPod, getPodAll } from "../../../services/TripService/TripService";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";

const Pod = () => {
  const { tripId } = useParams();

  const [pod, setPod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [parties, setParties] = useState([]);

  const [form, setForm] = useState({
    customer_id: "",
    delivery_date: "",
    receiver_name: "",
    receiver_contact: "",
    remarks: "",
  });

  /* =======================
     Fetch POD by Trip
  ======================= */
  const fetchPod = async () => {
    try {
      setLoading(true);
      const res = await getPodAll(tripId);
      if (res?.data) {
        setPod(res.data);
      }
    } catch (err) {
      // handled in service
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Fetch Party Dropdown
     (Client / Consignor only)
  ======================= */
  const fetchParties = async () => {
    const res = await getPartyDropdown();
    if (res?.data) {
      const filtered = res.data.filter(
        (p) => p.party_type === "client" || p.party_type === "CONSIGNOR"
      );
      setParties(filtered);
    }
  };

  useEffect(() => {
    fetchPod();
    fetchParties();
  }, [tripId]);

  /* =======================
     Handle Form Change
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* =======================
     Create POD
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      customer_id,
      delivery_date,
      receiver_name,
      receiver_contact,
    } = form;

    if (
      !customer_id ||
      !delivery_date ||
      !receiver_name ||
      !receiver_contact
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      trip_id: Number(tripId),
      customer_id: Number(customer_id),
      delivery_date,
      receiver_name,
      receiver_contact,
      remarks: form.remarks,
    };

    try {
      setSaving(true);
      const res = await AddPod(payload);
      if(res.success){
            toast.success("POD created successfully");
          setPod(res.data); 
      }else{
        toast.error(res?.message|| "pod is not found")
      }
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     UI
  ======================= */
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-400">
        Loading POD...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold">Proof of Delivery (POD)</h2>
        <p className="text-sm text-gray-500">Trip ID: #{tripId}</p>
      </div>

      {/* =======================
          POD EXISTS
      ======================= */}
      {pod && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <div className="text-sm">
            <strong>Customer:</strong> {pod.customer?.name}
          </div>
          <div className="text-sm">
            <strong>Delivery Date:</strong> {pod.delivery_date}
          </div>
          <div className="text-sm">
            <strong>Receiver:</strong> {pod.receiver_name}
          </div>
          <div className="text-sm">
            <strong>Contact:</strong> {pod.receiver_contact}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Remarks:</strong> {pod.remarks || "—"}
          </div>

          {/* Next step placeholder */}
          <div className="pt-4 text-sm text-blue-600">
            POD created ✔️ You can now upload documents.
          </div>
        </div>
      )}

      {/* =======================
          CREATE POD FORM
      ======================= */}
      {!pod && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 font-medium">Create POD</div>

          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <label className="label">Customer (Client / Consignor)</label>
              <select
                name="customer_id"
                value={form.customer_id}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select customer</option>
                
                {parties.map((p) => (
                  <option key={p.party_id} value={p.party_id}>
                    {p.party_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Delivery Date</label>
              <input
                type="date"
                name="delivery_date"
                value={form.delivery_date}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Receiver Name</label>
              <input
                name="receiver_name"
                value={form.receiver_name}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="label">Receiver Contact</label>
              <input
                name="receiver_contact"
                value={form.receiver_contact}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="col-span-2">
              <label className="label">Remarks</label>
              <textarea
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                rows="2"
                className="input resize-none"
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-5 py-2 rounded-md text-white text-sm
                  ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-fleet-primary hover:opacity-90"
                  }`}
              >
                {saving ? "Saving..." : "Create POD"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Pod;
