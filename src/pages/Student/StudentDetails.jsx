import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, FileText, GraduationCap, ShieldCheck, Users } from "lucide-react";
import girl from "../../assets/girl.png";
import bgimage from "../../assets/bgimage.png";
import { fetchStudentDetailsByProfile } from "../../features/student/studentDetails/studentDetailsSlice";

function DetailCard({ title, icon, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
      <div className="flex items-center gap-2 border-b border-[var(--theme-divider)] bg-[var(--theme-surface-raised)] px-4 py-3 sm:px-5">
        {icon}
        <h2 className="text-sm font-semibold text-[var(--theme-text)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DetailList({ items }) {
  return (
    <dl className="grid grid-cols-1 divide-y divide-[var(--theme-divider)] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      {items.map(({ label, value }) => (
        <div key={label} className="px-4 py-3 sm:px-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-[var(--theme-text-muted)]">{label}</dt>
          <dd className="mt-1 break-words text-sm font-medium text-[var(--theme-text)]">{value || "-"}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function StudentDetails() {
  const dispatch = useDispatch();
  const profileId = useSelector((state) => state.auth.profileId);
  const { studentDetails, loading, error } = useSelector((state) => state.studentDetails);

  useEffect(() => {
    if (profileId && !studentDetails && !loading && !error) {
      dispatch(fetchStudentDetailsByProfile(profileId));
    }
  }, [dispatch, error, loading, profileId, studentDetails]);

  if (loading && !studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Loading profile...</div>;
  }

  if (!studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Student details are unavailable.</div>;
  }

  const academicInformation = [
    { label: "Admission number", value: studentDetails.admissionNo },
    { label: "Roll number", value: studentDetails.rollNo },
    { label: "Class", value: studentDetails.className },
    { label: "Section", value: studentDetails.section },
    { label: "Academic year", value: studentDetails.academicYear },
    { label: "Branch", value: studentDetails.branchName },
  ];

  const personalInformation = [
    { label: "Gender", value: studentDetails.gender },
    { label: "Date of birth", value: studentDetails.dob },
    { label: "Phone", value: studentDetails.parentPhoneNo },
    { label: "Alternative phone", value: studentDetails.altPhoneNo },
    { label: "Email", value: studentDetails.email },
    { label: "Hobbies", value: studentDetails.hobbies },
    { label: "Present address", value: studentDetails.presentAddress },
    { label: "Permanent address", value: studentDetails.permanentAddress },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">My profile</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--theme-text)] sm:text-3xl">Student profile</h1>
        <p className="mt-1 text-sm text-[var(--theme-text-muted)]">Your academic and personal information.</p>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-brand-600/20 shadow-[var(--theme-shadow)]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgimage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/95 via-brand-600/90 to-slate-900/85" />
        <div className="relative flex flex-col gap-5 p-5 text-white sm:flex-row sm:items-center sm:p-7">
          <img src={studentDetails.profileUrl || studentDetails.photoUrl || girl} alt={studentDetails.fullName || "Student"} className="h-24 w-24 rounded-2xl border-4 border-white/30 object-cover shadow-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-bold sm:text-3xl">{studentDetails.fullName || "Student"}</h2>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/30">Student</span>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-200/40">Active</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              <span>Admission no: {studentDetails.admissionNo || "-"}</span>
              <span>{[studentDetails.className, studentDetails.section].filter(Boolean).join(" · ") || "Class unavailable"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Academic information" icon={<GraduationCap size={17} className="text-brand-600" />}>
          <DetailList items={academicInformation} />
          {studentDetails.subjects?.length ? <div className="border-t border-[var(--theme-divider)] px-4 py-3 sm:px-5"><p className="text-xs font-medium uppercase tracking-wide text-[var(--theme-text-muted)]">Subjects</p><div className="mt-2 flex flex-wrap gap-2">{studentDetails.subjects.map((subject) => <span key={subject} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{subject}</span>)}</div></div> : null}
        </DetailCard>
        <DetailCard title="Personal information" icon={<ShieldCheck size={17} className="text-brand-600" />}>
          <DetailList items={personalInformation} />
        </DetailCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Parent details" icon={<Users size={17} className="text-brand-600" />}>
          <DetailList items={[
            { label: "Father / guardian", value: studentDetails.fatherName },
            { label: "Mother", value: studentDetails.motherName },
          ]} />
        </DetailCard>
        <DetailCard title="Previous school" icon={<BookOpen size={17} className="text-brand-600" />}>
          <DetailList items={[{ label: "School", value: studentDetails.previousSchoolName }, { label: "Languages", value: studentDetails.languages }]} />
        </DetailCard>
      </div>

      {studentDetails.documents?.length ? (
        <DetailCard title="Documents" icon={<FileText size={17} className="text-brand-600" />}>
          <ul className="divide-y divide-[var(--theme-divider)]">
            {studentDetails.documents.map((document, index) => (
              <li key={`${document.label}-${index}`} className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <div className="min-w-0"><p className="truncate text-sm font-medium text-[var(--theme-text)]">{document.label || "Document"}</p><p className="mt-1 truncate text-xs text-[var(--theme-text-muted)]">{document.file || "Available document"}</p></div>
                {document.url ? <a href={document.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-brand-600/30 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50">View file</a> : <span className="text-sm text-[var(--theme-text-muted)]">Not available</span>}
              </li>
            ))}
          </ul>
        </DetailCard>
      ) : null}
    </div>
  );
}
