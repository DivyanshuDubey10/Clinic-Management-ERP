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
            <div className="flex min-h-screen bg-muted/30">
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
        <div className="flex min-h-screen bg-muted/30">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-card rounded-2xl shadow p-8 max-w-3xl">

                        <h1 className="text-3xl font-bold mb-8">
                            Appointment Details
                        </h1>

                        <div className="grid gap-6 md:grid-cols-2">

                            <div>
                                <p className="text-muted-foreground">
                                    Patient
                                </p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.patientId?.firstName || "-"}{" "}
                                    {appointment.patientId?.lastName || ""}
                                </h2>
                            </div>


                            <div>
                                <p className="text-muted-foreground">Doctor</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.doctorId?.name || "-"}
                                </h2>
                            </div>


                            <div>
                                <p className="text-muted-foreground">Date</p>
                                
                                <h2 className="font-semibold text-lg">
                                    {appointment.appointmentDate
                                        ? new Date(appointment.appointmentDate).toLocaleDateString()
                                        : "-"}
                                </h2>
                            </div>

                            <div>
                                <p className="text-muted-foreground">Time Slot</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.appointmentDate
                                        ? new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                        : "-"}
                                </h2>
                            </div>


                            <div>
                                <p className="text-muted-foreground">Status</p>

                                <h2 className="font-semibold text-lg">
                                    {appointment.status}
                                </h2>
                            </div>


                            <div>
                                <p className="text-muted-foreground">Appointment ID</p>

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
