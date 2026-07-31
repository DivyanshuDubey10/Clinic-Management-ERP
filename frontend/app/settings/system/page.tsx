"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getClinicSettings, createClinicSetting, updateClinicSetting } from "@/lib/admin";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    address: "",
    contactPhone: "",
    email: "",
    gstNumber: "",
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getClinicSettings();
      setSettings(data.data || []);
      if (data.data && data.data.length > 0) {
        // Pre-fill with the first branch for simplicity
        const first = data.data[0];
        setFormData({
          branchName: first.branchName || "",
          branchCode: first.branchCode || "",
          address: first.address || "",
          contactPhone: first.contactPhone || "",
          email: first.email || "",
          gstNumber: first.gstNumber || "",
        });
        setEditingId(first._id);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await updateClinicSetting(editingId, formData);
        setSuccess("Settings updated successfully.");
      } else {
        await createClinicSetting(formData);
        setSuccess("Settings created successfully.");
      }
      fetchSettings();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-2">Manage clinic branches and global configurations.</p>
          </div>

          <div className="bg-card rounded-xl shadow p-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Clinic Details</h2>
            
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

            {loading ? (
              <p>Loading settings...</p>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg p-2"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Branch Code</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg p-2"
                      value={formData.branchCode}
                      onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea
                    className="w-full border rounded-lg p-2"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded-lg p-2"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">GST Number</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-2"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
