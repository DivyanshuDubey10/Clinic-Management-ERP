"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  Users,
  Stethoscope,
  CalendarDays,
  IndianRupee,
  Activity,
  FlaskConical,
  Pill,
} from "lucide-react";
import { getDashboard } from "@/lib/dashboard";
import { getPerformanceReport } from "@/lib/reporting";
import { getInvoices } from "@/lib/billing";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, perfRes, invRes] = await Promise.all([
          getDashboard(),
          getPerformanceReport(),
          getInvoices({ limit: 5 })
        ]);
        setDashboardData(dashRes?.data?.statistics || dashRes?.statistics || dashRes?.data || dashRes);
        setPerformanceData(perfRes?.data || perfRes);
        setRecentInvoices(invRes?.data?.data || invRes?.data || invRes || []);
      } catch (error) {
        console.error("Failed to load report data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    {
      title: "Total Patients",
      value: dashboardData?.totalPatients || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Doctors",
      value: dashboardData?.totalDoctors || 0,
      icon: Stethoscope,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Appointments",
      value: dashboardData?.totalAppointments || 0,
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Revenue",
      value: `₹${performanceData?.financialOverview?.totalCollected?.toLocaleString() || "0"}`,
      icon: IndianRupee,
      color: "bg-yellow-100 text-yellow-700",
    },
  ];

  const totalAppts = dashboardData?.totalAppointments || 1;
  const appointmentStats = [
    { label: "Scheduled", value: dashboardData?.bookedAppointments || 0, color: "bg-blue-500" },
    { label: "Completed", value: dashboardData?.completedAppointments || 0, color: "bg-green-500" },
    { label: "Cancelled", value: dashboardData?.cancelledAppointments || 0, color: "bg-red-500" },
  ];

  const departmentStats = (performanceData?.doctorLeaderboard || []).slice(0, 5).map((doc: any) => ({
    name: doc.doctorName || "Unknown",
    patients: doc.consultations || 0,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-muted/30">
          <Navbar />
          <div className="flex items-center justify-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-muted/30 min-h-screen">
        <Navbar />

        <div className="p-6 space-y-8">

          <div>
            <h1 className="text-3xl font-bold">
              Reports & Analytics
            </h1>

            <p className="text-muted-foreground mt-1">
              Hospital performance overview
            </p>
          </div>

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {stats.map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="bg-card rounded-2xl shadow-sm p-6"
                >
                  <div className="flex justify-between">

                    <div>

                      <p className="text-muted-foreground">
                        {item.title}
                      </p>

                      <h2 className="text-4xl font-bold mt-3">
                        {item.value}
                      </h2>

                    </div>

                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${item.color}`}
                    >
                      <Icon size={30} />
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Appointment Analytics */}

          <div className="grid lg:grid-cols-2 gap-6">

            <div className="bg-card rounded-2xl p-6 shadow">

              <h2 className="text-xl font-semibold mb-6">
                Appointment Status
              </h2>

              <div className="space-y-5">

                {appointmentStats.map((item) => (

                  <div key={item.label}>

                    <div className="flex justify-between mb-2">

                      <span>{item.label}</span>

                      <span className="font-semibold">
                        {item.value}
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">

                      <div
                        className={`${item.color} h-3 rounded-full`}
                        style={{
                          width: `${Math.min((item.value / totalAppts) * 100, 100)}%`,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="bg-card rounded-2xl shadow p-6">

              <h2 className="text-xl font-semibold mb-6">
                Department Visits
              </h2>

              <div className="space-y-4">

                {departmentStats.map((dept: any) => (

                  <div
                    key={dept.name}
                    className="flex justify-between border-b pb-3"
                  >
                    <span>{dept.name}</span>

                    <span className="font-bold">
                      {dept.patients}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* Removed Summary Cards since real metrics are not yet available in the backend */}

          {/* Recent Invoices */}

          <div className="bg-card rounded-2xl shadow">

            <div className="p-6 border-b">

              <h2 className="text-xl font-semibold">
                Recent Invoices
              </h2>

            </div>

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-4 text-left">
                    Invoice
                  </th>

                  <th className="p-4 text-left">
                    Patient
                  </th>

                  <th className="p-4 text-left">
                    Amount
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentInvoices.slice(0, 5).map((invoice) => (

                  <tr
                    key={invoice.invoiceNumber || invoice._id}
                    className="border-b hover:bg-muted/50"
                  >

                    <td className="p-4">
                      {invoice.invoiceNumber || "-"}
                    </td>

                    <td className="p-4">
                      {invoice.patientId ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}` : "Unknown Patient"}
                    </td>

                    <td className="p-4">
                      ₹{invoice.billingDetails?.grandTotal?.toLocaleString() || "0"}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status || "Pending"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </div>
  );
}