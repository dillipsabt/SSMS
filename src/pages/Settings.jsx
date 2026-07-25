import React, { useState } from "react";
import { Bell, Lock, Eye, EyeOff, Save, X, Check, AlertCircle } from "lucide-react";
import MainLayout from "../layout/MainLayout";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [accountSettings, setAccountSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    attendanceAlerts: true,
    examReminders: true,
    feesNotifications: true,
    announcements: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: true,
    showPhone: false,
    dataCollection: true,
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: "light",
    compactMode: false,
    autoLogout: true,
    autoLogoutTime: 30,
  });

  const handlePasswordChange = (e) => {
    setSaveSuccess(false);
    const { name, value } = e.target;
    setAccountSettings({
      ...accountSettings,
      [name]: value,
    });
  };

  const handleSavePassword = () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (accountSettings.newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setAccountSettings({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationChange = (key) => {
    setSaveSuccess(false);
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
  };

  const handleSaveNotifications = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrivacyChange = (key, value) => {
    setSaveSuccess(false);
    setPrivacySettings({
      ...privacySettings,
      [key]: value,
    });
  };

  const handleSavePrivacy = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleThemeChange = (key, value) => {
    setSaveSuccess(false);
    setThemeSettings({
      ...themeSettings,
      [key]: value,
    });
  };

  const handleSaveTheme = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <MainLayout>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <Check size={20} className="text-green-600" />
            <p className="text-green-700 font-medium">Settings saved successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 h-fit">
            <div className="space-y-2">
              {[
                { id: "account", label: "Account", icon: "🔐" },
                { id: "notifications", label: "Notifications", icon: "🔔" },
                { id: "privacy", label: "Privacy", icon: "🔒" },
                { id: "theme", label: "Theme", icon: "🎨" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSaveSuccess(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={accountSettings.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Enter your current password"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={accountSettings.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Enter new password (min. 8 characters)"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={accountSettings.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Confirm new password"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSavePassword}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      <Lock size={18} />
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Password Tips:</strong> Use a combination of uppercase, lowercase, numbers, and special characters for better security.
                  </p>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>

                <div className="space-y-4 mb-6">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "pushNotifications", label: "Push Notifications", desc: "Receive browser notifications" },
                    { key: "smsNotifications", label: "SMS Notifications", desc: "Receive updates via SMS" },
                    { key: "attendanceAlerts", label: "Attendance Alerts", desc: "Get notified about attendance issues" },
                    { key: "examReminders", label: "Exam Reminders", desc: "Receive exam schedule reminders" },
                    { key: "feesNotifications", label: "Fees Notifications", desc: "Get notified about fee payments" },
                    { key: "announcements", label: "Announcements", desc: "Receive school announcements" },
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <div>
                        <p className="font-medium text-gray-800">{setting.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{setting.desc}</p>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[setting.key]}
                          onChange={() => handleNotificationChange(setting.key)}
                          className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                        />
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Privacy Settings</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Profile Visibility</label>
                    <div className="space-y-2">
                      {[
                        { value: "public", label: "Public - Everyone can view your profile" },
                        { value: "private", label: "Private - Only you can view your profile" },
                        { value: "restricted", label: "Restricted - School members only" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option.value}
                            checked={privacySettings.profileVisibility === option.value}
                            onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <p className="font-medium text-gray-800 mb-3">Share Information</p>
                    <div className="space-y-2">
                      {[
                        { key: "showEmail", label: "Show email address" },
                        { key: "showPhone", label: "Show phone number" },
                        { key: "dataCollection", label: "Allow data collection for analytics" },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <span className="text-gray-700">{setting.label}</span>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={privacySettings[setting.key]}
                              onChange={(e) => handlePrivacyChange(setting.key, e.target.checked)}
                              className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSavePrivacy}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  <Save size={18} />
                  Save Privacy Settings
                </button>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === "theme" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Theme & Display</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                    <div className="space-y-2">
                      {[
                        { value: "light", label: "Light Theme", icon: "☀️" },
                        { value: "dark", label: "Dark Theme", icon: "🌙" },
                        { value: "auto", label: "Auto (System preference)", icon: "⚙️" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="theme"
                            value={option.value}
                            checked={themeSettings.theme === option.value}
                            onChange={(e) => handleThemeChange("theme", e.target.value)}
                            className="w-4 h-4 cursor-pointer"
                          />
                          <span className="text-2xl mr-2">{option.icon}</span>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <label className="text-gray-700 font-medium cursor-pointer">Compact Mode</label>
                      <input
                        type="checkbox"
                        checked={themeSettings.compactMode}
                        onChange={(e) => handleThemeChange("compactMode", e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <label className="text-gray-700 font-medium">Auto Logout</label>
                      <input
                        type="checkbox"
                        checked={themeSettings.autoLogout}
                        onChange={(e) => handleThemeChange("autoLogout", e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                    </div>

                    {themeSettings.autoLogout && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Auto Logout Time (minutes)</label>
                        <input
                          type="number"
                          min="5"
                          max="120"
                          value={themeSettings.autoLogoutTime}
                          onChange={(e) => handleThemeChange("autoLogoutTime", parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSaveTheme}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  <Save size={18} />
                  Save Theme Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
