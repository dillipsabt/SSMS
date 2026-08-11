import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStudentIdCardDetails } from "../../features/Admin/student/studentAPI";
import girl from "../../assets/girl.png";

const valueOrDash = (value) => value || "-";
const responseData = (response) => response?.data?.data ?? response?.data;

const imageSource = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.url) return value.url;
  if (value.fileUrl) return value.fileUrl;
  if (value.data && value.contentType) return `data:${value.contentType};base64,${value.data}`;
  return "";
};

export default function StudentIdCard() {
  const profileId = useSelector((state) => state.auth.profileId);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!profileId) {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);
    getStudentIdCardDetails(profileId)
      .then((response) => {
        if (active) setStudentDetails(responseData(response));
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [profileId]);

  if (loading && !studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Loading profile...</div>;
  }

  if (error && !studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Unable to load student details.</div>;
  }

  if (!studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Student details are unavailable.</div>;
  }

  const logo = imageSource(studentDetails.schoolLogo || studentDetails.schoolLogoUrl || studentDetails.logoUrl);
  const photo = imageSource(
    studentDetails.studentPhoto ||
      studentDetails.profilePhoto ||
      studentDetails.profilePhotoUrl ||
      studentDetails.profileUrl ||
      studentDetails.photo ||
      studentDetails.photoUrl,
  ) || girl;
  const signature = imageSource(
    studentDetails.principalSignature || studentDetails.principalSignatureUrl || studentDetails.signatureUrl,
  );
  const studentName = studentDetails.fullName || studentDetails.studentName || studentDetails.name;
  const academicYear = studentDetails.academicYear || studentDetails.academicSession;
  const className = [studentDetails.classAndSection || studentDetails.className || studentDetails.class, studentDetails.section]
    .filter(Boolean)
    .join("-");

  const fatherName = studentDetails.fatherName || studentDetails.father || studentDetails.parentName;
  const gender = studentDetails.gender;
  const dateOfBirth = studentDetails.dob || studentDetails.dateOfBirth;
  const rollNumber = studentDetails.rollNo || studentDetails.rollNumber;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">Student ID Card</h1>
        <p className="mt-1 text-xs text-[var(--theme-text-muted)]">Home / Student ID Card</p>
      </div>

      <section className="flex min-h-[calc(100vh-180px)] items-center justify-center rounded-sm bg-[#edf4ff] px-4 py-8 sm:px-8">
        <article className="relative aspect-[54/91] w-full max-w-[360px] overflow-hidden rounded-[5px] bg-[#5237e6] shadow-[0_3px_8px_rgba(36,20,110,0.35)]">
          <div className="absolute inset-x-0 top-0 h-[29.67%] bg-[#5237e6]" />
          <div className="absolute inset-x-[5.56%] bottom-[3.3%] top-[29.67%] rounded-[6%] bg-[#976ff1]" />

          <div className="absolute left-[13%] top-[3.85%] flex aspect-square w-[16.67%] items-center justify-center rounded-full bg-white p-[1.5%]">
            {logo ? (
              <img src={logo} alt="School logo" className="h-full w-full object-contain" />
            ) : null}
          </div>

          <div className="absolute left-[31.5%] top-[5.3%] w-[59%] text-white">
            <h2 className="text-[clamp(9px,3vw,15px)] font-bold leading-[1.05]">
              {valueOrDash(studentDetails.schoolName)}
            </h2>
            <p className="mt-[2.5%] text-[clamp(6px,1.7vw,10px)] leading-[1.05]">
              {valueOrDash(studentDetails.schoolAddress || studentDetails.address)}
            </p>
          </div>

          <div className="absolute left-1/2 top-[19.78%] aspect-square w-[43.7%] -translate-x-1/2 rounded-full bg-[#bff6f4] p-[1.5%]">
            <img
              src={photo}
              alt={valueOrDash(studentName)}
              className="h-full w-full rounded-full object-cover"
              onError={(event) => { event.currentTarget.src = girl; }}
            />
          </div>

          <div className="absolute inset-x-[7.4%] top-[51.6%] text-center text-white">
            <h2 className="text-[clamp(10px,3vw,16px)] font-bold leading-[1.05]">
              {valueOrDash(studentName)}
            </h2>
            <p className="mt-[2%] text-[clamp(7px,1.8vw,10px)] leading-none">
              {valueOrDash(academicYear)}
            </p>
          </div>

          <div className="absolute inset-x-[14.8%] top-[64.8%] grid grid-cols-2 gap-x-[5%] gap-y-[4.2%] text-white">
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Roll Number</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(rollNumber)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Father&apos;s Name</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(fatherName)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Class / Section</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(className)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Gender</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(gender)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Date of Birth</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(dateOfBirth)}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[clamp(5px,1.55vw,9px)] leading-none text-[#f5f1ff]">Blood Group</p>
              <p className="mt-[9%] truncate text-[clamp(6px,1.8vw,10px)] font-bold leading-none">{valueOrDash(studentDetails.bloodGroup)}</p>
            </div>
          </div>

          <div className="absolute inset-x-[14.8%] top-[84.6%] h-px bg-[#dcc9ff]" />
          {signature ? (
            <img
              src={signature}
              alt="Principal signature"
              className="absolute right-[11.1%] top-[85.7%] h-[5.7%] w-[38.9%] object-contain"
            />
          ) : null}
          <div className="absolute bottom-[7.1%] right-[11.1%] w-[40.7%] border-b border-white/90" />
          <p className="absolute bottom-[3.2%] right-[11.1%] w-[40.7%] text-center text-[clamp(5px,1.3vw,8px)] font-bold leading-none text-white">
            Principal Signature
          </p>
          <p className="absolute bottom-[3.2%] left-[14.8%] text-[clamp(5px,1.3vw,8px)] leading-none text-white">
            Property of the school
          </p>
        </article>
      </section>
    </div>
  );
}
