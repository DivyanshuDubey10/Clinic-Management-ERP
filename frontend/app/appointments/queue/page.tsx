"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getDoctors } from "@/lib/doctor";
import { getQueue } from "@/lib/appointment";

export default function QueuePage(){
    const [doctors, setDoctors] = useState<any[]>([]);
    const [doctorId, setDoctorId] = useState("")
    const [queue, setQueue] = useState<any[]>([])

    useEffect(()=>{
        loadDoctors();
    },[])



    useEffect(()=>{
        console.log("DoctorId:", doctorId)

        if(doctorId){
            loadQueue();
        }
    },[doctorId])


    async function loadDoctors() {
        try {
            const res = await getDoctors();
             
            console.log(res)
            console.log("Dr structure",res.data[0])


            setDoctors(res.data || [])

        } catch (error) {
            console.error(error)
        }
    }


    async function loadQueue(){
        try {
            console.log("Loading Queue for:", doctorId)
            
            const res = await getQueue(doctorId)

            console.log("Queue Res:", res)
            console.log("queue data",res.data)
            console.log("JSON:",JSON.stringify(res.data,null,2))

            setQueue(res.data || [])

        } catch (error) {
            console.error(error)
        }
    }



    return(
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-white rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold mb-6">
                            Doctor Queue
                        </h1>

                        <select className="w-full border rounded-xl p-3 mb-8"
                        value={doctorId}
                        onChange={(e)=> {
                            console.log("Selected Doctors:", e.target.value); 
                           setDoctorId(e.target.value)}}>
                            
                            <option value="">Select Doctor</option>

                            {doctors.map((doctor)=>(
                                <option key={doctor._id}
                                value={doctor._id}>
                                    {doctor.name}
                                </option>
                            ))}

                        </select>

                        {queue.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                No Patients in queue
                            </div>
                        ):(
                            <table className="w-full">

                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3">
                                            #
                                        </th>

                                        <th className="text-left">
                                            Patient
                                        </th>

                                        <th className="text-left">
                                            Time
                                        </th>

                                        <th className="text-left">
                                            Status
                                        </th>
                                    </tr>
                                </thead>


                                <tbody>
                                    {queue.map((patient, index)=>(
                                        <tr key={patient._id}
                                        className="border-b hover:bg-hray-50">

                                            <td className="py-4">
                                                { patient.appointmentNumber || index+1}
                                            </td>

                                            <td>
                                                {patient.patientId?.firstName}{" "}
                                                {patient.patientId?.lastName}
                                            </td>

                                            <td>
                                                {new Date(patient.appointmentDate).toLocaleTimeString([],{
                                                    hour:"2-digit",
                                                    minute:"2-digit",
                                                })}
                                            </td>

                                            <td>

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        patient.status === "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : patient.status === "checked-in"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : patient.status === "cancelled"
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {patient.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}