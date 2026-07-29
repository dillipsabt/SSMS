import { Download } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToastMessage from "../../utils/useToastMessage";
import {
  clearError,
  downloadStudentHallTicketAsync,
  fetchStudentHallTickets,
} from "../../features/student/studentHallTicket/studentHallTicketSlice";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const getId = (ticket) => ticket.hallTicketId || ticket.id;

export default function StudentHallTicket() {
  const dispatch = useDispatch();
  const { hallTickets = [], loading, error } = useSelector(
    (state) => state.studentHallTicket || {},
  );

  useEffect(() => {
    dispatch(fetchStudentHallTickets());
  }, [dispatch]);

  useToastMessage({ error, clearError });

  const handleDownload = async (ticket) => {
    const blob = await dispatch(downloadStudentHallTicketAsync(getId(ticket))).unwrap();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hall-ticket-${ticket.hallTicketNo || getId(ticket)}.pdf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return <div className="w-full">
    <h1 className="text-2xl font-bold text-gray-800">Hall Ticket List</h1>
    <p className="text-sm text-gray-500 mb-6">Exams / Hall Ticket List</p>

    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-md font-semibold text-gray-700">Hall Ticket List</h2>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-gray-800">
                <th className="px-4 py-3 text-left font-medium">S.No</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Hall Ticket No.</th>
                <th className="px-4 py-3 text-left font-medium">Exam Type</th>
                <th className="px-4 py-3 text-center font-medium">Download Hall Ticket</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="py-10 text-center text-gray-500">Loading...</td></tr> : hallTickets.length > 0 ? hallTickets.map((ticket, index) => <tr key={getId(ticket)} className="border-b border-gray-200 hover:bg-gray-50"><td className="px-4 py-3 text-gray-700">{index + 1}</td><td className="px-4 py-3 text-gray-700">{formatDate(ticket.publishedDate || ticket.generatedDate || ticket.date)}</td><td className="px-4 py-3 text-gray-700">{ticket.hallTicketNo || "-"}</td><td className="px-4 py-3 text-gray-700">{ticket.examType || ticket.examinationType || "-"}</td><td className="px-4 py-3 text-center"><button onClick={() => handleDownload(ticket)} className="text-indigo-600 hover:text-indigo-700" aria-label={`Download ${ticket.hallTicketNo || "hall ticket"}`}><Download size={26} /></button></td></tr>) : <tr><td colSpan={5} className="py-10 text-center text-gray-500">No hall tickets found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>;
}
