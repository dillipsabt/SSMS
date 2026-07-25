import { X } from "lucide-react";

const AttachmentModal = ({
  isOpen,
  onClose,
  attachmentData,
}) => {
  if (!isOpen) return null;

  const files = attachmentData?.attachmentUrl
    ? [attachmentData.attachmentUrl]
    : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* MODAL */}
      <div className="bg-white w-[550px] max-w-[95vw] rounded-xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-indigo-600 text-white px-5 py-3 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Attachments</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 text-sm">
          {/* TITLE ROW */}
          <div className="mb-4 flex gap-8 text-gray-800">
            <div>
              <span className="font-medium text-gray-600">Title:</span>{" "}
              <span className="font-semibold">{attachmentData?.title || "-"}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Subject:</span>{" "}
              <span className="font-semibold">{attachmentData?.subjectName || "-"}</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          {attachmentData?.description && (
            <div className="mb-4">
              <span className="font-medium text-gray-600">Description:</span>
              <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-200">
                {attachmentData.description}
              </p>
            </div>
          )}

          {/* TABLE */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700 border-b border-gray-200">
                    File Attachments Name
                  </th>
                </tr>
              </thead>

              <tbody>
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <a
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {file.split("/").pop()}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-3 text-gray-500">
                      No Attachment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end mt-5">
            <button
              onClick={onClose}
              className="border border-red-400 text-red-500 px-5 py-2 rounded-md text-sm hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;