"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import {
  getPortalDoctors,
  getPortalAvailableSlots,
  bookPortalAppointment,
} from "@/lib/patientPortal";

export default function BookAppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    timeslot: "",
    reasonForVisit: "",
    appointmentType: "Walk-in",
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    if (form.doctorId && form.date) {
      loadSlots();
    }
  }, [form.doctorId, form.date]);

  async function loadDoctors() {
    try {
      const doctorRes = await getPortalDoctors();
      setDoctors(doctorRes.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadSlots() {
    try {
      const response = await getPortalAvailableSlots(form.doctorId, form.date);
      setSlots(response.data || []);
    } catch (err) {
      console.error(err);
      setSlots([]);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctorId" || name === "date" ? { timeslot: "" } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (!form.doctorId || !form.timeslot || !form.reasonForVisit) {
        alert("Please fill all required fields.");
        setLoading(false);
        return;
      }

      await bookPortalAppointment({
        doctorId: form.doctorId,
        appointmentDate: form.timeslot,
        reasonForVisit: form.reasonForVisit,
        appointmentType: form.appointmentType,
      });

      alert("Appointment Booked Successfully!");
      router.push("/patient-portal/appointments");
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Unable to book appointment"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="bg-card rounded-2xl shadow p-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Book Appointment</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Doctor</label>
                <select
                  name="doctorId"
                  value={form.doctorId}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      Dr. {doctor.name} ({doctor.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Time</label>
                <select
                  name="timeslot"
                  value={form.timeslot}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  required
                >
                  <option value="">Select Time Slot</option>
                  {slots.length > 0 ? (
                    slots.map((slot) => {
                      const timeString = new Date(slot).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <option key={slot} value={slot}>
                          {timeString}
                        </option>
                      );
                    })
                  ) : (
                    <option disabled>No Available Slots for this date</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Consultation Type</label>
                <select
                  name="appointmentType"
                  value={form.appointmentType}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="Online">Online</option>
                  <option value="Walk-in">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Reason for Visit</label>
                <textarea
                  name="reasonForVisit"
                  value={form.reasonForVisit}
                  onChange={handleChange}
                  placeholder="E.g., Fever and headache for 2 days"
                  rows={4}
                  className="w-full border rounded-xl p-3"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-4 transition"
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
