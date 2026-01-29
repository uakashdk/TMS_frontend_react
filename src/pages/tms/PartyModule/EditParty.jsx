import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getPartyById,
  editParty,
  getAllStates
} from "../../../services/PartyModule/PartyService";

const EditParty = () => {
  const { id } = useParams();
  console.log("partyId====>",id)

  const [partyData, setPartyData] = useState(null);
  const [states, setStates] = useState([]);

  const [currentAddress, setCurrentAddress] = useState({
    address_type: "office",
    address_line1: "",
    address_line2: "",
    city_id: "",
    state_id: "",
    postal_code: "",
    country: "India",
    is_primary: false,
  });

  const [editIndex, setEditIndex] = useState(null);

  /* ------------------ Fetch Party + States ------------------ */
  useEffect(() => {
    const fetchData = async () => {
      const [partyRes, stateRes] = await Promise.all([
        getPartyById(id),
        getAllStates(),
      ]);

      if (partyRes?.success) {
        setPartyData(partyRes.data);
      }

      if (stateRes?.success) {
        setStates(stateRes.data);
      }
    };

    fetchData();
  }, [id]);

  /* ------------------ Handlers ------------------ */
  const handleChange = (e, section = null, index = null) => {
    const { name, value } = e.target;

    if (section === "gst") {
      const updated = [...partyData.gsts];
      updated[index][name] = value;
      setPartyData({ ...partyData, gsts: updated });
    } else {
      setPartyData({ ...partyData, [name]: value });
    }
  };

  const handleAddOrUpdateAddress = () => {
    let updated = [...partyData.addresses];

    if (currentAddress.is_primary) {
      updated = updated.map(a => ({ ...a, is_primary: false }));
    }

    if (editIndex !== null) {
      updated[editIndex] = currentAddress;
    } else {
      updated.push(currentAddress);
    }

    setPartyData({ ...partyData, addresses: updated });
    setCurrentAddress({
      address_type: "office",
      address_line1: "",
      address_line2: "",
      city_id: "",
      state_id: "",
      postal_code: "",
      country: "India",
      is_primary: false,
    });
    setEditIndex(null);
  };

  const handleEditAddress = (index) => {
    setCurrentAddress(partyData.addresses[index]);
    setEditIndex(index);
  };

  const handleRemoveAddress = (index) => {
    const updated = partyData.addresses.filter((_, i) => i !== index);
    setPartyData({ ...partyData, addresses: updated });
  };

  const handleSubmit = async () => {
    const res = await editParty(id, partyData);
    if (res?.success) toast.success("Party updated successfully");
  };

  if (!partyData) return null;

  /* ------------------ UI ------------------ */
  return (
    <div className="max-w-5xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Edit Party</h2>

      {/* Party Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          value={partyData.party_name}
          disabled
          className="p-3 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        <input
          value={partyData.party_type}
          disabled
          className="p-3 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
        />

        <input
          name="contact_person"
          value={partyData.contact_person || ""}
          onChange={handleChange}
          placeholder="Contact Person"
          className="p-3 rounded-md bg-gray-100 focus:outline-none"
        />

        <input
          name="email"
          value={partyData.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 rounded-md bg-gray-100 focus:outline-none"
        />

        <input
          name="phone_number"
          value={partyData.phone_number || ""}
          onChange={handleChange}
          placeholder="Phone Number"
          className="p-3 rounded-md bg-gray-100 focus:outline-none"
        />
      </div>

      {/* GST Section */}
      <div className="bg-gray-50 p-5 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-700">GST Details</h3>

        {partyData.gsts.map((gst, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="gst_number"
              value={gst.gst_number}
              onChange={(e) => handleChange(e, "gst", idx)}
              className="p-3 bg-white rounded-md focus:outline-none"
            />

            <select
              name="state_id"
              value={gst.state_id}
              onChange={(e) => handleChange(e, "gst", idx)}
              className="p-3 bg-white rounded-md focus:outline-none"
            >
              <option value="">Select State</option>
              {states.map(s => (
                <option key={s.id} value={s.id}>{s.state_name}</option>
              ))}
            </select>

            <select
              name="gst_registration_type"
              value={gst.gst_registration_type}
              onChange={(e) => handleChange(e, "gst", idx)}
              className="p-3 bg-white rounded-md focus:outline-none"
            >
              <option value="regular">Regular</option>
              <option value="composition">Composition</option>
            </select>
          </div>
        ))}
      </div>

      {/* Address Form */}
      <div className="bg-gray-50 p-5 rounded-lg space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          {editIndex !== null ? "Edit Address" : "Add Address"}
        </h3>

        <input
          placeholder="Address Line 1"
          value={currentAddress.address_line1}
          onChange={(e) =>
            setCurrentAddress({ ...currentAddress, address_line1: e.target.value })
          }
          className="p-3 bg-white rounded-md focus:outline-none"
        />

        <input
          placeholder="Address Line 2"
          value={currentAddress.address_line2}
          onChange={(e) =>
            setCurrentAddress({ ...currentAddress, address_line2: e.target.value })
          }
          className="p-3 bg-white rounded-md focus:outline-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="City ID"
            value={currentAddress.city_id}
            onChange={(e) =>
              setCurrentAddress({ ...currentAddress, city_id: e.target.value })
            }
            className="p-3 bg-white rounded-md focus:outline-none"
          />

          <select
            value={currentAddress.state_id}
            onChange={(e) =>
              setCurrentAddress({ ...currentAddress, state_id: e.target.value })
            }
            className="p-3 bg-white rounded-md focus:outline-none"
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.state_name}</option>
            ))}
          </select>
        </div>

        <input
          placeholder="Postal Code"
          value={currentAddress.postal_code}
          onChange={(e) =>
            setCurrentAddress({ ...currentAddress, postal_code: e.target.value })
          }
          className="p-3 bg-white rounded-md focus:outline-none"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={currentAddress.is_primary}
            onChange={(e) =>
              setCurrentAddress({ ...currentAddress, is_primary: e.target.checked })
            }
          />
          Set as Primary
        </label>

        <button
          onClick={handleAddOrUpdateAddress}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          {editIndex !== null ? "Update Address" : "Add Address"}
        </button>
      </div>

      {/* Address Table */}
      {partyData.addresses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Address</th>
                <th className="px-4 py-3 text-left">State</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {partyData.addresses.map((addr, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{addr.address_line1}</td>
                  <td className="px-4 py-3">
                    {states.find(s => s.id == addr.state_id)?.state_name}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => handleEditAddress(idx)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleRemoveAddress(idx)} className="text-red-500">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white rounded-md"
      >
        Update Party
      </button>
    </div>
  );
};

export default EditParty;
