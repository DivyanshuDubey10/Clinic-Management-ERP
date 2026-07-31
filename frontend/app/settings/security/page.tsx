"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { updateProfile } from "@/lib/auth";

export default function SecuritySettingsPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ password });
      setSuccess("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Security</h1>
            <p className="text-slate-500 mt-2">Update your account password and security settings.</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 max-w-lg">
            <h2 className="text-xl font-semibold mb-6">Change Password</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full border rounded-lg p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="w-full border rounded-lg p-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
