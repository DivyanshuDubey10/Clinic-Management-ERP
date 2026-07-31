"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAppointments } from "@/lib/appointment";

interface Appointment{
    _id: string;
    patientId:{
        firstName:string;
        lastName:string;
    };
    doctorId:{
        name:string;
    };
    appointmentDate:string;
    status:string;
}


export default function RecentAppointments(){
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        loadAppointments()
    },[]);


    const loadAppointments = async () => {
        try {
            const res = await getAppointments();

            setAppointments(res.data || []);
        } catch (error) {
            console.error("Failed to load appointments:", error)
        }finally{
            setLoading(false)
        }
    };


    if(loading){
        return(
            <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
                Loading appointments...
            </div>
        );
    };


    return(
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                    Recent Appointments
                </h2>

                <Link href="/appointments" className="text-blue-600 font-medium hover:underline">
                    View All
                </Link>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Doctor</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((appointment)=>(
                        <tr
                          key={appointment._id}
                          className="border-b hover:bg-gray-50"
                        >
                            <td className="py-4">
                                {appointment.patientId
                                  ?`${appointment.patientId.firstName} ${appointment.patientId.lastName}`
                                  :"N/A"
                                }
                            </td>

                            <td>
                                {appointment.doctorId?.name || "N/A"}
                            </td>

                            <td>
                                {new Date(
                                    appointment.appointmentDate
                                ).toLocaleString()}
                            </td>

                            <td>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    appointment.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : appointment.status === "booked"
                                    ? "bg-blue-100 text-blue-700"
                                    : appointment.status === "checked-in"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : appointment.status === "in-progress"
                                    ? "bg-purple-100 text-purple-700"
                                    : appointment.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                                >
                                    {appointment.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}