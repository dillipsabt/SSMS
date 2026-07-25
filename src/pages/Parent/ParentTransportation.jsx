import React from "react";
import { Phone } from "lucide-react";

export default function TransportationDetails() {
    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <h3 className="text-2xl font-bold text-gray-800">
                Transportation Details
            </h3>
            <p className="text-gray-500 mt-2">Home / Transportation Details</p>

            {/* Main Card */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-700">
                    Transportation Details
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                    {/* Left Section */}
                    <div className="space-y-4">
                        {/* Driver Details */}
                        <div className="border border-gray-200 rounded-lg">
                            <div className="border-b border-gray-200 px-4 py-3 font-medium">
                                Driver Details
                            </div>

                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                        alt="driver"
                                        className="w-14 h-14 rounded-full border-2 border-blue-500"
                                    />

                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            M Nagendra Reddy
                                        </h3>
                                        <p className="text-gray-500">45Y/Male</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Phone size={18} />
                                        <span>+91 9876543210</span>
                                    </div>

                                    <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded">
                                        Call Driver
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Info */}
                        <div className="border border-gray-200 rounded-lg">
                            <div className="border-b border-gray-200 px-4 py-3 font-medium">
                                Vehicle Info
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vehicle No.</span>
                                    <span>TS03 AZ 1234</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bus No.</span>
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                                        B001
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pickup Drop */}
                        <div className="border border-gray-200 rounded-lg">
                            <div className="border-b border-gray-200 px-4 py-3 font-medium">
                                Pickup & Drop Details
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pickup Stop</span>
                                    <span>Blue Bell Plaza</span>
                                </div>

                                <div className="flex justify-between border-b border-gray-200 pb-4">
                                    <span className="text-gray-600">Pickup Time</span>
                                    <span>07:00 AM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Drop Stop</span>
                                    <span>Blue Bell Plaza</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Drop Time</span>
                                    <span>06:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="lg:col-span-2 border border-gray-200 rounded-lg">
                        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                            <span className="font-medium">Live Track</span>

                            <span className="text-xs bg-gray-100 px-3 py-1 rounded">
                                ON ROUTE
                            </span>
                        </div>

                        <div className="p-3">
                            <iframe
                                title="map"
                                src="https://maps.google.com/maps?q=17.3850,78.4867&z=15&output=embed"
                                className="w-full h-[500px] rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}