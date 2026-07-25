import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Main Content */}
        <div className={`flex-1 h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 transition-all duration-300 ${
          isOpen ? "lg:ml-67" : "lg:ml-20"
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
