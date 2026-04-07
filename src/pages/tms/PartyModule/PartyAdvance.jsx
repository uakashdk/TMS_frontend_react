import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { getAllPartyAdvanced } from "../../../services/PartyModule/ParrtyAdvanceService";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { Plus, Search } from "lucide-react";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
  { value: "PARTIAL", label: "Partial" },
];

const PartyAdvance = () => {
  const navigate = useNavigate();

  const [partyOptions, setPartyOptions] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [records, setRecords] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  // Fetch Party Dropdown
  useEffect(() => {
    const fetchPartyDropdown = async () => {
      const response = await getPartyDropdown();
      const formatted = response?.data?.filter(p => p.party_type === "client")
                .map(p => ({
                    value: p.party_id,
                    label: p.party_name,
                }));
      setPartyOptions([{ value: "", label: "All Parties" }, ...formatted]);
    };
    fetchPartyDropdown();
  }, []);

  // Fetch Data
  const fetchPartyAdvance = async (page = 1) => {
    setLoading(true);
    try {
      const payload = {
        party_id: selectedParty?.value || "",
        status: selectedStatus?.value || "",
        from_date: fromDate,
        to_date: toDate,
        search: search,
        page,
        limit,
      };

      const response = await getAllPartyAdvanced(payload);

      if (response?.success) {
        setRecords(response.data.records);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setTotalRecords(response.data.totalRecords);
      }
    } catch (error) {
      console.error("Error fetching party advance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartyAdvance(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPartyAdvance(1);
  };

  const handleReset = () => {
    setSelectedParty(null);
    setSelectedStatus(statusOptions[0]);
    setFromDate("");
    setToDate("");
    setSearch("");
    setCurrentPage(1);
    fetchPartyAdvance(1);
  };

  const getStatusBadge = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold inline-block";
    switch (status) {
      case "OPEN":
        return `${base} bg-orange-100 text-orange-600`;
      case "CLOSED":
        return `${base} bg-green-100 text-green-600`;
      case "PARTIAL":
        return `${base} bg-blue-100 text-blue-600`;
      default:
        return `${base} bg-gray-100 text-gray-600`;
    }
  };
return (
  <div className="p-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
    
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800">
          Party Advances
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and track all party advance payments
        </p>
      </div>

      <button
        onClick={() => navigate("/add-part-advance")}
        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
      >
        <Plus size={16} />
        Add Party Advance
      </button>
    </div>

    {/* Filter Section */}
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">

        <Select
          options={partyOptions}
          value={selectedParty}
          onChange={setSelectedParty}
          placeholder="Select Party"
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              backgroundColor: "#f3f4f6",
              borderRadius: "12px",
              padding: "4px"
            }),
          }}
        />

        <Select
          options={statusOptions}
          value={selectedStatus}
          onChange={setSelectedStatus}
          styles={{
            control: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              backgroundColor: "#f3f4f6",
              borderRadius: "12px",
              padding: "4px"
            }),
          }}
        />

        <input
          type="date"
          className="bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          className="bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:shadow-md hover:bg-blue-700 transition"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-200 px-5 py-2.5 rounded-xl hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>
    </div>

    {/* Table Section */}
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {loading ? (
        <div className="p-10 text-center text-gray-500">Loading...</div>
      ) : records.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          No Party Advances Found
        </div>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Advance No</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Adjusted</th>
                <th className="px-6 py-4 text-left">Balance</th>
                <th className="px-6 py-4 text-left">Payment Mode</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.advance_number}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.advance_date}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    ₹{item.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    ₹{item.adjusted_amount}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    ₹{item.balance_amount}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.payment_mode}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages} • {totalRecords} Records
            </span>

            <div className="flex gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300 transition"
              >
                Prev
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default PartyAdvance;