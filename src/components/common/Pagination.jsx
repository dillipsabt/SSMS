import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  setCurrentPage,
  setRowsPerPage,
}) => {
  const pageCount = Math.max(1, totalPages || 0);

  return (
    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 mt-4 text-[12px]">
      
      {/* PREV */}
      <button
        disabled={currentPage <= 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="border px-2 py-[4px] rounded text-gray-600 disabled:opacity-50"
      >
        Prev
      </button>

      {/* NEXT */}
      <button
        disabled={currentPage >= pageCount}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="bg-brand-600 text-white px-3 py-[4px] rounded disabled:opacity-50"
      >
        Next
      </button>

      {/* PAGE INFO */}
      <span className="text-gray-500 whitespace-nowrap">
        Page: {Math.min(Math.max(currentPage, 1), pageCount)} of {pageCount}
      </span>

      {/* ROWS */}
      <select
        value={rowsPerPage}
        onChange={(e) => {
          setRowsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="border border-gray-300 px-2 py-[4px] rounded min-w-[70px] bg-white"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
};

export default Pagination;
