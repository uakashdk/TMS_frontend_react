import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { addParty, getAllStates } from "../../../services/PartyModule/PartyService";

const partyTypes = ["client", "consignor", "consignee", "vendor", "broker", "supplier"];



const AddParty = () => {
    const [partyData, setPartyData] = useState({
        party_name: "",
        party_type: "",
        contact_person: "",
        email: "",
        phone_number: "",
        gsts: [
            {
                gst_number: "",
                state_id: "",
                gst_registration_type: "regular",
                gst_nature: "fcm",
                is_primary: true
            }
        ],
        addresses: [] // FINAL addresses array
    });

    const [currentAddress, setCurrentAddress] = useState({
        address_type: "office",
        address_line1: "",
        address_line2: "",
        city_id: "",
        state_id: "",
        postal_code: "",
        country: "India",
        is_primary: false
    });

    const [editIndex, setEditIndex] = useState(null);


    const [states, setStates] = useState([]);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const response = await getAllStates();
                if (response?.success && response?.data) {
                    setStates(response.data); // <-- this is now an array
                }
            } catch (error) {
                console.error("Failed to fetch states", error);
            }
        };
        fetchStates();
    }, []);


    const handleAddAddress = () => {
        if (!currentAddress.address_line1 || !currentAddress.state_id) {
            toast.error("Address Line 1 and State are required");
            return;
        }

        if (editIndex !== null) {
            // Edit mode
            const updatedAddresses = [...partyData.addresses];
            updatedAddresses[editIndex] = currentAddress;

            setPartyData({ ...partyData, addresses: updatedAddresses });
            setEditIndex(null);
        } else {
            // Add mode
            setPartyData({
                ...partyData,
                addresses: [...partyData.addresses, currentAddress],
            });
        }

        // Reset form
        setCurrentAddress({
            address_type: "office",
            address_line1: "",
            address_line2: "",
            city_id: "",
            state_id: "",
            postal_code: "",
            country: "India",
            is_primary: false
        });
    };

    const handleRemoveAddress = (index) => {
        const updatedAddresses = [...partyData.addresses];
        updatedAddresses.splice(index, 1);

        setPartyData({
            ...partyData,
            addresses: updatedAddresses
        });
    };

    const handleEditAddress = (index) => {
        setCurrentAddress(partyData.addresses[index]);
        setEditIndex(index);
    };



    const handleChange = (e, section = null, index = null) => {
        const { name, value } = e.target;
        if (section === "gst") {
            const updatedGsts = [...partyData.gsts];
            updatedGsts[index][name] = value;
            setPartyData({ ...partyData, gsts: updatedGsts });
        } else if (section === "address") {
            const updatedAddresses = [...partyData.addresses];
            updatedAddresses[index][name] = value;
            setPartyData({ ...partyData, addresses: updatedAddresses });
        } else {
            setPartyData({ ...partyData, [name]: value });
        }
    };

    const handleSubmit = async () => {
        const result = await addParty(partyData);
        if (result) {
            toast.success("Party added successfully!");
            // Reset form
            setPartyData({
                party_name: "",
                party_type: "",
                contact_person: "",
                email: "",
                phone_number: "",
                gsts: [{
                    gst_number: "",
                    state_id: "",
                    gst_registration_type: "regular",
                    gst_nature: "fcm",
                    is_primary: true
                }],
                addresses: [{ address_type: "office", address_line1: "", address_line2: "", city_id: "", state_id: "", postal_code: "", country: "India", is_primary: true }],
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto my-10 p-8 bg-white shadow-lg rounded-xl space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Add New Party</h2>

            {/* Party Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    name="party_name"
                    value={partyData.party_name}
                    onChange={handleChange}
                    placeholder="Party Name"
                    className="p-3 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                />
                <select
                    name="party_type"
                    value={partyData.party_type}
                    onChange={handleChange}
                    className="p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-0 focus:border-none"
                >
                    <option value="">Select Party Type</option>
                    {partyTypes.map((type, idx) => (
                        <option key={idx} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Display-friendly */}
                        </option>
                    ))}
                </select>


                <input
                    type="text"
                    name="contact_person"
                    value={partyData.contact_person}
                    onChange={handleChange}
                    placeholder="Contact Person"
                    className="p-3 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                />
                <input
                    type="email"
                    name="email"
                    value={partyData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-3 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                />
                <input
                    type="text"
                    name="phone_number"
                    value={partyData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="p-3 rounded-md bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                />
            </div>

            {/* GST Section */}
            <div className="bg-gray-50 p-5 rounded-lg shadow-sm space-y-4">
                <h3 className="text-lg font-medium text-gray-700">GST Details</h3>
                {partyData.gsts.map((gst, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            name="gst_number"
                            value={gst.gst_number}
                            onChange={(e) => handleChange(e, "gst", idx)}
                            placeholder="GST Number"
                            className="p-3 rounded-md bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-none"
                        />
                        <select
                            name="state_id"
                            value={gst.state_id}
                            onChange={(e) => handleChange(e, "gst", idx)}
                            className="p-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-none"
                        >
                            <option value="">Select State</option>
                            {states.map((state) => (
                                <option key={state.id} value={state.id}>
                                    {state.state_name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="gst_registration_type"
                            value={gst.gst_registration_type}
                            onChange={(e) => handleChange(e, "gst", idx)}
                            className="p-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-0 focus:border-none"
                        >
                            <option value="regular">Regular</option>
                            <option value="composition">Composition</option>
                        </select>

                        <select
                            name="gst_nature"
                            value={gst.gst_nature}
                            onChange={(e) => handleChange(e, "gst", idx)}
                            className="p-3 rounded-md bg-white text-gray-800 focus:outline-none"
                        >
                            <option value="fcm">FCM</option>
                            <option value="rcm">RCM</option>
                        </select>
                    </div>
                ))}
            </div>

            {/* Addresses Section */}
            <div className="bg-gray-50 p-5 rounded-lg space-y-4">
                <h3 className="text-lg font-medium text-gray-700">Add Address</h3>

                {/* Address Type */}
                <select
                    value={currentAddress.address_type}
                    onChange={(e) =>
                        setCurrentAddress({ ...currentAddress, address_type: e.target.value })
                    }
                    className="p-3 rounded-md bg-white focus:outline-none"
                >
                    <option value="">Select Address Type</option>
                    <option value="office">Office</option>
                    <option value="billing">Billing</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                </select>

                {/* Address Lines */}
                <input
                    type="text"
                    placeholder="Address Line 1"
                    value={currentAddress.address_line1}
                    onChange={(e) =>
                        setCurrentAddress({ ...currentAddress, address_line1: e.target.value })
                    }
                    className="p-3 rounded-md bg-white focus:outline-none"
                />

                <input
                    type="text"
                    placeholder="Address Line 2 (Optional)"
                    value={currentAddress.address_line2}
                    onChange={(e) =>
                        setCurrentAddress({ ...currentAddress, address_line2: e.target.value })
                    }
                    className="p-3 rounded-md bg-white focus:outline-none"
                />

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <select
                        value={currentAddress.state_id}
                        onChange={(e) =>
                            setCurrentAddress({ ...currentAddress, state_id: e.target.value })
                        }
                        className="p-3 rounded-md bg-white focus:outline-none"
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.id} value={state.id}>
                                {state.state_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Postal Code"
                        value={currentAddress.postal_code}
                        onChange={(e) =>
                            setCurrentAddress({ ...currentAddress, postal_code: e.target.value })
                        }
                        className="p-3 rounded-md bg-white focus:outline-none"
                    />

                    <input
                        type="text"
                        placeholder="Country"
                        value={currentAddress.country}
                        disabled
                        className="p-3 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                </div>

                {/* Primary Checkbox */}
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={currentAddress.is_primary}
                        onChange={(e) =>
                            setCurrentAddress({ ...currentAddress, is_primary: e.target.checked })
                        }
                    />
                    <span>Set as Primary Address</span>
                </label>

                {/* Add / Update Button */}
                <button
                    onClick={handleAddAddress}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    {editIndex !== null ? "Update Address" : "Add Address"}
                </button>
            </div>

            {/* Display Added Addresses */}
            {partyData.addresses.length > 0 && (
                <div className="mt-6 bg-white rounded-lg shadow-sm">
                    <div className="px-4 py-3 border-b">
                        <h3 className="text-base font-semibold text-gray-700">
                            Saved Addresses
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Address</th>
                                    <th className="px-4 py-3 text-left font-medium">State</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {partyData.addresses.map((addr, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-gray-800">
                                            {addr.address_line1}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {states.find(s => s.id == addr.state_id)?.state_name || "-"}
                                        </td>

                                        <td className="px-4 py-3 text-right space-x-4">
                                            <button
                                                onClick={() => handleEditAddress(idx)}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleRemoveAddress(idx)}
                                                className="text-red-500 hover:text-red-700 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}



            <button
                onClick={handleSubmit}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-all"
            >
                Add Party
            </button>
        </div>
    );
};

export default AddParty;
