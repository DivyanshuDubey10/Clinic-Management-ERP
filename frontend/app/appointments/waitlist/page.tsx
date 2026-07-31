"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getDoctors } from "@/lib/doctor";
import { getWaitlist, addToWaitlist } from "@/lib/appointment";
import { getPatients } from "@/lib/patient";

export default function WaitlistPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([])

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    requestedDate: "",
    notes: "",
    status: "waiting",
  });


  useEffect(() => {
    loadDoctors();

    loadWaitlist();
  }, [form.doctorId, form.requestedDate]);



  async function loadDoctors() {
    try {
      const response = await getDoctors();

      setDoctors(response.data || []);

      const pastientRes = await getPatients();

      setPatients(pastientRes.data || [])

    } catch (error) {
      console.error(error);
    }
  }



  async function loadWaitlist() {
    try {

        if(!form.doctorId || !form.requestedDate) return

      const response = await getWaitlist(form.doctorId, form.requestedDate);
      

      
      
      setWaitlist(response.data || []);

    } catch (error) {
      console.error(error);
    }
  }


  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    

    try {
      await addToWaitlist({
          patientId: form.patientId,
          doctorId: form.doctorId,
          requestedDate: form.requestedDate,
          notes: form.notes,
          status: "Waiting",
      });

      alert("Patient added to waitlist");

      setForm({
        patientId: "",
        doctorId: "",
        requestedDate: "",
        notes: "",
        status:"Waiting"
      });

      loadWaitlist();

    }  catch (error: any) {

      console.error("Waitlist Error:", error);
      

      alert(
        error.response?.data?.message ||
        "Failed to add patient to waitlist"
      );
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar/>

        <div className="p-6 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-xl shadow p-6 space-y-4"
          >
            {/* <input
              type="text"
              placeholder="Patient ID"
              value={form.patientId}
              onChange={(e) =>
                setForm({
                  ...form,
                  patientId: e.target.value,
                })
              }
              className="border rounded-lg w-full p-2"
            /> */}

            <select
              value={form.patientId}
              onChange={(e) =>
                  setForm({
                      ...form,
                      patientId: e.target.value,
                  })
              }
              className="border rounded-lg w-full p-2"
          >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                  <option
                      key={patient._id}
                      value={patient._id}
                  >
                      {patient.firstName} {patient.lastName}
                  </option>
              ))}
          </select>

            <select
              value={form.doctorId}
              onChange={(e) =>
                setForm({
                  ...form,
                  doctorId: e.target.value,
                })
              }
              className="border rounded-lg w-full p-2"
            >
              <option value="">Select Doctor</option>

              {doctors.map((doctor: any) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.requestedDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  requestedDate: e.target.value,
                })
              }
              className="border rounded-lg w-full p-2"
            />

            <textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e)=> setForm({
                  ...form,
                  notes:e.target.value
                })}
                className="border rounded-lg w-full p-2"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add to Waitlist
            </button>
          </form>

          <div className="bg-card rounded-xl shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Requested Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {waitlist.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-6">
                      No patients in waitlist
                    </td>
                  </tr>
                ) : (
                  waitlist.map((item: any) => (
                    <tr key={item._id}>
                      <td className="p-3">
                        {item.patientId?.firstName} {item.patientId?.lastName}
                      </td>

                      <td className="p-3">
                        {item.doctorId?.name}
                      </td>

                      <td className="p-3">
                        {new Date(item.requestedDate).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        {item.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}