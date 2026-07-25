import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Pagination from "../../components/common/Pagination";

export default function TeacherVirtualClassJoinedList() {
  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [searchText, setSearchText] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedClass, setSelectedClass] = useState("");

  const [selectedSubject, setSelectedSubject] = useState("");

  const joinedList = [
    {
      id: 1,
      topicName: "Advanced Quantum Mechanics",
      subject: "Physics",
      date: "02/01/2026",
      instructor: "Rama Krishna",
      className: "10-A",
      joined: 48,
    },
    {
      id: 2,
      topicName: "Organic Chemistry Basics",
      subject: "Chemistry",
      date: "13-09-2024",
      instructor: "Sophia",
      className: "11-B",
      joined: 38,
    },
    {
      id: 3,
      topicName: "English Grammar",
      subject: "English",
      date: "15-09-2024",
      instructor: "David",
      className: "8-A",
      joined: 34,
    },
    {
      id: 4,
      topicName: "Trigonometry",
      subject: "Mathematics",
      date: "16-09-2024",
      instructor: "Robert",
      className: "10-A",
      joined: 44,
    },
    {
      id: 5,
      topicName: "Human Digestive System",
      subject: "Biology",
      date: "17-09-2024",
      instructor: "Jessica",
      className: "9-C",
      joined: 46,
    },
    {
      id: 6,
      topicName: "World War II",
      subject: "History",
      date: "18-09-2024",
      instructor: "Richard",
      className: "10-B",
      joined: 45,
    },
    {
      id: 7,
      topicName: "Electric Circuits",
      subject: "Physics",
      date: "19-09-2024",
      instructor: "William",
      className: "11-A",
      joined: 39,
    },
    {
      id: 8,
      topicName: "Algebra",
      subject: "Mathematics",
      date: "20-09-2024",
      instructor: "Joseph",
      className: "9-A",
      joined: 50,
    },
    {
      id: 9,
      topicName: "Chemical Reactions",
      subject: "Chemistry",
      date: "21-09-2024",
      instructor: "Emma",
      className: "10-C",
      joined: 45,
    },
    {
      id: 10,
      topicName: "Solar System",
      subject: "Science",
      date: "22-09-2024",
      instructor: "Noah",
      className: "6-A",
      joined: 40,
    },
  ];

  const filteredData = useMemo(() => {
    return joinedList.filter((item) => {
      const teacher = item.instructor
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const cls = selectedClass ? item.className === selectedClass : true;

      const subject = selectedSubject ? item.subject === selectedSubject : true;

      const date = selectedDate
        ? new Date(item.date.split("-").reverse().join("-"))
            .toISOString()
            .slice(0, 10) === selectedDate
        : true;

      return teacher && cls && subject && date;
    });
  }, [searchText, selectedClass, selectedSubject, selectedDate]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;

  const currentData = filteredData.slice(
    startIndex,

    startIndex + pageSize,
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-4">
      <div className="mb-2">
        <h1 className="text-[28px] font-bold text-[#222]">
          Virtual Class Joined List
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Home / LMS / Virtual Class Joined List
        </p>
      </div>

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border border-gray-200">
          <h2 className="font-semibold text-[#333]">
            Virtual Class Joined List
          </h2>
        </div>

        <div className="p-2">
          <div className="mb-2">
            <strong>Template file</strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search Teacher Name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md pl-10 pr-3 text-sm"
              />
            </div>

            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="
w-full
h-10
rounded-md
border
border-gray-300
px-3
text-sm
focus:border-indigo-500
outline-none
"
              />
            </div>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
            >
              <option value="">Select Class</option>

              <option>6-A</option>

              <option>8-B</option>

              <option>9-A</option>

              <option>10-A</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md px-3 text-sm"
            >
              <option value="">Select Subject</option>

              <option>Physics</option>

              <option>Maths</option>

              <option>Chemistry</option>

              <option>Biology</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="text-left px-4 py-3">S.No.</th>
                  <th className="text-left px-4 py-3">Topic Name</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Instructor</th>
                  <th className="text-left px-4 py-3">Class</th>
                  <th className="text-left px-4 py-3">Members Joined</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.id} className="border border-gray-300">
                    <td className="px-4 py-4">{startIndex + index + 1}</td>

                    <td className="px-4 py-4">
                      <div className="">{item.topicName}</div>

                      <div className="text-xs text-gray-500">
                        {item.subject}
                      </div>
                    </td>

                    <td className="px-4 py-4">{item.date}</td>

                    <td className="px-4 py-4">{item.instructor}</td>

                    <td className="px-4 py-4">{item.className}</td>

                    <td className="px-4 py-4">{item.joined} Members</td>
                  </tr>
                ))}
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
    </div>
  );
}
