import React from "react";
import { Clock3, CalendarDays, BookOpen, User, Play } from "lucide-react";
import recordedVideo from "../../assets/recordedVideo.png"; // change path if needed

export default function RecordedSession() {
  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
        Recorded Session
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 mb-6">
        Home / LMS / Virtual Class List
      </p>

      {/* Banner */}
      <div className="relative rounded overflow-hidden">
        <img
          src={recordedVideo}
          alt="Recorded Session"
          className="w-full h-[220px] sm:h-[320px] md:h-[300px] object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm">
            <Play fill="white" size={50} className="text-white ml-1" />
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-4 left-4">
          <h2 className="text-white text-2xl md:text-2xl font-semibold">
            Advanced Quantum Mechanics
          </h2>
        </div>
      </div>

      {/* Topic + Duration */}
      <div className="mt-5 flex flex-col md:flex-row md:justify-between gap-3">
        <h3 className="text-lg sm:text-sm font-semibold text-gray-800">
          Topic: Wave-Particle Duality and Uncertainty
        </h3>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock3 size={18} />
          <span>Duration: 90 Minutes</span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-4 text-gray-700 text-sm">
        <div className="flex items-center gap-3">
          <CalendarDays size={18} />
          <span>Date: October 24, 2023</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <BookOpen size={18} />
          <span>PHYSICS • 10-A</span>
        </div>

        <div className="flex items-center gap-3 text-indigo-600 text-sm">
          <User size={18} />
          <span>Rama Krishna</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 text-xs">
        <h3 className="text-sm font-semibold mb-3 text-gray-800">
          Description
        </h3>

        <p className="text-gray-600 leading-7 text-sm sm:text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore.
        </p>
      </div>
    </div>
  );
}
