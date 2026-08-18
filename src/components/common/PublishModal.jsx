import { X } from "lucide-react";

const PublishModal = ({
  title,
  subtitle,
  options,
  optionDefinitions,
  notes,
  onChange,
  onNotesChange,
  onClose,
  onSubmit,
  loading = false,
  submitLabel = "Submit",
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
    <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white">
      <div className="flex flex-shrink-0 items-center justify-between rounded-t-lg bg-blue-600 px-4 py-3 text-white sm:px-6 sm:py-4">
        <div>
          <h3 className="text-sm font-bold sm:text-lg">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-blue-100 sm:text-sm">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close publish dialog"
          className="text-white hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-6">
        {optionDefinitions?.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base">
              Publish Options
            </h4>
            <div className="space-y-2 sm:space-y-3">
              {optionDefinitions.map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(options?.[key])}
                    onChange={(event) => onChange(key, event.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-xs text-gray-700 sm:text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-700 sm:mb-2 sm:text-sm">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            rows={2}
            className="w-full resize-none rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none sm:px-3 sm:py-2 sm:text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 sm:gap-3 sm:pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:px-6 sm:py-2 sm:text-sm"
          >
            {loading ? "Publishing..." : submitLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default PublishModal;
