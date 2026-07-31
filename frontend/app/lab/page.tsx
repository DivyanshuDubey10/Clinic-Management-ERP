"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Eye } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getLabOrders } from "@/lib/lab";

export default function LabOrdersPage() {
  const [labOrders, setLabOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadLabOrders();
  }, [search, status]);

  const loadLabOrders = async () => {
    try {
      setLoading(true);

      const res = await getLabOrders({
        search,
        status,
      });

      setLabOrders(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load lab orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">

          {/* Header */}

          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                Laboratory Orders
              </h1>

              <p className="text-muted-foreground mt-1">
                Manage patient laboratory investigations.
              </p>
            </div>

            <Link
              href="/lab/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              New Lab Order
            </Link>

          </div>

          {/* Search & Filter */}

          <div className="bg-card rounded-xl shadow p-5 mb-6 flex gap-4">

            <div className="relative flex-1">

              <Search
                className="absolute left-3 top-3 text-muted-foreground"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg px-4 py-3"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Sample Collected">
                Sample Collected
              </option>
              <option value="Processing">
                Processing
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Cancelled">
                Cancelled
              </option>
            </select>

          </div>

          {/* Table */}

          <div className="bg-card rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-800 text-white">

                <tr>
                  <th className="px-6 py-4 text-left">Order ID</th>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-left">Doctor</th>
                  <th className="px-6 py-4 text-left">Test</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Ordered</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>
                  </tr>

                ) : labOrders.length === 0 ? (

                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No Lab Orders Found
                    </td>
                  </tr>

                ) : (

                  labOrders.map((order: any) => (

                    <tr
                      key={order._id}
                      className="border-b hover:bg-muted/50"
                    >

                      <td className="px-6 py-4 font-medium">
                        {order._id.slice(-8)}
                      </td>

                      <td className="px-6 py-4">
                        {order.patientId?.firstName}{" "}
                        {order.patientId?.lastName}
                      </td>

                      <td className="px-6 py-4">
                        {order.doctorId?.name ||
                          `${order.doctorId?.firstName || ""} ${order.doctorId?.lastName || ""}`}
                      </td>

                      <td className="px-6 py-4">
                        {order.testName ||
                          order.testType ||
                          "-"}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium
                          ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Sample Collected"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-muted/30 text-slate-700"
                          }`}
                        >
                          {order.status}
                        </span>

                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-center">

                        <Link
                          href={`/lab/${order._id}`}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                      </td>

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