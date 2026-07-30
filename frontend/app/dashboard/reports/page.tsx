"use client";

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

const stats = [
  {
    title: "Total Patients",
    value: 1254,
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Doctors",
    value: 42,
    icon: Stethoscope,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Appointments",
    value: 893,
    icon: CalendarDays,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Revenue",
    value: "₹8,45,600",
    icon: IndianRupee,
    color: "bg-yellow-100 text-yellow-700",
  },
];

const appointmentStats = [
  { label: "Scheduled", value: 245, color: "bg-blue-500" },
  { label: "Completed", value: 560, color: "bg-green-500" },
  { label: "Cancelled", value: 88, color: "bg-red-500" },
];

const departmentStats = [
  {
    name: "General Medicine",
    patients: 320,
  },
  {
    name: "Cardiology",
    patients: 140,
  },
  {
    name: "Orthopedics",
    patients: 118,
  },
  {
    name: "Neurology",
    patients: 76,
  },
  {
    name: "Pediatrics",
    patients: 210,
  },
];

const invoices = [
  {
    invoice: "INV-1001",
    patient: "Rahul Sharma",
    amount: "₹1,500",
    status: "Paid",
  },
  {
    invoice: "INV-1002",
    patient: "Aman Das",
    amount: "₹800",
    status: "Pending",
  },
  {
    invoice: "INV-1003",
    patient: "Priya Singh",
    amount: "₹2,200",
    status: "Paid",
  },
  {
    invoice: "INV-1004",
    patient: "John Mathew",
    amount: "₹1,250",
    status: "Pending",
  },
];

export default function ReportsPage() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Navbar />

        <div className="p-6 space-y-8">

          <div>
            <h1 className="text-3xl font-bold">
              Reports & Analytics
            </h1>

            <p className="text-gray-500 mt-1">
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
                  className="bg-white rounded-2xl shadow-sm p-6"
                >
                  <div className="flex justify-between">

                    <div>

                      <p className="text-gray-500">
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

            <div className="bg-white rounded-2xl p-6 shadow">

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
                          width: `${item.value / 6}%`,
                        }}
                      />

                    </div>

                  </div>

                ))}

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-xl font-semibold mb-6">
                Department Visits
              </h2>

              <div className="space-y-4">

                {departmentStats.map((dept) => (

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

          {/* Summary Cards */}

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white rounded-xl shadow p-6">

              <Activity
                className="text-green-600 mb-4"
                size={36}
              />

              <h3 className="text-lg font-semibold">
                Lab Tests
              </h3>

              <p className="text-4xl font-bold mt-3">
                382
              </p>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

              <FlaskConical
                className="text-blue-600 mb-4"
                size={36}
              />

              <h3 className="text-lg font-semibold">
                Pending Reports
              </h3>

              <p className="text-4xl font-bold mt-3">
                29
              </p>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

              <Pill
                className="text-purple-600 mb-4"
                size={36}
              />

              <h3 className="text-lg font-semibold">
                Medicines Dispensed
              </h3>

              <p className="text-4xl font-bold mt-3">
                1,284
              </p>

            </div>

          </div>

          {/* Recent Invoices */}

          <div className="bg-white rounded-2xl shadow">

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

                {invoices.map((invoice) => (

                  <tr
                    key={invoice.invoice}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {invoice.invoice}
                    </td>

                    <td className="p-4">
                      {invoice.patient}
                    </td>

                    <td className="p-4">
                      {invoice.amount}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {invoice.status}
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