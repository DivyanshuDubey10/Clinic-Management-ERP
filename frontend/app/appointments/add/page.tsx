"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import { getPatients } from "@/lib/patient";
import { getDoctors } from "@/lib/doctor";
import {createAppointment, getAvailableSlots,} from "@/lib/appointment";


export default function AddAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    timeslot: "",
    duration:30,
    appointmentType:"Walk-in",
    reasonForVisit:"",
    consultationRoom:"",
  });


  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    if (form.doctorId && form.date) {
      loadSlots();
    }
  }, [form.doctorId, form.date]);


  //testing
  useEffect(()=>{

    async function testDoctors() {
      try {
        const res = await getDoctors();
        
      } catch (error) {
        console.error(error)
      }
    }

    testDoctors();
  },[])



  async function loadData() {
    try {
      const patientRes = await getPatients();
      setPatients(patientRes.data || []);

      const doctorRes = await getDoctors();
      setDoctors(doctorRes.data || []);

    } catch (err) {

      console.error(err);
    }
  }



  async function loadSlots() {

    try {
      const response = await getAvailableSlots(
        form.doctorId,
        form.date
      );

      

      setSlots(response.data || []);

    } catch (err) {

      console.error(err);
      setSlots([]);

    }
  }



  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "doctorId" || name === "date"
        ? { timeslot: "" }
        : {}),
    }));
  }



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    try {
      setLoading(true);

      
      

      await createAppointment({
        patientId: form.patientId,
        doctorId: form.doctorId,
        appointmentDate: form.timeslot,
        duration: form.duration,
        appointmentType: form.appointmentType as | "Walk-in" | "Online" | "Follow-up",
        reasonForVisit: form.reasonForVisit,
        consultationRoom: form.consultationRoom,
      });

      alert("Appointment Created!");

      router.push("/appointments");

    } catch (err: any) {

      alert(
        err.response?.data?.message ||
          "Unable to create appointment"
      );
      
    } finally {
      setLoading(false);
    }
  }



  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">

            <h1 className="text-3xl font-bold mb-8">
              Schedule Appointment
            </h1>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>
                <label className="block mb-2 font-medium">
                  Patient
                </label>

                  <select
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                    required
                    >
                    <option value="">
                      Select Patient
                    </option>

                    {patients.map((patient) => (
                      <option
                      key={patient._id}
                      value={patient._id}
                      >
                        {patient.firstName}{" "}
                        {patient.lastName}
                      </option>
                    ))}
                  </select>
                </div>

              <div>
                <label className="block mb-2 font-medium">
                  Doctor
                </label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
                required
                >
                
                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                  key={doctor._id}
                    value={doctor._id}
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  required
                  />

                </div>


              <div>
                <label className="block mb-2 font-medium">
                  Time
                </label>
                  <select
                    name="timeslot"
                    value={form.timeslot}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                    required
                    >
                    <option value="">
                      Select Time Slot
                    </option>

                    {slots.length > 0 ? (
                      slots.map((slot)=>(
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ):(
                      <option disabled>
                        No Available Slots
                      </option>
                    )}

                  </select>
              </div>


              <div>
                <label className="block mb-2 font-medium">
                  Duration
                </label>

                <select
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>


              <div>
                <label className="block mb-2 font-medium">
                  Appointment Type
                </label>

                <select
                  name="appointmentType"
                  value={form.appointmentType}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Online">Online</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>


              <textarea
                 name="reasonForVisit"
                 value={form.reasonForVisit}
                 onChange={(e) => 
                   setForm((prev)=>({
                    ...prev, 
                    reasonForVisit: e.target.value
                   }))
                 }
                 placeholder="Reason for visit"
                 rows={4}
                 className="w-full border rounded-xl p-3"
              />


              <input
                 type="text"
                 name="consultationRoom"
                 value={form.consultationRoom}
                 onChange={handleChange}
                 placeholder="Consultation Room"
                 className="w-full border rounded-xl p-3"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
              >
                {loading
                  ? "Scheduling..."
                  : "Schedule Appointment"}
              </button>

            </form>

          </div>

        </main>

      </div>
    </div>
  );
}