"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getAppointment } from "@/lib/appointment";

export default function viewAppointmentPage(){
    const {id} = useParams();

    const [appointment, setAppointment] = useState<any>(null)

    useEffect(()=>{
        loadAppointment();
    },[])

    async function loadAppointment(){
        try {
            const response = await getAppointment(id as string);
            setAppointment(response.data.data);

        } catch (error) {
            console.error(error)
        }
    }

    if(!appointment){
        return(
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar/>

                <div className="flex-1">
                    <Navbar/>

                    <main className="p-8">
                        <p>Loading...</p>
                    </main>
                </div>
            </div>
        )
    }



    return(
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-white rounded-2xl shadow p-8 max-w-3xl">

                        <h1 className="text-3xl font-bold mb-8">
                            Appointment Details
                        </h1>

                        <div className="grid grid:colds-2 gap-6">

                            <div>
                                <p className="text-gray-500">
                                    Patient
                                </p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.patient?.firstName}{" "}
                                    {appointment.patient?.lastName}
                                </h2>
                            </div>


                            <div>
                                <p className="text-gray-500">Doctor</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.doctor?.name}
                                </h2>
                            </div>


                            <div>
                                <p className="text-gray-500">Date</p>
                                
                                <h2 className="font-semibold text-lg">
                                    {new Date(appointment.date).toLocaleDateString()}
                                </h2>
                            </div>

                            <div>
                                <p className="text-gray-500">Time Slot</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.timeslot}
                                </h2>
                            </div>


                            <div>
                                <p className="text-gray-500">Status</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.status}
                                </h2>
                            </div>


                            <div>
                                <p className="text-gray-500">Appointment ID</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment._id}
                                </h2>
                            </div>


                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}