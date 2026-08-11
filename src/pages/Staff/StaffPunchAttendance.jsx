import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, Check, X } from "lucide-react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import {
  fetchTeacherAttendance,
  enrollTeacherFace,
  punchInTeacher,
  punchOutTeacher,
  verifyTeacherFace,
} from "../../features/teacher/Attendance/teacherAttendanceSlice";
import securityIllustration from "../../assets/bannerGirl.png";

const imageToFile = async (image, name) => {
  const blob = await fetch(image).then((response) => response.blob());
  return new File([blob], name, { type: blob.type || "image/jpeg" });
};

const getErrorMessage = (error, fallback) =>
  typeof error === "object" ? error?.message || fallback : String(error || fallback);

const isAlreadyEnrolledError = (error) =>
  getErrorMessage(error, "").toLowerCase().includes("already enrolled");

export default function StaffPunchAttendance({ onAttendanceSaved }) {
  const dispatch = useDispatch();
  const { profileId, userId } = useSelector((state) => state.auth);
  const { todayAttendance, punchLoading, faceLoading } =
    useSelector((state) => state.teacherAttendance) || {};
  const webcamRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [showPunchOutModal, setShowPunchOutModal] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedPunchOutImage, setCapturedPunchOutImage] = useState(null);
  const [verificationStep, setVerificationStep] = useState("camera");
  const [punchOutStep, setPunchOutStep] = useState("camera");

  const isCurrentStaffAttendance =
    todayAttendance && String(todayAttendance.teacherId) === String(profileId);
  const hasPunchedIn = Boolean(isCurrentStaffAttendance && todayAttendance.punchIn);
  const hasPunchedOut = Boolean(isCurrentStaffAttendance && todayAttendance.punchOut);
  const isWorking = hasPunchedIn && !hasPunchedOut;
  const faceEnrollmentStorageKey = userId
    ? `teacher-face-enrolled-${userId}`
    : null;
  const [enrolledFaceUsers, setEnrolledFaceUsers] = useState({});
  const isFaceEnrolled = Boolean(
    faceEnrollmentStorageKey &&
      (enrolledFaceUsers[String(userId)] ||
        localStorage.getItem(faceEnrollmentStorageKey)),
  );

  const markFaceEnrolled = () => {
    localStorage.setItem(faceEnrollmentStorageKey, "true");
    setEnrolledFaceUsers((users) => ({
      ...users,
      [String(userId)]: true,
    }));
  };

  useEffect(() => {
    if (profileId) dispatch(fetchTeacherAttendance({ teacherId: profileId }));
  }, [dispatch, profileId]);

  useEffect(() => {
    if (!isWorking) return undefined;
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [isWorking]);

  const formatTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  };

  const workingHours = isWorking
    ? (() => {
        const seconds = Math.max(
          0,
          Math.floor((currentTime - new Date(todayAttendance.punchIn).getTime()) / 1000),
        );
        return `${String(Math.floor(seconds / 3600)).padStart(2, "0")}:${String(
          Math.floor((seconds % 3600) / 60),
        ).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
      })()
    : null;

  const resetPunchIn = () => {
    setShowPunchModal(false);
    setCapturedImage(null);
    setVerificationStep("camera");
  };

  const resetPunchOut = () => {
    setShowPunchOutModal(false);
    setCapturedPunchOutImage(null);
    setPunchOutStep("camera");
  };

  const beginPunch = (punchOut = false) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
        if (punchOut) {
          setPunchOutStep("camera");
          setShowPunchOutModal(true);
        } else {
          setVerificationStep("camera");
          setShowPunchModal(true);
        }
      },
      (error) => {
        setLoadingLocation(false);
        if (error.code === 1) {
          toast.error("Location permission denied. Please allow location access and try again.");
        } else if (error.code === 2) {
          toast.error("Location unavailable. Please try again.");
        } else if (error.code === 3) {
          toast.error("Location request timed out. Please try again.");
        } else {
          toast.error("Unable to retrieve location. Please try again.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleCameraError = () => {
    toast.error("Camera is unavailable or permission was denied. Please allow camera access and try again.");
  };

  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    if (!image) {
      toast.error("Unable to capture image. Please check camera permissions.");
      return;
    }
    setCapturedImage(image);
    setVerificationStep("preview");
  };

  const capturePunchOut = () => {
    const image = webcamRef.current?.getScreenshot();
    if (!image) {
      toast.error("Unable to capture image. Please check camera permissions.");
      return;
    }
    setCapturedPunchOutImage(image);
    setPunchOutStep("preview");
  };

  const verifyFace = async () => {
    if (!capturedImage || !userId) return;
    setVerificationStep("verifying");
    try {
      const file = await imageToFile(capturedImage, "punch-in.jpg");
      if (!isFaceEnrolled) {
        await dispatch(enrollTeacherFace({ userId, file })).unwrap();
        markFaceEnrolled();
        toast.success("Face enrolled successfully");
        setVerificationStep("enrollSuccess");
        return;
      }

      const verified = await dispatch(verifyTeacherFace({ userId, file })).unwrap();
      if (verified !== true) {
        setVerificationStep("preview");
        toast.error("Face verification failed. Please try again.");
        return;
      }
      setVerificationStep("identitySuccess");
    } catch (error) {
      if (!isFaceEnrolled && isAlreadyEnrolledError(error)) {
        markFaceEnrolled();
        setVerificationStep("preview");
        toast.info("Face already enrolled. Please verify your face to continue.");
        return;
      }

      setVerificationStep("preview");
      toast.error(getErrorMessage(error, isFaceEnrolled ? "Face verification failed. Please try again." : "Face enrolment failed. Please try again."));
    }
  };

  const verifyPunchOut = async () => {
    if (!capturedPunchOutImage || !userId) return;
    setPunchOutStep("verifying");
    try {
      const file = await imageToFile(capturedPunchOutImage, "punch-out.jpg");
      const verified = await dispatch(verifyTeacherFace({ userId, file })).unwrap();
      if (verified !== true) {
        setPunchOutStep("preview");
        toast.error("Face verification failed. Please try again.");
        return;
      }
      setPunchOutStep("success");
    } catch (error) {
      setPunchOutStep("preview");
      toast.error(getErrorMessage(error, "Face verification failed. Please try again."));
    }
  };

  const saveAttendance = async () => {
    try {
      await dispatch(
        punchInTeacher({
          teacherId: Number(profileId),
          date: new Date().toISOString().split("T")[0],
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      ).unwrap();
      resetPunchIn();
      toast.success("Punch-In recorded successfully");
      dispatch(fetchTeacherAttendance({ teacherId: profileId }));
      onAttendanceSaved?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Punch-In failed. Please try again."));
    }
  };

  const savePunchOut = async () => {
    try {
      await dispatch(
        punchOutTeacher({
          teacherId: Number(profileId),
          date: new Date().toISOString().split("T")[0],
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      ).unwrap();
      resetPunchOut();
      toast.success("Punch-Out recorded successfully");
      dispatch(fetchTeacherAttendance({ teacherId: profileId }));
      onAttendanceSaved?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Punch-Out failed. Please try again."));
    }
  };

  return (
    <>
      <div className="xl:absolute xl:right-0 xl:top-0 xl:w-1/3">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-[16px] font-semibold text-gray-800">Punch-In / Punch-Out</h3>
          </div>
          <div className="px-4 py-4 flex flex-col items-center">
            <img src={securityIllustration} alt="Punch" className="w-64 h-auto object-contain mb-5" />
            <p className="text-[#18B53C] text-[16px] font-semibold text-center leading-7 mb-6">
              Punctuality is the virtue of the board.
            </p>
            {isWorking && (
              <div className="w-full mb-4 text-center text-sm text-gray-600 space-y-1">
                <p>Punch In: {formatTime(todayAttendance.punchIn)}</p>
                <p>Working Hours: {workingHours}</p>
              </div>
            )}
            {hasPunchedOut && (
              <div className="w-full mb-4 text-center text-sm text-gray-600 space-y-1">
                <p>Punch In: {formatTime(todayAttendance.punchIn)}</p>
                <p>Punch Out: {formatTime(todayAttendance.punchOut)}</p>
                <p>Working Hours: {todayAttendance.productionHours || "-"}</p>
                <p>Status: {todayAttendance.status || "-"}</p>
              </div>
            )}
            <button
              onClick={() => beginPunch(isWorking)}
              disabled={punchLoading || loadingLocation}
              className={`w-full h-12 rounded-md text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed ${isWorking ? "bg-red-600" : "bg-[#4F46E5]"}`}
            >
              {loadingLocation ? "Getting Location..." : isWorking ? "Punch Out" : "Punch In"}
            </button>
          </div>
        </div>
      </div>

      {showPunchModal && verificationStep === "camera" && (
        <CameraModal title={isFaceEnrolled ? "Punch-In Verify" : "Punch-In Enroll"} isFaceEnrolled={isFaceEnrolled} onClose={resetPunchIn} webcamRef={webcamRef} onCapture={capture} onCameraError={handleCameraError} />
      )}
      {showPunchModal && verificationStep === "preview" && (
        <PreviewModal title="Face Enrollment" image={capturedImage} isFaceEnrolled={isFaceEnrolled} onClose={resetPunchIn} onRetake={() => setVerificationStep("camera")} onVerify={verifyFace} loading={faceLoading} />
      )}
      {showPunchModal && verificationStep === "verifying" && (
        <LoadingModal title="Punch-In Capture" />
      )}
      {showPunchModal && verificationStep === "enrollSuccess" && (
        <SuccessModal title="Punch-In Enroll" message="Enrollment Successful" onClose={resetPunchIn} />
      )}
      {showPunchModal && verificationStep === "identitySuccess" && (
        <SuccessModal title="Punch-In" message="Punch-In Successful" onClose={saveAttendance} loading={punchLoading} />
      )}
      {showPunchOutModal && punchOutStep === "camera" && (
        <CameraModal title="Punch-Out Verify" isFaceEnrolled onClose={resetPunchOut} webcamRef={webcamRef} onCapture={capturePunchOut} onCameraError={handleCameraError} />
      )}
      {showPunchOutModal && punchOutStep === "preview" && (
        <PreviewModal title="Punch-Out Verify" image={capturedPunchOutImage} isFaceEnrolled onClose={resetPunchOut} onRetake={() => setPunchOutStep("camera")} onVerify={verifyPunchOut} loading={faceLoading} />
      )}
      {showPunchOutModal && punchOutStep === "verifying" && <LoadingModal title="Punch-Out Verify" />}
      {showPunchOutModal && punchOutStep === "success" && (
        <SuccessModal title="Punch-Out" message="Punch-Out Successful" onClose={savePunchOut} loading={punchLoading} />
      )}
    </>
  );
}

function CameraModal({ title, isFaceEnrolled = false, onClose, webcamRef, onCapture, onCameraError }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg overflow-hidden bg-white shadow-2xl">
        <div className="bg-[#4F46E5] px-4 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-white"><X size={20} /></button>
        </div>
        <div className="p-4">
          <h3 className="text-center text-[17px] font-semibold text-gray-800">{isFaceEnrolled ? "Face Verification" : "Face Enrollment"}</h3>
          <p className="text-center text-xs text-gray-500 mt-1">{isFaceEnrolled ? "Position your face to verify your identity" : "Position your face within the frame"}</p>
          <div className="mt-4 border-[4px] border-[#4F46E5] rounded-md overflow-hidden">
            <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ width: 420, height: 420, facingMode: "user" }} onUserMediaError={onCameraError} className="w-full" />
          </div>
          <div className="mt-5 space-y-3">
            <button onClick={onCapture} className="w-full h-11 rounded bg-[#4F46E5] text-white font-medium flex items-center justify-center gap-2"><Camera size={18} />Capture</button>
            <button onClick={onClose} className="w-full h-11 rounded border border-gray-300 bg-white text-gray-700 font-medium">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ title, image, isFaceEnrolled = false, onClose, onRetake, onVerify, loading }) {
  const verificationTitle = isFaceEnrolled ? "Face Verification" : title;
  const verificationHeading = isFaceEnrolled ? "Verify Your Enrolled Face" : "Face Enrollment";
  const verificationMessage = isFaceEnrolled
    ? "Your face is already enrolled. Verify your face to continue."
    : "Position your face within the frame";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-[#4F46E5] px-4 py-3 font-semibold text-white">
          <span>{verificationTitle}</span>
          <button onClick={onClose} aria-label="Close face preview"><X size={20} /></button>
        </div>
        <div className="p-4">
          {isFaceEnrolled && (
            <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-center text-xs font-medium text-green-700">
              Face enrolled successfully. You can verify your face now.
            </div>
          )}
          <h3 className="text-center text-[17px] font-semibold text-gray-800">{verificationHeading}</h3>
          <p className="mt-1 text-center text-xs text-gray-500">{verificationMessage}</p>
          <div className="mt-4 overflow-hidden rounded-md border-[4px] border-[#4F46E5]"><img src={image} alt="Captured face" className="w-full" /></div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button onClick={onRetake} disabled={loading} className="h-11 rounded border">Retake</button>
            <button onClick={onVerify} disabled={loading} className="h-11 rounded bg-[#4F46E5] text-white">{loading ? "Verifying..." : isFaceEnrolled ? "Verify Face" : "Enroll Face"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingModal({ title }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"><div className="bg-white rounded-lg shadow-xl w-[420px] p-8 flex flex-col items-center"><div className="w-16 h-16 border-[6px] border-gray-200 border-t-[#4F46E5] rounded-full animate-spin" /><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="text-gray-500 text-sm mt-2">Please wait while we verify your face.</p></div></div>;
}

function SuccessModal({ title, message, onClose, loading }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-md rounded-lg bg-white shadow-2xl p-8 flex flex-col items-center"><div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-green-600 flex items-center justify-center"><Check className="text-green-600" size={24} /></div></div><h2 className="text-3xl font-bold mt-6">{message}</h2><p className="text-gray-500 mt-2">Identity Verified</p><button onClick={onClose} disabled={loading} className="w-full h-11 mt-8 rounded bg-[#4F46E5] text-white font-semibold disabled:opacity-60">{loading ? "Saving..." : "Done"}</button></div></div>;
}
