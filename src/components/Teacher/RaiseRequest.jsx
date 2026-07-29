import { useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { createTeacherTimetableRequestAsync, fetchTeacherTimetableRequestsAsync } from "../../features/teacher/Timetable/teacherTimetableSlice";

export default function RaiseRequest({ open, onClose, scheduleItems }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.teacherTimetable);
  const [detailId, setDetailId] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [comments, setComments] = useState("");
  if (!open) return null;

  const close = () => { setDetailId(""); setRequestDate(""); setComments(""); onClose(); };
  const submit = async () => {
    if (!detailId || !requestDate || !comments.trim()) return toast.error("Schedule item, request date, and comments are required");
    try {
      await dispatch(createTeacherTimetableRequestAsync({ teacherScheduleDetailId: Number(detailId), requestDate, comments: comments.trim() })).unwrap();
      toast.success("Request submitted successfully");
      dispatch(fetchTeacherTimetableRequestsAsync());
      close();
    } catch (error) {
      toast.error(error?.message ?? "Unable to submit request");
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"><div className="flex items-center justify-between bg-brand-600 px-5 py-4 text-white"><h2 className="text-lg font-semibold">Raise Request</h2><button onClick={close} aria-label="Close"><X /></button></div><div className="space-y-4 p-5"><div><label className="form-label">Schedule Item <span className="text-red-500">*</span></label><select value={detailId} onChange={(event) => setDetailId(event.target.value)} className="form-select"><option value="">Select</option>{scheduleItems.map((item, index) => <option key={item.id ?? index} value={item.id}>{item.subjectName ?? item.subject?.subjectName ?? item.subject?.name} · {item.className ?? item.class?.className} · {item.startTime ?? item.timeSlot?.startTime}</option>)}</select></div><div><label className="form-label">Request Date <span className="text-red-500">*</span></label><input type="date" value={requestDate} onChange={(event) => setRequestDate(event.target.value)} className="form-input" /></div><div><label className="form-label">Comments <span className="text-red-500">*</span></label><textarea value={comments} onChange={(event) => setComments(event.target.value)} className="form-textarea" placeholder="Write here" /></div><div className="flex justify-end gap-3"><button onClick={close} className="btn-secondary">Cancel</button><button disabled={loading} onClick={submit} className="btn-primary disabled:opacity-50">{loading ? "Submitting..." : "Submit Request"}</button></div></div></div></div>;
}
