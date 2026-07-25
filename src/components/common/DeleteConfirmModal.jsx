import React from "react";

const DeleteConfirmModal = ({
  isOpen,
  title = "Delete",
  message = "Are you sure you want to delete?",
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-5">
        <h2 className="text-[16px] font-semibold text-[#333333]">
          {title}
        </h2>

        <p className="text-[13px] text-gray-500 mt-2">
          {message}
        </p>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[12px] border border-gray-300 rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-[12px] bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;