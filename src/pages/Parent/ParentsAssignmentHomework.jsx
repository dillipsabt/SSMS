import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchParentStudentHomework,
  submitParentHomework,
} from "../../features/parent/Homework/parentHomeworkSlice";

export default function AssignmentHomework() {
  const dispatch = useDispatch();

  const selectedStudentId = useSelector(
    (state) => state.parentDashboard?.selectedStudentId,
  );

  const studentId =
    selectedStudentId || localStorage.getItem("selectedStudentId");

  const { homeworkList = [], loading } = useSelector(
    (state) => state.parentHomework,
  );

  const [openId, setOpenId] = useState(null);
  const [files, setFiles] = useState({});

  useEffect(() => {
    if (studentId) {
      dispatch(fetchParentStudentHomework(studentId));
    }
  }, [dispatch, studentId]);

  const handleFileChange = (e, id) => {
    setFiles({
      ...files,
      [id]: e.target.files[0],
    });
  };

  const handleSubmit = async (item) => {
    if (!studentId) {
      toast.error("Student not found");
      return;
    }

    if (!files[item.id]) {
      toast.warning("Please select file");
      return;
    }

    const dto = {
      studentId: Number(studentId),
      homeworkId: item.id,
      remarks: "Completed",
    };

    try {
      await dispatch(
        submitParentHomework({
          dto,
          files: [files[item.id]],
        }),
      ).unwrap();

      toast.success("Homework submitted successfully");
    } catch (error) {
      toast.error(error?.message || "Submission failed");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Assignment / Homework
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-4">Home / Assignment</p>

      <div className="bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="p-2 border-b border-gray-200">
          <h3 className="font-medium text-gray-700">Assignment</h3>
        </div>

        <div className="p-3">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : homeworkList?.length > 0 ? (
            homeworkList.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md mb-3 overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center px-2 py-3 bg-white hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 text-lg">📑</span>

                    <span className="text-sm font-medium">
                      {item.subject || item.subjectName || "Assignment"}
                    </span>
                  </div>

                  {openId === item.id ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>

                {openId === item.id && (
                  <div className="border-t border-gray-200 bg-white p-4">
                    <p className="font-semibold text-sm mb-3">
                      {item.date || item.createdAt}
                    </p>

                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                      {item.description ||
                        item.homeworkDescription ||
                        "No Description"}
                    </pre>

                    <div className="mt-5">
                      <h4 className="font-medium text-sm mb-2">Attachments</h4>

                      {item.attachments?.length > 0 ? (
                        item.attachments.map((file, index) => (
                          <div key={index}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-sm hover:underline"
                            >
                              Attachment {index + 1}
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No Attachments</p>
                      )}
                    </div>

                    <p className="text-green-600 text-sm mb-3 border-t border-gray-300 pt-3 mt-5">
                      Note: Once completed your homework upload here
                    </p>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Homework
                      </label>

                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, item.id)}
                        className="block w-full text-sm border border-gray-300 rounded px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => handleSubmit(item)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Submit ➤
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-4 text-gray-500">
              No homework available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
