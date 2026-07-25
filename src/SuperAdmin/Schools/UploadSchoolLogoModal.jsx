import { useEffect, useRef, useState } from "react";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

const acceptedFileTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
const acceptedExtensions = ["png", "jpg", "jpeg", "svg"];

export default function UploadSchoolLogoModal({
  isOpen,
  loading,
  schoolName,
  onClose,
  onUpload,
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(nextPreviewUrl);

    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [file]);

  const resetFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(selectedFile.type) && !acceptedExtensions.includes(extension)) {
      toast.error("Please select a PNG, JPG, JPEG, or SVG image.");
      return;
    }

    setFile(selectedFile);
  };

  const handleClose = () => {
    if (loading || isSubmitting) return;
    resetFile();
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a school logo.");
      return;
    }

    if (loading || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onUpload(file);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (loading || isSubmitting) return;
    selectFile(event.dataTransfer.files?.[0]);
  };

  if (!isOpen) return null;

  const disabled = loading || isSubmitting;

  return (
    <div className="sa-modal-backdrop" role="presentation" onMouseDown={handleClose}>
      <section
        className="sa-modal w-full max-w-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-school-logo-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <h2 id="upload-school-logo-title">Upload School Logo</h2>
            {schoolName && <p className="mt-1 text-sm text-gray-500">{schoolName}</p>}
          </div>
          <button type="button" aria-label="Close" onClick={handleClose} disabled={disabled}>
            <X />
          </button>
        </header>

        <div className="sa-modal-body space-y-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-700">Supported formats:</span> PNG, JPG, JPEG, SVG
          </div>

          <div
            className="cursor-pointer rounded-lg border-2 border-dashed border-[#5038ed] bg-[#f6f4ff] p-6 text-center transition hover:bg-[#f0edff]"
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Choose a school logo file"
            onKeyDown={(event) => {
              if (!disabled && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            <UploadCloud className="mx-auto mb-3 text-[#5038ed]" size={34} />
            <p className="font-semibold text-gray-800">Drag and drop your logo here</p>
            <p className="mt-1 text-sm text-gray-500">or choose an image from your device</p>
            <button
              className="sa-secondary-button mt-4"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={disabled}
            >
              Browse File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml"
              onChange={(event) => selectFile(event.target.files?.[0])}
              className="hidden"
              disabled={disabled}
            />
          </div>

          {file && (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#f0edff] text-[#5038ed]">
                    <ImageIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{Math.ceil(file.size / 1024)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetFile}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                  disabled={disabled}
                >
                  Remove
                </button>
              </div>
              {previewUrl && (
                <div className="mt-4 flex justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 p-2">
                  <img src={previewUrl} alt="Selected school logo preview" className="h-32 max-w-full object-contain" />
                </div>
              )}
            </div>
          )}

          <div className="sa-modal-actions">
            <button type="button" onClick={handleClose} disabled={disabled}>
              Cancel
            </button>
            <button className="sa-primary-button" type="button" onClick={handleUpload} disabled={disabled}>
              {disabled ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
