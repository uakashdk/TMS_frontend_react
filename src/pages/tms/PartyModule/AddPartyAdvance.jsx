import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { createPartyAdvance } from "../../../services/PartyModule/ParrtyAdvanceService";

const AddPartyAdvance = () => {
  const [partyOptions, setPartyOptions] = useState([]);
  const [formData, setFormData] = useState({
    party_id: "",
    advance_date: "",
    amount: "",
    payment_mode: "UPI",
    reference_number: "",
    remarks: "",
  });

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      const response = await getPartyDropdown();
      const formatted = response?.data
        ?.filter((p) => p.party_type === "client")
        .map((p) => ({
          value: p.party_id,
          label: p.party_name,
        }));
      setPartyOptions(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPartyAdvance(formData);
  };

  return (
    <div className="min-h-screen bg-fleet-bg flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-fleet-card rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-fleet-text-primary">
            Add Party Advance
          </h2>
          <p className="text-sm text-fleet-text-secondary mt-1">
            Record advance payment received from client
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Party Dropdown */}
          <div>
            <label className="label">Select Client</label>
            <Select
              options={partyOptions}
              onChange={(selected) =>
                setFormData({ ...formData, party_id: selected.value })
              }
              className="text-sm"
            />
          </div>

          {/* Date & Amount Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Advance Date</label>
              <input
                type="date"
                className="input"
                value={formData.advance_date}
                onChange={(e) =>
                  setFormData({ ...formData, advance_date: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                className="input"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="label">Payment Mode</label>
            <select
              className="input"
              value={formData.payment_mode}
              onChange={(e) =>
                setFormData({ ...formData, payment_mode: e.target.value })
              }
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Reference Number */}
          <div>
            <label className="label">Reference Number</label>
            <input
              type="text"
              className="input"
              placeholder="Enter UTR / Cheque No"
              value={formData.reference_number}
              onChange={(e) =>
                setFormData({ ...formData, reference_number: e.target.value })
              }
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="label">Remarks</label>
            <textarea
              rows="3"
              className="input resize-none"
              placeholder="Optional remarks"
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-fleet-primary hover:bg-fleet-primary-dark text-white py-2.5 rounded-lg transition font-medium"
            >
              Save Advance
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPartyAdvance;