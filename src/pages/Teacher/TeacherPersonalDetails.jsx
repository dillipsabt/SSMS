import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BriefcaseBusiness, CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import girl from "../../assets/girl.png";
import bgimage from "../../assets/bgimage.png";
import { fetchTeacherProfileAsync } from "../../features/teacher/TeacherDetails/teacherDetailsSlice";

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

export default function TeacherPersonalDetails() {
  const dispatch = useDispatch();
  const { teacher, loading, error } = useSelector((state) => state.teacherDetails);

  useEffect(() => {
    if (!teacher && !loading && !error) dispatch(fetchTeacherProfileAsync());
  }, [dispatch, error, loading, teacher]);

  if (loading && !teacher) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Loading profile...</div>;
  }

  if (!teacher) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Teacher details are unavailable.</div>;
  }

  const personalInformation = [
    { label: "Gender", value: teacher.gender },
    { label: "Date of birth", value: teacher.dob },
    { label: "Phone", value: teacher.phoneNo },
    { label: "Email", value: teacher.email },
    { label: "Father / guardian", value: teacher.fatherName },
    { label: "Mother", value: teacher.motherName },
    { label: "Marital status", value: teacher.maritalStatus },
    { label: "Aadhaar number", value: teacher.aadharNumber },
  ];

  const professionalInformation = [
    { label: "Teacher code", value: teacher.teacherCode },
    { label: "Department", value: teacher.departmentName },
    { label: "Subject", value: teacher.subject },
    { label: "Qualification", value: teacher.qualification },
    { label: "Experience", value: teacher.totalYearsExperience ? `${teacher.totalYearsExperience} years` : "-" },
    { label: "Joining date", value: teacher.joinDate },
    { label: "Shift", value: teacher.shift },
    { label: "Contract type", value: teacher.contractType },
    { label: "Branch / location", value: teacher.worklocation },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">My profile</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--theme-text)] sm:text-3xl">Teacher profile</h1>
        <p className="mt-1 text-sm text-[var(--theme-text-muted)]">Your professional and personal information.</p>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-brand-600/20 shadow-[var(--theme-shadow)]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgimage})` }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/95 via-brand-600/90 to-slate-900/85" />
        <div className="relative flex flex-col gap-5 p-5 text-white sm:flex-row sm:items-center sm:p-7">
          <img src={teacher.profileUrl || girl} alt={teacher.fullName || "Teacher"} className="h-24 w-24 rounded-2xl border-4 border-white/30 object-cover shadow-lg" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-bold sm:text-3xl">{teacher.fullName || "Teacher"}</h2>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold ring-1 ring-white/30">Teacher</span>
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-semibold text-emerald-50 ring-1 ring-emerald-200/40">Active</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              <span>Employee code: {teacher.teacherCode || "-"}</span>
              <span>{teacher.departmentName || "Department unavailable"}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Personal information" icon={<ShieldCheck size={17} className="text-brand-600" />}>
          <DetailList items={personalInformation} />
        </DetailCard>
        <DetailCard title="Professional information" icon={<BriefcaseBusiness size={17} className="text-brand-600" />}>
          <DetailList items={professionalInformation} />
        </DetailCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DetailCard title="Contact and address" icon={<MapPin size={17} className="text-brand-600" />}>
          <DetailList items={[
            { label: "Present address", value: teacher.presentAddress },
            { label: "Permanent address", value: teacher.permanentAddress },
            { label: "Phone", value: teacher.phoneNo },
            { label: "Email", value: teacher.email },
          ]} />
        </DetailCard>
        <DetailCard title="Documents" icon={<CalendarDays size={17} className="text-brand-600" />}>
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <div>
              <p className="text-sm font-medium text-[var(--theme-text)]">Aadhaar document</p>
              <p className="mt-1 text-xs text-[var(--theme-text-muted)]">Available documents from your profile.</p>
            </div>
            {teacher.aadharUrl ? (
              <a href={teacher.aadharUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-brand-600/30 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50">View file</a>
            ) : <span className="text-sm text-[var(--theme-text-muted)]">Not available</span>}
          </div>
        </DetailCard>
      </div>

      <DetailCard title="Work experience" icon={<BriefcaseBusiness size={17} className="text-brand-600" />}>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-[var(--theme-surface-raised)] text-xs uppercase tracking-wide text-[var(--theme-text-muted)]">
              <tr>{["School", "Experience", "Subject", "From", "To", "Certificate"].map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-divider)] text-[var(--theme-text)]">
              {teacher.workExperiences?.length ? teacher.workExperiences.map((item, index) => (
                <tr key={`${item.schoolName}-${index}`}>
                  <td className="px-4 py-3">{item.schoolName || "-"}</td><td className="px-4 py-3">{item.years || "-"}</td><td className="px-4 py-3">{item.subject || "-"}</td><td className="px-4 py-3">{item.startDate || "-"}</td><td className="px-4 py-3">{item.endDate || "-"}</td>
                  <td className="px-4 py-3">{item.experienceCertUrl ? <a href={item.experienceCertUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline">View certificate</a> : "-"}</td>
                </tr>
              )) : <tr><td colSpan="6" className="px-4 py-6 text-center text-[var(--theme-text-muted)]">No work experience records available.</td></tr>}
            </tbody>
          </table>
        </div>
      </DetailCard>
    </div>
  );
}
