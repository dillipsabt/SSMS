import React, { useState } from "react";
import { Wifi, WifiOff, RefreshCw, Info } from "lucide-react";

const BiometricAttendance = () => {
  const [deviceStatus, setDeviceStatus] = useState("connected");
  const [activeTab, setActiveTab] = useState("punch-in");

  const deviceData = {
    deviceId: "BIO-001",
    deviceName: "Biometric Device - Main Entrance",
    location: "Main Gate",
    model: "ZKTeco F22",
    connectionStatus: "Connected",
    lastSync: "2024-01-10 10:30 AM",
    status: "Active",
  };

  const handleRefreshDeviceStatus = () => {
    // Placeholder for API call to refresh device status
    console.log("Refreshing device status...");
  };

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-[#333333]">Biometric Attendance</h2>
      <p className="text-[11px] sm:text-[12px] text-gray-500 mb-4">
        Teacher / Attendance
      </p>

      {/* Device Status Section */}
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">Device Status</h3>
          <button
            onClick={handleRefreshDeviceStatus}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition"
            title="Refresh Device Status"
          >
            <RefreshCw size={16} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Device ID */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Device ID</p>
            <p className="text-sm font-semibold text-gray-800">{deviceData.deviceId}</p>
          </div>

          {/* Device Name */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Device Name</p>
            <p className="text-sm font-semibold text-gray-800">{deviceData.deviceName}</p>
          </div>

          {/* Location */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Location</p>
            <p className="text-sm font-semibold text-gray-800">{deviceData.location}</p>
          </div>

          {/* Model */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Model</p>
            <p className="text-sm font-semibold text-gray-800">{deviceData.model}</p>
          </div>

          {/* Connection Status */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Connection Status</p>
            <div className="flex items-center gap-2">
              {deviceData.connectionStatus === "Connected" ? (
                <>
                  <Wifi size={16} className="text-green-600" />
                  <p className="text-sm font-semibold text-green-600">
                    {deviceData.connectionStatus}
                  </p>
                </>
              ) : (
                <>
                  <WifiOff size={16} className="text-red-600" />
                  <p className="text-sm font-semibold text-red-600">
                    {deviceData.connectionStatus}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Last Sync */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Last Sync</p>
            <p className="text-sm font-semibold text-gray-800">{deviceData.lastSync}</p>
          </div>

          {/* Status */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Status</p>
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-semibold">
              {deviceData.status}
            </span>
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
          <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Device is connected and ready for attendance. Employees can use the biometric scanner for punch-in and punch-out.
          </p>
        </div>
      </div>

      {/* Biometric Instructions Section */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="card-section flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("punch-in")}
            className={`px-4 py-2 font-medium text-sm transition ${
              activeTab === "punch-in"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Punch-In
          </button>
          <button
            onClick={() => setActiveTab("punch-out")}
            className={`px-4 py-2 font-medium text-sm transition ${
              activeTab === "punch-out"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Punch-Out
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "punch-in" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Punch-In</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Step-1</p>
                    <div className="bg-gray-100 rounded-lg p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-32 bg-gray-300 rounded-lg mx-auto mb-3 flex items-end justify-center overflow-hidden">
                          {/* Biometric Device Illustration */}
                          <div className="w-20 h-24 bg-gray-400 rounded-t-lg border-2 border-gray-500 flex flex-col items-center justify-center">
                            <div className="w-16 h-14 bg-white rounded mb-1"></div>
                            <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Approach device</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Stand in front of the biometric device
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Step-2</p>
                    <div className="bg-gray-100 rounded-lg p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-32 bg-gray-300 rounded-lg mx-auto mb-3 flex items-end justify-center overflow-hidden">
                          {/* Biometric Device with Success */}
                          <div className="w-20 h-24 bg-gray-400 rounded-t-lg border-2 border-gray-500 flex flex-col items-center justify-center">
                            <div className="w-16 h-14 bg-white rounded mb-1 flex items-center justify-center">
                              <span className="text-green-600 font-bold text-xs">✓</span>
                            </div>
                            <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
                            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 font-semibold">Emp - 001</p>
                        <p className="text-xs text-green-600">Punch-In Successfully</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Place your finger on scanner
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "punch-out" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Punch-Out</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Step-1</p>
                    <div className="bg-gray-100 rounded-lg p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-32 bg-gray-300 rounded-lg mx-auto mb-3 flex items-end justify-center overflow-hidden">
                          {/* Biometric Device Illustration */}
                          <div className="w-20 h-24 bg-gray-400 rounded-t-lg border-2 border-gray-500 flex flex-col items-center justify-center">
                            <div className="w-16 h-14 bg-white rounded mb-1"></div>
                            <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
                            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">Approach device</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Stand in front of the biometric device
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Step-2</p>
                    <div className="bg-gray-100 rounded-lg p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-32 bg-gray-300 rounded-lg mx-auto mb-3 flex items-end justify-center overflow-hidden">
                          {/* Biometric Device with Success */}
                          <div className="w-20 h-24 bg-gray-400 rounded-t-lg border-2 border-gray-500 flex flex-col items-center justify-center">
                            <div className="w-16 h-14 bg-white rounded mb-1 flex items-center justify-center">
                              <span className="text-green-600 font-bold text-xs">✓</span>
                            </div>
                            <div className="w-4 h-4 bg-green-500 rounded-full mb-1"></div>
                            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs text-green-600 font-semibold">Emp - 001</p>
                        <p className="text-xs text-green-600">Punch-Out Successfully</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Place your finger on scanner
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricAttendance;
