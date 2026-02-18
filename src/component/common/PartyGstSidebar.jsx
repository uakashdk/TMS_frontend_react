import React from "react";
import { X } from "lucide-react";
import PermissionGate from "../../app/PermissionGate";

const PartyGSTSidebar = ({ party, onClose }) => {
  if (!party) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="w-105 bg-white h-full shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              {party.party_name}
            </h2>
            <p className="text-sm text-slate-500 capitalize">
              {party.party_type}
            </p>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* ===== GST SECTION ===== */}
         <PermissionGate permission="view_party_gst">

           <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              GST Details
            </h3>

            {party.gsts?.length ? (
              party.gsts.map((gst) => (
                <div
                  key={gst.id}
                  className="border rounded-md p-3 mb-3 text-sm bg-slate-50"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-slate-500">GST Number</p>
                    <p className="font-medium">{gst.gst_number}</p>

                    <p className="text-slate-500">Type</p>
                    <p className="capitalize">{gst.gst_registration_type}</p>

                    <p className="text-slate-500">Primary</p>
                    <p>{gst.is_primary ? "Yes" : "No"}</p>

                    <p className="text-slate-500">Status</p>
                    <p>{gst.is_active ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No GST registered
              </p>
            )}
          </div>
         </PermissionGate>

          {/* ===== ADDRESS SECTION ===== */}
            <PermissionGate permission="view_party_address">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Addresses
            </h3>

            {party.addresses?.length ? (
              party.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border rounded-md p-3 mb-3 text-sm"
                >
                  <p className="font-medium capitalize">
                    {addr.address_type} Address
                    {addr.is_primary && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </p>

                  <p className="text-slate-600 mt-1">
                    {addr.address_line1}
                    {addr.address_line2 && `, ${addr.address_line2}`}
                  </p>

                  <p className="text-slate-500">
                    {addr.postal_code}, {addr.country}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No addresses added
              </p>
            )}
          </div>
          </PermissionGate>
        </div>
      </div>
    </div>
    
  );
};

export default PartyGSTSidebar;
