import React, { useEffect,useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const StaffLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth >= 640);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 640px)");
    const syncSidebar = (event) => setIsOpen(event.matches);

    desktopQuery.addEventListener("change", syncSidebar);
    return () => desktopQuery.removeEventListener("change", syncSidebar);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff]">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Content */}
        <div className={`flex-1 h-[calc(100vh-64px)] overflow-y-auto p-4 sm:p-6 transition-all duration-300 ${
          isOpen ? "sm:ml-67" : "sm:ml-20"
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;
