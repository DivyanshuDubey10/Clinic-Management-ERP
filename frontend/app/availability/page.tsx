"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getAvailability, setAvailability, getAllAvailability } from "@/lib/availability";
import { getDoctors } from "@/lib/doctor";

interface Doctor{
    _id:string;
    name:string;
    specialization:string;
}

interface Availability{
    _id:string;
    doctorId:Doctor;
    startTime:string;
    endTime:string;
    lunchStart:string;
    lunchEnd:string;
    workingDays:number[];
    leaves:string[];
}

export default function AvailabilityPage() {
  const [doctorId, setDoctorId] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("")
  const [availabilityList, setAvailabilityList] = useState<Availability[]>([])

  const [form, setForm] = useState({
    startTime: "09:00",
    endTime: "17:00",
    lunchStart: "13:00",
    lunchEnd: "14:00",
    workingDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    leaves: [] as string[],
  });


  useEffect(() => {
    loadDoctors();
    loadAvailabilityList()
  }, []);


  async function loadAvailabilityList(){
    const res = await getAllAvailability();

    console.log("Response",res.data)
    
    setAvailabilityList(res.data)
  }


  async function loadDoctors() {
    try {
      setLoading(true);

      const res = await getDoctors();

      setDoctors(res.data || []);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.role === "doctor") {
        setDoctorId(user._id);
        setSelectedDoctor(user._id);
        loadAvailability(user._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }



  async function loadAvailability(id: string) {
    try {

        const response = await getAvailability(id);

        if (!response.success || !response.data) {

            setDoctorId(id);

            setSelectedDoctor(id);

            setForm({
                startTime: "09:00",
                endTime: "17:00",
                lunchStart: "13:00",
                lunchEnd: "14:00",
                workingDays: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                ],
                leaves: [],
            });

            return;
        }

        const availability = response.data;

        const reverseDayMap: Record<number,string> = {
            0:"Sunday",
            1:"Monday",
            2:"Tuesday",
            3:"Wednesday",
            4:"Thursday",
            5:"Friday",
            6:"Saturday",
        };

        const first = availability.workingHours[0];

        setDoctorId(id);

        setSelectedDoctor(id);

        setForm({
            startTime:first?.startTime || "09:00",
            endTime:first?.endTime || "17:00",
            lunchStart:first?.lunchStart || "13:00",
            lunchEnd:first?.lunchEnd || "14:00",

            workingDays:
                availability.workingHours.map(
                    (d:any)=>reverseDayMap[d.dayOfWeek]
                ),

            leaves:
                availability.leaveDates.map(
                    (l:any)=>l.date.split("T")[0]
                ),
        });

    }

    catch(error){

        console.error(error);

        setDoctorId(id);

        setSelectedDoctor(id);

        setForm({
            startTime:"09:00",
            endTime:"17:00",
            lunchStart:"13:00",
            lunchEnd:"14:00",
            workingDays:[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
            ],
            leaves:[],
        });
    }
}



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try{
        const dayMap: Record<string, number> = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        };

        const workingHours = form.workingDays.map((day) => ({
            dayOfWeek: dayMap[day],
            startTime: form.startTime,
            endTime: form.endTime,
            lunchStart: form.lunchStart,
            lunchEnd: form.lunchEnd,
            isOffDay: false,
        }));

        const leaveDates = form.leaves.map((date) => ({
            date,
            reason: "",
        }));

        await setAvailability({
            doctorId,
            workingHours,
            slotDuration: 15,
            leaveDates,
        });

        await loadAvailability(doctorId)
        setMessage("Availability updated successfully")

        setTimeout(()=>{
            setMessage("")
        },2000);

  }catch(err){
     console.error("Error", err)
   }
}



  function toggleDay(day: string) {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  }



  function removeLeave(index: number) {
    setForm((prev) => ({
      ...prev,
      leaves: prev.leaves.filter((_, i) => i !== index),
    }));
  }



  function addLeave(date: string) {
    if (!date) return;

    if (form.leaves.includes(date)) return;

    setForm((prev) => ({
      ...prev,
      leaves: [...prev.leaves, date],
    }));
  }


  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="flex-1">
        <Navbar />

        <div className="p-6 space-y-6">

            <div>
            <h1 className="text-3xl font-bold text-gray-800">
                Doctor Availability
            </h1>

            <p className="text-gray-500 mt-1">
                Manage doctors' working days, timings and leave schedule.
            </p>
            </div>

            {loading ? (
            <div className="bg-white rounded-xl shadow p-6 text-center">
                Loading doctors...
            </div>
            ) : (
            <>
                <div className="bg-white rounded-xl shadow p-6">
                <label className="block text-sm font-semibold mb-2">
                    Select Doctor
                </label>

                <select
                    value={selectedDoctor}
                    onChange={(e) => {
                    setSelectedDoctor(e.target.value);
                    setDoctorId(e.target.value);
                    loadAvailability(e.target.value);
                    }}
                    className="border rounded-lg w-full p-3"
                >
                    <option value="">Select Doctor</option>

                    {doctors.map((doctor: any) => (
                    <option
                        key={doctor._id}
                        value={doctor._id}
                    >
                        {doctor.name}{" "}
                        {doctor.specialization
                        ? `(${doctor.specialization})`
                        : ""}
                    </option>
                    ))}
                </select>
                </div>

                {selectedDoctor && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    {(() => {
                    const doctor = doctors.find(
                        (d: any) => d._id === selectedDoctor
                    );

                    if (!doctor) return null;

                    return (
                        <>
                        <h2 className="text-xl font-semibold">
                            {doctor.name}
                        </h2>

                        <p className="text-gray-600">
                            {doctor.specialization ||
                            "No specialization"}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            {doctor.email}
                        </p>
                        </>
                    );
                    })()}
                </div>
                )}

                <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow p-6 space-y-6"
                >

                <div>
                    <h2 className="text-xl font-semibold mb-4">
                    Working Days
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ].map((day) => (
                        <label
                        key={day}
                        className="flex items-center gap-2"
                        >
                        <input
                            type="checkbox"
                            checked={form.workingDays.includes(day)}
                            onChange={() => toggleDay(day)}
                        />

                        {day}
                        </label>
                    ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">

                    <div>
                    <label className="block font-medium mb-2">
                        Start Time
                    </label>

                    <input
                        type="time"
                        value={form.startTime}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            startTime: e.target.value,
                        })
                        }
                        className="border rounded-lg w-full p-3"
                    />
                    </div>

                    <div>
                    <label className="block font-medium mb-2">
                        End Time
                    </label>

                    <input
                        type="time"
                        value={form.endTime}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            endTime: e.target.value,
                        })
                        }
                        className="border rounded-lg w-full p-3"
                    />
                    </div>

                    <div>
                    <label className="block font-medium mb-2">
                        Lunch Start
                    </label>

                    <input
                        type="time"
                        value={form.lunchStart}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            lunchStart: e.target.value,
                        })
                        }
                        className="border rounded-lg w-full p-3"
                    />
                    </div>

                    <div>
                    <label className="block font-medium mb-2">
                        Lunch End
                    </label>

                    <input
                        type="time"
                        value={form.lunchEnd}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            lunchEnd: e.target.value,
                        })
                        }
                        className="border rounded-lg w-full p-3"
                    />
                    </div>

                </div>

                <div>
                    <label className="block font-medium mb-2">
                    Leave Dates
                    </label>

                    <input
                    type="date"
                    onChange={(e) => addLeave(e.target.value)}
                    className="border rounded-lg w-full p-3"
                    />

                    {form.leaves.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">

                        {form.leaves.map((leave, index) => (

                        <button
                            type="button"
                            key={index}
                            onClick={() => removeLeave(index)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                        >
                            {leave} ✕
                        </button>

                        ))}

                    </div>
                    )}
                </div>

                {message && (
                    <div className="mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!selectedDoctor}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-semibold transition"
                >
                    Save Availability
                </button>

                </form>

                <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Doctors
                </h2>

                {doctors.length === 0 ? (
                    <p className="text-gray-500">
                    No doctors found.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {doctors.map((doctor: any) => (

                        <div
                        key={doctor._id}
                        className="border rounded-xl p-5 hover:shadow-md transition"
                        >
                        <h3 className="font-semibold text-lg">
                            {doctor.name}
                        </h3>

                        <p className="text-gray-600">
                            {doctor.specialization ||
                            "No specialization"}
                        </p>

                        <button
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                            onClick={() => {
                            setDoctorId(doctor._id);
                            setSelectedDoctor(doctor._id);
                            loadAvailability(doctor._id);

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            }}
                        >
                            Edit Availability
                        </button>
                        </div>

                    ))}

                    </div>
                )}
                </div>

            </>
            )}

            {availabilityList.map((item) => (
                <div key={item._id}>
                    <h3>{item.doctorId.name}</h3>
                    <p>{item.doctorId.specialization}</p>
                    <p>{item.startTime} - {item.endTime}</p>

                    <button
                        onClick={() => loadAvailability(item.doctorId._id)}
                    >
                        Edit Availability
                    </button>
                </div>
            ))}

        </div>
        </div>
    </div>
    );
}