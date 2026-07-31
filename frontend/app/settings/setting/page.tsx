"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Save, User, Lock, Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    language: "English",
    timezone: "Asia/Kolkata",
    darkMode: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 max-w-5xl mx-auto w-full">

          <div className="flex items-center gap-3 mb-8">
            <Settings className="text-blue-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Manage your account preferences.
              </p>
            </div>
          </div>

          {/* Profile */}

          <div className="bg-card rounded-xl shadow p-6 mb-6">

            <div className="flex items-center gap-2 mb-5">
              <User className="text-blue-600" />
              <h2 className="text-xl font-semibold">
                Profile Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded-lg p-3"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded-lg p-3"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="border rounded-lg p-3"
              />

              <input
                value={form.role}
                readOnly
                className="border rounded-lg p-3 bg-gray-100"
              />

            </div>

          </div>

          {/* Password */}

          <div className="bg-card rounded-xl shadow p-6 mb-6">

            <div className="flex items-center gap-2 mb-5">
              <Lock className="text-red-500" />
              <h2 className="text-xl font-semibold">
                Change Password
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">

              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className="border rounded-lg p-3"
              />

              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className="border rounded-lg p-3"
              />

              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="border rounded-lg p-3"
              />

            </div>

          </div>

          {/* Preferences */}

          <div className="bg-card rounded-xl shadow p-6 mb-6">

            <h2 className="text-xl font-semibold mb-5">
              Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option>English</option>
                <option>Hindi</option>
              </select>

              <select
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                className="border rounded-lg p-3"
              >
                <option>Asia/Kolkata</option>
                <option>UTC</option>
              </select>

            </div>

            <div className="mt-5 flex items-center gap-3">

              <input
                type="checkbox"
                name="darkMode"
                checked={form.darkMode}
                onChange={handleChange}
              />

              <span>Enable Dark Mode</span>

            </div>

          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            <Save size={18} />
            Save Settings
          </button>

        </main>
      </div>
    </div>
  );
}