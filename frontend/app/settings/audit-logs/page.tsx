"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/admin/audit-logs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load audit logs");
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
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Audit Logs</h1>
              <p className="text-slate-500 mt-2">View system activity and security events.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {error && <div className="p-4 bg-red-100 text-red-700">{error}</div>}
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-sm border-b">
                  <th className="py-4 px-6 font-semibold">Date & Time</th>
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-6 font-semibold">Action</th>
                  <th className="py-4 px-6 font-semibold">Resource</th>
                  <th className="py-4 px-6 font-semibold">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">Loading logs...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">No audit logs found.</td>
                  </tr>
                ) : (
                  logs.map((log: any, i) => (
                    <tr key={i} className="border-b hover:bg-slate-50 transition">
                      <td className="py-4 px-6 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-6 text-sm font-medium">{log.user?.name || log.userId || "System"}</td>
                      <td className="py-4 px-6 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{log.resource}</td>
                      <td className="py-4 px-6 text-sm text-gray-500">{log.ipAddress || "N/A"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
