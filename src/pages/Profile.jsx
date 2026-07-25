import React, { useState } from "react";
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Mr. Herald",
    email: "herald@school.com",
    phone: "+1 (555) 123-4567",
    designation: "Admin",
    joinDate: "January 15, 2020",
    address: "123 Education Street, School City, SC 12345",
    department: "Administration",
    avatar: "👨‍💼",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setTempProfile(profile);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempProfile(profile);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({
      ...tempProfile,
      [name]: value,
    });
  };

  return (
    <MainLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {isEditing ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={tempProfile.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={tempProfile.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={tempProfile.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={tempProfile.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={tempProfile.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-gray-800 font-medium">{profile.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="text-gray-800 font-medium">{profile.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin size={20} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-gray-800 font-medium">{profile.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar size={20} className="text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Join Date</p>
                      <p className="text-gray-800 font-medium">{profile.joinDate}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="text-blue-700 font-semibold">{profile.designation}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-purple-700 font-semibold">{profile.department}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Avatar Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-fit">
            <div className="text-center">
              <div className="text-6xl mb-4">{profile.avatar}</div>
              <h3 className="text-lg font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{profile.designation}</p>
              <p className="text-xs text-gray-500 mt-3">{profile.department}</p>

              <button className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
                <Camera size={18} />
                Change Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r">
              <div>
                <p className="text-sm font-medium text-gray-800">Profile updated</p>
                <p className="text-xs text-gray-500">You updated your profile information</p>
              </div>
              <span className="text-xs text-gray-500">Today</span>
            </div>

            <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50 rounded-r">
              <div>
                <p className="text-sm font-medium text-gray-800">Password changed</p>
                <p className="text-xs text-gray-500">You changed your account password</p>
              </div>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>

            <div className="flex items-center justify-between p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r">
              <div>
                <p className="text-sm font-medium text-gray-800">Login from new device</p>
                <p className="text-xs text-gray-500">You logged in from a new device</p>
              </div>
              <span className="text-xs text-gray-500">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
