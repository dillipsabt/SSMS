import React, { useMemo, useState } from "react";
import { Search, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Pagination from "../../components/common/Pagination";

/* ===========================================================
   DUMMY DATA
   Replace this with your API response later
=========================================================== */

const virtualClassesData = [
  {
    id: 1,
    topicName: "Advanced Quantum Mechanics",
    subject: "Physics",
    publishedDate: "12-09-2024",
    publishedBy: "John Deo",
    sendTo: "Class 12-A",
  },
  {
    id: 2,
    topicName: "Organic Chemistry Basics",
    subject: "Chemistry",
    publishedDate: "13-09-2024",
    publishedBy: "Sophia",
    sendTo: "Class 11-B",
  },
  {
    id: 3,
    topicName: "English Grammar",
    subject: "English",
    publishedDate: "15-09-2024",
    publishedBy: "David",
    sendTo: "Class 8-A",
  },
  {
    id: 4,
    topicName: "Trigonometry",
    subject: "Mathematics",
    publishedDate: "16-09-2024",
    publishedBy: "Robert",
    sendTo: "Class 10-A",
  },
  {
    id: 5,
    topicName: "Human Digestive System",
    subject: "Biology",
    publishedDate: "17-09-2024",
    publishedBy: "Jessica",
    sendTo: "Class 9-C",
  },
  {
    id: 6,
    topicName: "World War II",
    subject: "History",
    publishedDate: "18-09-2024",
    publishedBy: "Richard",
    sendTo: "Class 10-B",
  },
  {
    id: 7,
    topicName: "Electric Circuits",
    subject: "Physics",
    publishedDate: "19-09-2024",
    publishedBy: "William",
    sendTo: "Class 11-A",
  },
  {
    id: 8,
    topicName: "Algebra",
    subject: "Mathematics",
    publishedDate: "20-09-2024",
    publishedBy: "Joseph",
    sendTo: "Class 9-A",
  },
  {
    id: 9,
    topicName: "Chemical Reactions",
    subject: "Chemistry",
    publishedDate: "21-09-2024",
    publishedBy: "Emma",
    sendTo: "Class 10-C",
  },
  {
    id: 10,
    topicName: "Solar System",
    subject: "Science",
    publishedDate: "22-09-2024",
    publishedBy: "Noah",
    sendTo: "Class 6-A",
  },
];

/* ===========================================================
   COMPONENT
=========================================================== */

export default function TeacherPublishVirtualClasses() {
  /* =======================================================
      STATES
  ======================================================= */

  const [searchText, setSearchText] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  /* =======================================================
      FILTER DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    return virtualClassesData.filter((item) => {
      const search = searchText.toLowerCase();

      const matchesSearch =
        item.topicName.toLowerCase().includes(search) ||
        item.subject.toLowerCase().includes(search) ||
        item.publishedBy.toLowerCase().includes(search) ||
        item.sendTo.toLowerCase().includes(search);

      if (!selectedDate) return matchesSearch;

      const formattedDate = item.publishedDate.split("-").reverse().join("-");

      return matchesSearch && formattedDate === selectedDate;
    });
  }, [searchText, selectedDate]);

  /* =======================================================
      PAGINATION
  ======================================================= */

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  /* =======================================================
      JSX START
  ======================================================= */

  return (
    <div className="min-h-screen bg-white p-2 md:p-4">
      {/* ===================================================
          PAGE TITLE
      =================================================== */}

      <div className="mb-2">
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#222]">
          Publish Virtual Classes
        </h1>
      </div>

      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <div className="bg-white rounded-md border border-[#E5E7EB] overflow-hidden">
        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border-b border-[#E5E7EB]">
          <h2 className="text-[18px] font-semibold text-[#333]">
            Publish Virtual Classes
          </h2>

          {/* ===========================================
              SEARCH + DATE
          =========================================== */}

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* SEARCH */}

            <div className="relative w-full sm:w-[280px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchText(e.target.value);
                }}
                className="
                  w-full
                  h-11
                  rounded-md
                  border
                  border-gray-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  focus:border-[#5A42F3]
                "
              />
            </div>

            {/* DATE */}

            <div className="relative w-full sm:w-[220px]">
              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSelectedDate(e.target.value);
                }}
                className="
                  w-full
                  h-11
                  rounded-md
                  border
                  border-gray-300
                  pl-10
                  pr-4
                  text-sm
                  outline-none
                  focus:border-[#5A42F3]
                "
              />
            </div>
          </div>
        </div>

        {/* ===================================================
                        TABLE
    =================================================== */}

        <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full border-collapse">
            {/* ===============================
                TABLE HEADER
            ================================ */}

            <thead>
              <tr className="bg-indigo-50 border-b border-[#E5E7EB]">
                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#333]">
                  S.No
                </th>

                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#333]">
                  Topic Name
                </th>

                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#333]">
                  Published Date
                </th>

                <th className="px-5 py-4 text-left text-[13px] font-semibold text-[#333]">
                  Published By
                </th>

                <th className="px-5 py-4 text-left justify-end text-[13px] font-semibold text-[#333]">
                  Send To
                </th>
              </tr>
            </thead>

            {/* ===============================
                TABLE BODY
            ================================ */}

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="
                      border-b
                      border-[#ECECEC]
                      transition
                    "
                  >
                    {/* SERIAL NUMBER */}

                    <td className="px-5 py-5 text-[14px] text-[#555]">
                      {startIndex + index + 1}
                    </td>

                    {/* TOPIC */}

                    <td className="px-5 py-5">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[#333]">
                          {item.topicName}
                        </span>

                        <span className="mt-1 text-[12px] text-[#8B8B8B]">
                          {item.subject}
                        </span>
                      </div>
                    </td>

                    {/* DATE */}

                    <td className="px-5 py-5 text-[14px] text-[#555]">
                      {item.publishedDate}
                    </td>

                    {/* PUBLISHED BY */}

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] text-[#333]">
                          {item.publishedBy}
                        </span>
                      </div>
                    </td>

                    {/* SEND TO */}

                    <td className="px-5 py-5">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                        Student Portal
                      </span>

                      {/* <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
Parent Portal
</span> */}

                      {/* <span
                        className="
                          inline-flex
                          items-center
                          px-4
                          py-2
                          rounded-full
                          bg-[#EEF2FF]
                          text-[#5A42F3]
                          text-[13px]
                          font-medium
                        "
                      >

                        {item.sendTo}

                      </span> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <h3 className="mt-5 text-lg font-semibold text-gray-700">
                        No Virtual Classes Found
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        There are no records available.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={pageSize}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setPageSize}
        />
      </div>
    </div>
  );
}
