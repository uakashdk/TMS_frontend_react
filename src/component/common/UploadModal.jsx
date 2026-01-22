import React from "react";

const UploadModal = ({
  docForm,
  setDocForm,
  onClose,
  onSave,
  edit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-2xl p-6 shadow-xl animate-scaleIn">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {edit ? "Re-Upload Document" : "Upload Document"}
        </h3>

        {/* Document Group */}
        <input
          className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300
          focus:ring-2 focus:ring-fleet-primary focus:outline-none"
          placeholder="Document Group"
          value={docForm.document_group}
          onChange={(e) =>
            setDocForm({ ...docForm, document_group: e.target.value })
          }
        />

        {/* Document Type */}
        <input
          className="w-full mb-3 px-4 py-2 rounded-lg border border-gray-300
          focus:ring-2 focus:ring-fleet-primary focus:outline-none"
          placeholder="Document Type"
          value={docForm.document_type}
          onChange={(e) =>
            setDocForm({ ...docForm, document_type: e.target.value })
          }
        />

        {/* File */}
        <input
          type="file"
          className="w-full text-sm"
          onChange={(e) =>
            setDocForm({ ...docForm, file: e.target.files[0] })
          }
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-5 py-2 rounded-lg bg-fleet-primary text-white font-medium hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
