"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { CalendarDays, Users, Clock3, Search } from "lucide-react";
import { getDoctorDashboard } from "@/lib/dashboard";

export default function DoctorDashboard(){
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState<any>(null)
    const [search, setSearch] = useState("")

    useEffect(()=>{
        loadDashboard();
    },[])


    async function loadDashboard(){
        try {
            const res = await getDoctorDashboard();

            
            
            

            

            setDashboard(res.data);

        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false)
        }
    }


    const appointments =
        dashboard?.queue?.filter((appointment: any) =>
            `${appointment.patient.firstName} ${appointment.patient.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase())
        ) || [];

    if(loading){
        return(
            <div className="flex">
                <Sidebar/>

                <div className="flex-1">
                    <Navbar/>

                    <div className="p-6">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }


    return(
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="bg-card rounded-xl shadow p-5">

                            <CalendarDays className="text-blue-600 mb-3" size={28}/>

                            <h2 className="text-muted-foreground">
                                Today's Appointment
                            </h2>
                            <p className="text-3xl font-bold">
                                {dashboard?.appointment?.totalToday || 0}
                            </p>
                        </div>

                        <div className="bg-card rounded-xl shadow p-5">
                            <Users className="text-green-600 mb-3" size={28}/>

                            <h2 className="text-muted-foreground">
                                Patients Waitlist
                            </h2>

                            <p className="text-3xl font-bold">
                                {dashboard?.stats?.Waiting || 0}    
                            </p> 
                        </div>


                        <div className="bg-card rounded-xl shadow p-5">
                            <Clock3 className="text-orange-600 mb-3" size={28}/>

                            <h2 className="text-muted-foreground">Completed Today</h2>
                            <p className="text-3xl font-bold">
                                {dashboard?.stats?.completed || 0}
                            </p>
                        </div>

                        <div className="bg-card rounded-xl shadow p-5">
                            <div className="relative mb-5">

                                <Search size={18}
                                  className="absolute left-3 top-3 text-muted-foreground"/>

                                <input
                                  type="text"
                                  placeholder="Search patient..."
                                  className="border rounded-lg pl-10 p-2 w-full"
                                  value={search}
                                  onChange={(e)=> setSearch(e.target.value)}
                                />

                            </div>


                            <table className="w-full">
                                <thead className="bg-gray-100">

                                    <tr>
                                        <th className="p-3 text-left">Patient</th>
                                        <th className="p-3 text-left">Time</th>
                                        <th className="p-3 text-left">Reason</th>
                                        <th className="p-3 text-left">Status</th>
                                    </tr>

                                </thead>

                                <tbody>
                                    {appointments.map((appointment: any)=>(
                                        <tr 
                                          key={appointment._id}
                                          className="border-b"
                                        >
                                            <td className="p-3">
                                                {appointment.patient.firstName}{" "}
                                                {appointment.patient.firstName}
                                            </td>

                                            <td className="p-3">
                                                {appointment.timeSlot}
                                            </td>

                                            <td className="p-3">
                                                {appointment.reasonForVisit}
                                            </td>

                                            <td className="p-3">
                                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                                                    {appointment.status}
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
        </div>
    )
}