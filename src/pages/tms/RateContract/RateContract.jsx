import React, { useEffect, useState } from "react";
import Select from "react-select";
import { FaEye, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getAllRateContract,
  deactivateRateContract,
} from "../../../services/RateContract/RateContract";
import { getPartyDropdown } from "../../../services/PartyModule/PartyService";
import { getRouteDropdown } from "../../../services/RouteService/RouteService";

const RateContract = () => {
  const navigate = useNavigate();

  const [partyOptions, setPartyOptions] = useState([]);
  const [routeOptions, setRouteOptions] = useState([]);

  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rateContracts, setRateContracts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedRateContract, setSelectedRateContract] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const limit = 10;

  // ================= FETCH DROPDOWNS =================
  useEffect(() => {
    const fetchInitialData = async () => {
      const partyRes = await getPartyDropdown();
      const routeRes = await getRouteDropdown();

      const parties = partyRes?.data
        ?.filter((p) => p.party_type === "client")
        .map((p) => ({
          value: p.party_id,
          label: p.party_name,
        }));

      const routes = routeRes?.data?.map((r) => ({
        value: r.id,
        label: `${r.source_city} → ${r.destination_city}`,
      }));

      setPartyOptions(parties || []);
      setRouteOptions(routes || []);
    };

    fetchInitialData();
  }, []);

  // ================= FETCH RATE CONTRACTS =================
  const fetchRateContracts = async (currentPage = 1) => {
    const response = await getAllRateContract({
      party_id: selectedParty?.value,
      route_id: selectedRoute?.value,
      from_date: fromDate,
      to_date: toDate,
      page: currentPage,
      limit,
    });

    if (response?.success) {
      setRateContracts(response.data);
      setTotalPages(response.total_pages);
    }
  };

  // Auto filter when filters change
  useEffect(() => {
    setPage(1);
    fetchRateContracts(1);
  }, [selectedParty, selectedRoute, fromDate, toDate]);

  // Fetch on page change
  useEffect(() => {
    fetchRateContracts(page);
  }, [page]);

  // ================= STATUS TOGGLE =================
  const handleStatusToggle = async () => {
    if (!selectedRateContract) return;

    const res = await deactivateRateContract(selectedRateContract.id);

    if (res?.success) {
      setSelectedRateContract((prev) => ({
        ...prev,
        is_active: !prev.is_active,
      }));

      fetchRateContracts(page);
    }
  };

  // ================= PAGINATION =================
  const renderPagination = () => {
    const pages = [];

    pages.push(
      <button
        key="prev"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        style={paginationBtn}
      >
        Prev
      </button>
    );

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          style={{
            ...paginationBtn,
            background: page === i ? "#4f46e5" : "#e5e7eb",
            color: page === i ? "#fff" : "#000",
          }}
        >
          {i}
        </button>
      );
    }

    pages.push(
      <button
        key="next"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        style={paginationBtn}
      >
        Next
      </button>
    );

    return pages;
  };

  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        {/* ================= HEADER ================= */}
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Rate Contracts</h2>

          <button
            onClick={() => navigate("/add-rate-contract")}
            style={addButtonStyle}
          >
            <FaPlus />
            Add Rate Contract
          </button>
        </div>

        {/* ================= FILTERS ================= */}
        <div style={filterWrapper}>
          <Select
            options={partyOptions}
            value={selectedParty}
            onChange={setSelectedParty}
            placeholder="Select Party"
          />

          <Select
            options={routeOptions}
            value={selectedRoute}
            onChange={setSelectedRoute}
            placeholder="Select Route"
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* ================= TABLE ================= */}
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Rate</th>
              <th style={thStyle}>Freight</th>
              <th style={thStyle}>Effective</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rateContracts?.map((item,index) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{index+1}</td>
                <td style={tdStyle}>₹ {item.rate}</td>
                <td style={tdStyle}>{item.freight_basis}</td>
                <td style={tdStyle}>
                  {item.effective_from} → {item.effective_to || "—"}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background: item.is_active ? "#dcfce7" : "#fee2e2",
                      color: item.is_active ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {item.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={tdStyle}>
                  <FaEye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedRateContract(item);
                      setIsSidebarOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div style={paginationWrapper}>{renderPagination()}</div>
      </div>

      {/* ================= SIDEBAR ================= */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={overlayStyle}
          />

          <div style={sidebarStyle}>
            <div style={sidebarHeader}>
              <h3 style={{ margin: 0 }}>Rate Contract Details</h3>
              <span
                style={{ cursor: "pointer", fontSize: "20px" }}
                onClick={() => setIsSidebarOpen(false)}
              >
                ✕
              </span>
            </div>

            <div style={{ lineHeight: "2" }}>
              <p><strong>ID:</strong> {selectedRateContract?.id}</p>
              <p><strong>Rate:</strong> ₹ {selectedRateContract?.rate}</p>
              <p><strong>Freight:</strong> {selectedRateContract?.freight_basis}</p>
              <p><strong>From:</strong> {selectedRateContract?.effective_from}</p>
              <p><strong>To:</strong> {selectedRateContract?.effective_to || "—"}</p>
            </div>

            {/* Modern Switch */}
            <div style={{ marginTop: "30px" }}>
              <p><strong>Status</strong></p>
              <div
                onClick={handleStatusToggle}
                style={switchContainer}
              >
                <div
                  style={{
                    ...switchSlider,
                    backgroundColor: selectedRateContract?.is_active
                      ? "#4f46e5"
                      : "#ccc",
                  }}
                />
                <div
                  style={{
                    ...switchCircle,
                    left: selectedRateContract?.is_active
                      ? "26px"
                      : "4px",
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RateContract;

/* ================= STYLES ================= */

const pageWrapper = {
  padding: "30px",
  background: "#f3f4f6",
  minHeight: "100vh",
};

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const addButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const filterWrapper = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "15px",
  marginBottom: "25px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px",
};

const paginationWrapper = {
  marginTop: "25px",
  display: "flex",
  justifyContent: "center",
  gap: "6px",
};

const paginationBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(3px)",
};

const sidebarStyle = {
  position: "fixed",
  top: 0,
  right: 0,
  height: "100%",
  width: "400px",
  background: "#fff",
  boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
  padding: "30px",
  borderTopLeftRadius: "20px",
  borderBottomLeftRadius: "20px",
  zIndex: 100,
};

const sidebarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const switchContainer = {
  position: "relative",
  width: "50px",
  height: "24px",
  cursor: "pointer",
};

const switchSlider = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: "34px",
  transition: "0.3s",
};

const switchCircle = {
  position: "absolute",
  bottom: "3px",
  width: "18px",
  height: "18px",
  background: "#fff",
  borderRadius: "50%",
  transition: "0.3s",
};
