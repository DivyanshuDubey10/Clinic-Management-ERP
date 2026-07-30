"use client"
import { getAppointments, deleteAppointment } from "@/lib/appointment"
import { useEffect, useState } from "react"
import {
    Plus,
    Search,
    Eye,
    Pencil,
    Trash2,
    CalendarDays,
    Stethoscope
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";


export default function appointmentPage(){

    const [appointments, setAppointments] = useState<any>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<any>([]);
    const [search, setSearch] = useState("")


    useEffect(()=>{
        loadAppointments();
    },[]);


    async function loadAppointments(){
        try {
            const response = await getAppointments();

            

            

            setAppointments(response.data || []);
            setFilteredAppointments(response.data || []);

        } catch (error) {
            console.error(error);
        }
    }


    function handleSearch(value: string){
        setSearch(value);

        const filtered = appointments.filter((appointment: any)=>{

            const patient = 
               `${appointment.patientId?.firstName || ""} ${appointment.patientId?.lastName || ""}`

            const doctor = `${appointment.doctorId?.name || ""}`.toLowerCase()
            //    `${appointment.doctor?.FirstName?.toLowerCase() || ""} ${appointment.doctor?.lastName || ""}`.toLowerCase();


            return (
                patient.includes(value.toLowerCase()) || 
                doctor.includes(value.toLocaleLowerCase())
            );
        });


        setFilteredAppointments(filtered)
    }


    async function handleDelete(id: string){
        if(!confirm("Are you sure you want to delete this appointment?")){
            return;
        }

        try {
            await deleteAppointment(id);
            loadAppointments();

        } catch (error) {

            console.error(error);
        }
    }



    return(
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">

                <Navbar/>

                <main className="p-8">

                    <div className="flex justify-between items-center mb-8">

                        <div>
                            <h1 className="text-3xl font-bold">
                                Appointments
                            </h1>

                            <p className="text-gray-500">
                                Manage all clinic appointments
                            </p>
                        </div>

                        <Link href="/appointments/add"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">
                            <Plus size={18}/>
                            Schedule Appointment
                        </Link>

                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="relative mb-5">

                            <Search className="absolute left-4 top-3.5 text-gray-400"
                                size={18}
                            />

                            <input
                              type="text"
                              placeholder="Search appointments..."
                              value={search}
                              onChange={(e)=>handleSearch(e.target.value)}
                              className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {filteredAppointments.length === 0?(

                            <div className="text-center py-16">
                                <CalendarDays
                                   className="mx-auto text-gray-300"
                                   size={70}
                                />

                                <h2 className="text-xl font-semibold mt-4">
                                    No Appointments Found
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Schedule your first appointment.
                                </p>
                            </div>

                        ):(
                            <div className="overlflow-x-auto">

                                <table className="w-full">
                                    <thead>
                                          <tr className="border-b text-left">

                                                <th className="py-3">Patient</th>
                                                <th>Doctor</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status</th>
                                                <th className="text-center">Actions</th>

                                            </tr>
                                    </thead>

                                    <tbody>
                                        {filteredAppointments.map((appointment:any)=>(
                                            <tr key={appointment._id}
                                            className="border-b hover:bg-slate-50">

                                                <td className="py-4">
                                                    {appointment.patientId?.firstName}{" "}
                                                    {appointment.patientId?.lastName}
                                                </td>

                                                <td>
                                                    {appointment.doctorId?.name}
                                                </td>

                                                <td>
                                                    {new Date( appointment.appointmentDate).toLocaleDateString([],{
                                                        hour:"2-digit",
                                                        minute:"2-digit",
                                                    })}
                                                </td>

                                                <td>
                                                    {appointment.appointmentDate
                                                        ? new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })
                                                        : "-"}
                                                </td>

                                                <td>
                                                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                                                        {appointment.status}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex justify-center gap-3">
                                                        <Link href={`/appointments/${appointment._id}`}>
                                                           <Eye size={18}
                                                              className="text-vlue-600"
                                                            />
                                                        </Link>

                                                        <Link href={`/appointments/edit/${appointment._id}`}>
                                                          <Pencil
                                                            size={18}
                                                            className="text-green-600"
                                                          />
                                                        </Link>

                                                        <Link href={`/consultations/${appointment._id}`} title="Open consultation">
                                                          <Stethoscope size={18} className="text-blue-600" />
                                                        </Link>


                                                        <button onClick={()=>{
                                                            handleDelete(appointment._id)
                                                         }}
                                                        >
                                                            <Trash2 size={18}
                                                             className="text-red-600"
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>


                    {/* Quick Action */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">

                        <Link href="/appointments/calendar"
                        className="bg-white rounded-2xl shadow-sm border hover:shadow-lg hover:border-blue-500 transition-all p-5">
                            
                            <CalendarDays className="text-blue-600 mb-4" size={34}/>

                            <h3 className="font-semibold text-lg">
                                Calendar
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Monthly & Weekly appointment schedule
                            </p>
                        </Link>


                           <Link
                                href="/appointments/queue"
                                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg hover:border-green-500 transition-all p-5"
                            >
                                <Eye className="text-green-600 mb-4" size={34} />

                                <h3 className="font-semibold text-lg">
                                    Live Queue
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Monitor today's patient queue
                                </p>
                            </Link>

                        <Link
                            href="/appointments/waitlist"
                            className="bg-white rounded-2xl shadow-sm border hover:shadow-lg hover:border-orange-500 transition-all p-5"
                        >
                            <Search className="text-orange-500 mb-4" size={34} />

                            <h3 className="font-semibold text-lg">
                                Waitlist
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage patients waiting for slots
                            </p>
                        </Link>

                        <Link
                            href="/availability"
                            className="bg-white rounded-2xl shadow-sm border hover:shadow-lg hover:border-purple-500 transition-all p-5"
                        >
                            <Pencil className="text-purple-600 mb-4" size={34} />

                            <h3 className="font-semibold text-lg">
                                Availability
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Configure doctor schedules
                            </p>
                        </Link>
                    </div>
            </div>
        </div>
    )
}
