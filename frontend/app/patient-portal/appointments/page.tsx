"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  getMyAppointment,
  cancelAppointment,
} from '@/lib/portal'

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const response = await getMyAppointment();
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: string) {
    const confirmCancel = confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) return;

    try {
      await cancelAppointment(id);

      alert("Appointment cancelled.");

      loadAppointments();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Unable to cancel appointment."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">Loading...</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          {/* Header */}

          <div className="flex items-center justify-between mb-8">

            <div>
              <h1 className="text-3xl font-bold">
                My Appointments
              </h1>

              <p className="text-gray-500 mt-1">
                View and manage your appointments.
              </p>
            </div>

            <Link
              href="/patient-portal/appointments/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              + Book Appointment
            </Link>

          </div>

          {appointments.length === 0 ? (

            <div className="bg-white rounded-3xl p-16 text-center shadow">
              <h2 className="text-2xl font-semibold">
                No appointments found
              </h2>

              <p className="text-gray-500 mt-2">
                Book your first appointment.
              </p>
            </div>

          ) : (

            <div className="space-y-6">

              {appointments.map((appointment) => (

                <div
                  key={appointment._id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6"
                >

                  <div className="flex justify-between">

                    <div>

                      <h2 className="text-2xl font-bold">
                        Dr. {appointment.doctorId?.name}
                      </h2>

                      <p className="text-gray-500">
                        {appointment.doctorId?.specialization}
                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        appointment.status === "booked"
                          ? "bg-blue-100 text-blue-700"
                          : appointment.status === "checked-in"
                          ? "bg-yellow-100 text-yellow-700"
                          : appointment.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </span>

                  </div>

                  <div className="grid md:grid-cols-3 gap-5 mt-6">

                    <div>
                      <p className="text-sm text-gray-500">
                        Date
                      </p>

                      <p className="font-semibold">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Time
                      </p>

                      <p className="font-semibold">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Consultation Type
                      </p>

                      <p className="font-semibold">
                        {appointment.appointmentType}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6">

                    <p className="text-sm text-gray-500">
                      Reason for Visit
                    </p>

                    <p className="mt-1">
                      {appointment.reasonForVisit}
                    </p>

                  </div>

                  {(appointment.status === "booked" ||
                    appointment.status === "checked-in") && (

                    <button
                      onClick={() =>
                        handleCancel(appointment._id)
                      }
                      className="mt-6 border border-red-500 text-red-600 hover:bg-red-50 px-5 py-2 rounded-xl"
                    >
                      Cancel Appointment
                    </button>

                  )}

                </div>

              ))}

            </div>

          )}

        </main>
      </div>
    </div>
  );
}