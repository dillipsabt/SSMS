import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetailsByProfile } from "../../features/student/studentDetails/studentDetailsSlice";
import girl from "../../assets/girl.png";

const valueOrDash = (value) => value || "-";

const imageSource = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.url) return value.url;
  if (value.fileUrl) return value.fileUrl;
  if (value.data && value.contentType) return `data:${value.contentType};base64,${value.data}`;
  return "";
};

export default function StudentIdCard() {
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

  if (error && !studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Unable to load student details.</div>;
  }

  if (!studentDetails) {
    return <div className="p-5 text-center text-sm text-[var(--theme-text-muted)]">Student details are unavailable.</div>;
  }

  const logo = imageSource(studentDetails.schoolLogo || studentDetails.schoolLogoUrl || studentDetails.logoUrl);
  const photo = imageSource(studentDetails.profileUrl || studentDetails.photoUrl) || girl;
  const signature = imageSource(
    studentDetails.principalSignature || studentDetails.principalSignatureUrl || studentDetails.signatureUrl,
  );
  const studentName = studentDetails.fullName || studentDetails.studentName || studentDetails.name;
  const academicYear = studentDetails.academicYear || studentDetails.academicSession;
  const className = [studentDetails.className || studentDetails.class, studentDetails.section]
    .filter(Boolean)
    .join("-");

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--theme-text)]">Student ID Card</h1>
        <p className="mt-1 text-xs text-[var(--theme-text-muted)]">Home / Student ID Card</p>
      </div>

      <section className="flex min-h-[calc(100vh-180px)] items-center justify-center rounded-sm bg-[#edf4ff] px-4 py-8 sm:px-8">
        <article className="relative aspect-[0.56] w-full max-w-[290px] overflow-hidden rounded-[3px] bg-gradient-to-b from-[#4b2bf4] via-[#5535ef] to-[#6c45e7] shadow-[0_2px_4px_rgba(36,20,110,0.28)] sm:max-w-[310px]">
          <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[#5534f3] to-[#5b3bef]" />
          <div className="absolute inset-x-[7%] bottom-0 top-[35%] rounded-t-[18px] bg-gradient-to-b from-[#8f68ed] via-[#9a70eb] to-[#a477e8]" />

          <div className="relative flex h-full flex-col items-center px-[10%] pt-[7%] text-white">
            {logo ? (
              <img src={logo} alt="School logo" className="h-[15%] w-[30%] object-contain" />
            ) : (
              <div className="h-[15%] w-[30%]" />
            )}

            <div className="mt-[4%] h-[29%] w-[57%] rounded-full border-[3px] border-white bg-[#70e6e5] p-[3px] shadow-[0_2px_5px_rgba(0,0,0,0.14)] sm:border-4">
              <img
                src={photo}
                alt={valueOrDash(studentName)}
                className="h-full w-full rounded-full object-cover"
                onError={(event) => { event.currentTarget.src = girl; }}
              />
            </div>

            <div className="mt-[5%] text-center">
              <h2 className="text-[clamp(9px,2.2vw,15px)] font-bold tracking-[0.08em]">{valueOrDash(studentName)}</h2>
              <p className="mt-1 text-[clamp(8px,1.8vw,12px)] font-medium">{valueOrDash(academicYear)}</p>
            </div>

            <dl className="mt-[9%] w-[82%] space-y-[4%] text-[clamp(8px,1.8vw,12px)]">
              <div className="flex"><dt className="w-[48%]">Roll Number</dt><dd>{valueOrDash(studentDetails.rollNo || studentDetails.rollNumber)}</dd></div>
              <div className="flex"><dt className="w-[48%]">Class</dt><dd>{valueOrDash(className)}</dd></div>
              <div className="flex"><dt className="w-[48%]">Blood Group</dt><dd>{valueOrDash(studentDetails.bloodGroup)}</dd></div>
            </dl>

            <div className="absolute bottom-[5%] right-[10%] flex w-[38%] flex-col items-center text-center">
              <div className="flex h-[35px] w-full items-end justify-center">
                {signature ? <img src={signature} alt="Principal signature" className="max-h-full max-w-full object-contain" /> : null}
              </div>
              <span className="mt-1 text-[clamp(7px,1.5vw,10px)]">Principal Signature</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
