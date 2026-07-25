import React, { useState } from "react";
import {
  BookOpen,
  Clock3,
  Play,
  CalendarDays,
  User,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

/* Images */
import sanskrit from "../../assets/video-library/sanskrit.png";
import telugu from "../../assets/video-library/telugu.png";
import hindi from "../../assets/video-library/hindi.png";
import english from "../../assets/video-library/english.png";
import mathematics from "../../assets/video-library/mathematics.png";
import physics from "../../assets/video-library/physics.png";
import biology from "../../assets/video-library/biology.png";
import social from "../../assets/video-library/social.png";

const videoClasses = [
  {
    id: 1,
    title: "Telugu",
    category: "REGIONAL LANGUAGE",
    lessons: 18,
    image: telugu,
  },
  {
    id: 2,
    title: "Hindi",
    category: "NATIONAL LANGUAGE",
    lessons: 22,
    image: hindi,
  },
  {
    id: 3,
    title: "English",
    category: "GRAMMAR & LITERATURE",
    lessons: 30,
    image: english,
  },
  {
    id: 4,
    title: "Mathematics",
    category: "LOGIC & ARITHMETIC",
    lessons: 45,
    image: mathematics,
  },
  {
    id: 5,
    title: "Physics",
    category: "PHYSICAL SCIENCES",
    lessons: 24,
    image: physics,
  },
  {
    id: 6,
    title: "Biology",
    category: "NATURAL SCIENCES",
    lessons: 26,
    image: biology,
  },
  {
    id: 7,
    title: "Social Studies",
    category: "HISTORY & CIVICS",
    lessons: 32,
    image: social,
  },
  {
    id: 8,
    title: "Sanskrit",
    category: "CLASSICAL LANGUAGE",
    lessons: 15,
    image: sanskrit,
  },
];

const lessonList = [
  {
    id: 1,
    title: "1.1 Introduction",
    duration: "15 mins",
  },
  {
    id: 2,
    title: "1.2 Inertia",
    duration: "12 mins",
  },
  {
    id: 3,
    title: "1.3 Force & Momentum",
    duration: "20 mins",
    active: true,
  },
  {
    id: 4,
    title: "1.4 Newton Laws",
    duration: "18 mins",
  },
  {
    id: 5,
    title: "1.5 Applications",
    duration: "16 mins",
  },
];

const chapters = [
  "Chapter 01",
  "Chapter 02",
  "Chapter 03",
  "Chapter 04",
  "Chapter 05",
  "Chapter 06",
  "Chapter 07",
  "Chapter 08",
];

export default function VideoLibrary() {
  const navigate = useNavigate();
  const { subject } = useParams();

  const [openChapter, setOpenChapter] = useState(0);

  const selectedVideo = videoClasses.find(
    (video) => video.title.toLowerCase() === (subject || "").toLowerCase(),
  );

  if (!subject) {
    return (
      <div className="min-h-screen bg-white p-2">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">Video Library</h1>

          <p className="text-sm text-gray-500">Home / LMS / Video Library</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {videoClasses.map((video) => (
            <div
              key={video.id}
              className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              <img
                src={video.image}
                alt={video.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold">
                  <BookOpen size={14} />

                  {video.category}
                </div>

                <h2 className="text-xl font-bold mt-2">{video.title}</h2>

                <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                  <Clock3 size={15} />
                  {video.lessons} Videos Available
                </div>

                <button
                  onClick={() =>
                    navigate(`/video-library/${video.title.toLowerCase()}`)
                  }
                  className="mt-5 w-full bg-indigo-600 text-white h-10 rounded-md hover:bg-indigo-700"
                >
                  View All Lessons
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Video Not Found
      </div>
    );
  }

  // ===== PLAYER PAGE STARTS HERE =====

  return (
    <div className="min-h-screen bg-white p-4 md:p-5">
      {/* HEADER */}

      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={() => navigate("/video-library")}
          className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[28px] font-bold">{selectedVideo.title}</h1>

          <p className="text-[13px] text-[#666]">
            Home / LMS / {selectedVideo.title}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT */}

        <div className="xl:col-span-8">
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            {/* IMAGE */}

            <div className="relative">
              <img
                src={selectedVideo.image}
                alt={selectedVideo.title}
                className="w-full h-[260px] md:h-[420px] object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center">
                  <Play fill="#5A42F3" color="#5A42F3" size={34} />
                </button>
              </div>
            </div>

            {/* CONTENT */}

            <div className="p-6">
              <span className="inline-block bg-[#EEF2FF] text-[#5A42F3] text-xs font-semibold px-3 py-1 rounded-full">
                {selectedVideo.category}
              </span>

              <h2 className="mt-4 text-3xl font-bold">
                3.3 Force and Momentum
              </h2>

              <div className="flex flex-wrap gap-6 mt-5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  October 24, 2023
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={18} />
                  90 Minutes
                </div>

                <div className="flex items-center gap-2">
                  <User size={18} />
                  Rama Krishna
                </div>
              </div>

              <p className="mt-6 text-gray-600 leading-8">
                In this lesson we explain the concepts using practical examples
                and demonstrations for better understanding.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="xl:col-span-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="border-b border-gray-300 px-5 py-4">
              <h3 className="text-lg font-semibold">Course Contents</h3>
            </div>

            <div className="max-h-[720px] overflow-y-auto">
              {chapters.map((chapter, index) => (
                <div key={index} className="border-b border-gray-300">
                  <button
                    onClick={() => setOpenChapter(index)}
                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <span className="font-medium">{chapter}</span>

                    {openChapter === index ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {openChapter === index && (
                    <div className="pb-3">
                      {lessonList.map((lesson) => (
                        <div
                          key={lesson.id}
                          className={`flex justify-between items-center px-8 py-3 cursor-pointer transition ${
                            lesson.active
                              ? "bg-[#EEF2FF] text-[#5A42F3]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Play
                              size={14}
                              fill={lesson.active ? "#5A42F3" : "transparent"}
                            />

                            <span>{lesson.title}</span>
                          </div>

                          <span className="text-xs">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
