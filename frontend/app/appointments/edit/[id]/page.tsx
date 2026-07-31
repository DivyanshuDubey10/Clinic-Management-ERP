"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import { getAppointment, updateAppointment, getAvailableSlots } from "@/lib/appointment"

import { getDoctors } from "@/lib/doctor"

export default function EditAppointmentPage(){
    const {id} = useParams();
    const router = useRouter();

    const [doctors, setDoctors] = useState<any[]>([])
    const [slots, setSlots] = useState<any[]>([])
    const [loading,setLoading] = useState(false);

    const [form, setForm] = useState({
        doctorId:"",
        date:"",
        timeslot:"",
        duration: 30,
        appointmentType: "Walk-in",
        reasonForVisit: "",
        consultationRoom: "",
        status: "booked" as
                | "booked"
                | "checked-in"
                | "in-progress"
                | "completed"
                | "cancelled"
                | "no-show",
    });



    useEffect(()=>{
        loadAppointment();

        loadDoctors()
    },[])



    useEffect(()=>{
        if(form.doctorId && form.date){
            loadSlot();
        }
    },[form.doctorId, form.date])



    async function loadDoctors(){
        try {

            const res = await getDoctors()

            

            setDoctors(res.data || [])


        } catch (error) {
            console.error(error)
        }
    }


    async function loadAppointment(){
        try {
            const res = await getAppointment(id as string);

            const appointment = res.data.data;

            setForm({
                doctorId: appointment.doctorId?._id || appointment.doctorId || "",
                date: appointment.appointmentDate?.split("T")[0] || "",
                timeslot: appointment.appointmentDate || "",
                duration: appointment.duration || 30,
                appointmentType: appointment.appointmentType || "Walk-in",
                reasonForVisit: appointment.reasonForVisit || "",
                consultationRoom: appointment.consultationRoom || "",
                status: appointment.status || "booked",
            });

        } catch (error) {
            console.error(error)
        }
    }


    async function loadSlot(){
        try {
            const res = await getAvailableSlots(
                form.doctorId,
                form.date,
                id as string
            );


            setSlots(res.data || []);

        } catch (error) {
            console.error(error)
        }
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>){
        
        const {name,value} = e.target;

        setForm((prev)=>({
            ...prev,
            [name]:value
        }))
    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        try {
            setLoading(true)

           await updateAppointment(id as string,{
                doctorId:form.doctorId,
                appointmentDate: form.timeslot,
                duration:form.duration,
                appointmentType:form.appointmentType as
                    |"Walk-in"
                    |"Online"
                    |"Follow-up",
                reasonForVisit:form.reasonForVisit,
                consultationRoom:form.consultationRoom,
                status: form.status as
                    | "booked"
                    | "checked-in"
                    | "in-progress"
                    | "completed"
                    | "cancelled"
                    | "no-show",
            });

            alert("Appointment Updated")

            router.push("/appointments")

        } catch (error: any) {
            
            alert(
                error.response?.data?.message || "Unable to update appointment"
            )
        }finally{
            setLoading(false)
        }
    }


    return(
        <div className="flex min-h-screen bg-muted/30">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-card max-w-3xl rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold mb-8">
                            Edit Appointment
                        </h1>

                        <form
                           onSubmit={handleSubmit}
                           className="space-y-5"
                        >
                            <label className="block text-sm font-medium text-slate-700">Doctor
                            <select
                                name="doctorId"
                                value={form.doctorId}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            >
                                <option value="">Select doctor</option>
                                {doctors.map((doctor) => (

                                <option
                                    key={doctor._id}
                                    value={doctor._id}
                                >
                                    {doctor.name}
                                </option>
                                ))}
                            </select>
                            </label>

                           <label className="block text-sm font-medium text-slate-700">Date
                           <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">Time slot
                            <select
                                name="timeslot"
                                value={form.timeslot}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            >
                                <option value="">Select time slot</option>
                                {slots.map((slot) => (
                                <option
                                    key={slot}
                                    value={slot}
                                >
                                    {new Date(slot).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </option>
                                ))}
                            </select>
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


                            <textarea
                                name="reasonForVisit"
                                value={form.reasonForVisit}
                                onChange={handleChange}
                                placeholder="Reason for Visit"
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

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full border rounded-xl p-3"
                            >
                               <option value="booked">Booked</option>
                                <option value="checked-in">Checked In</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="no-show">No Show</option>

                            </select>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                            >
                                {loading
                                ? "Updating..."
                                : "Update Appointment"}
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}
