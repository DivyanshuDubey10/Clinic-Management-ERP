"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Search, Plus, Eye } from "lucide-react";
import { useState,useEffect } from "react";
import { getConsultations } from "@/lib/patientPortal";


// const consultations = [
//   {
//     id: "CON001",
//     patient: "Rahul Sharma",
//     doctor: "Dr. Priya Singh",
//     prescription: "Added",
//     lab: "Pending",
//     status: "Completed",
//   },
//   {
//     id: "CON002",
//     patient: "Ananya Das",
//     doctor: "Dr. Amit Roy",
//     prescription: "Pending",
//     lab: "Not Ordered",
//     status: "In Progress",
//   },
//   {
//     id: "CON003",
//     patient: "Rohan Gupta",
//     doctor: "Dr. Sneha Kapoor",
//     prescription: "Added",
//     lab: "Completed",
//     status: "Completed",
//   },
// ];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  useEffect(()=>{
    loadConsultations();
  },[search,status])


  const loadConsultations = async () =>{
    try{
      const res = await getConsultations({search, status});

      setConsultations(res.data || [])
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }

  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Consultation Workspace
              </h1>

              <p className="text-slate-500 mt-1">
                Manage consultation notes, prescriptions and lab investigations.
              </p>

            </div>

             <Link
              href="/appointments"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              Start Consultation
            </Link>

          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow p-5 mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />

              <input
                type="text"
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
                placeholder="Search symptoms or diagnosis..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={status}
                onChange={(e)=>setSearch(e.target.value)}
                className="border rounded-lg px-4 py-3"
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Consulatation ID</th>
                  <th className="px-6 py-4 text-left">Patient</th>
                  <th className="px-6 py-4 text-left">Doctor</th>
                  <th className="px-6 py-4 text-left">Prescription</th>
                  <th className="px-6 py-4 text-left">Lab Order</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {consultations.map((consultation) => (
                  <tr
                    key={consultation._id}
                    className="border-b hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {consultation._id}
                    </td>

                    <td className="px-6 py-4">
                     {`${consultation.patientId?.firstName} ${consultation.patientId?.lastName}`}
                    </td>

                    <td className="px-6 py-4">
                      {consultation.doctorId?.name}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.symptoms === "Added"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {consultation.symptoms}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : consultation.status === "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {consultation.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          consultation.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {consultation.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/consultations/${consultation._id}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                      >
                        <Eye size={16} />
                        View EMR
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}