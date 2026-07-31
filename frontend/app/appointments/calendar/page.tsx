"use client"

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from  "react-big-calendar" ;
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import api from "@/lib/api";

const localizer = momentLocalizer(moment);

export default function AppointmentCalendar(){
    const [events, setEvents] = useState<any[]>([])
    const [currentDate, setCurrentDate] = useState(new Date());

    console.log("calendar")

    useEffect(()=>{
        console.log("loading appointments:")
        loadAppointments(currentDate);
    },[])



    async function loadAppointments(date = new Date()) {
        console.log("Load Appointment")
        try {
            const startDate = moment(date)
            .startOf("month")
            .format("YYYY-MM-DD");

            const endDate = moment(date)
            .endOf("month")
            .format("YYYY-MM-DD");

            const response = await api.get(
            `/appointments?startDate=${startDate}&endDate=${endDate}`
            );

            console.log("Appointments:", response.data.data);

            const appointments =
            response.data.data ?? response.data;

            const data = appointments.map((appointment: any) => {
            const appointmentDate =
                appointment.appointmentDate || appointment.date;

            const appointmentTime =
                appointment.time ||
                appointment.timeslot ||
                "09:00";

            return {
                id: appointment._id,

                title: appointment.patientId
                ? `${appointment.patientId.firstName} ${appointment.patientId.lastName}`
                : "Unknown Patient",

                start: new Date(
                `${appointmentDate.split("T")[0]}T${appointmentTime}`
                ),

                end: moment(
                `${appointmentDate.split("T")[0]}T${appointmentTime}`
                )
                .add(15, "minutes")
                .toDate(),

                type: "appointment",
            };
            });


            console.table(
                data.map((e:any)=>({
                    title:e.title,
                    start: e.start,
                    end:e.end, 
                }))
            );

            setEvents(data);
        } catch (error: any) {
            console.log(error.response?.status);
            console.log(error.response?.data);
            console.log(error);
        }
    }


    return(
        <div className="flex">
            <Sidebar/>

            <div className="flex-1">
                <Navbar />

                <div className="p-6 bg-white rounded-xl shadow m-6">
                    <Calendar
                       localizer={localizer}
                       events={events}
                       startAccessor="start"
                       endAccessor="end"
                       onView={(view) => console.log(view)}
                       style={{height:700}}
                       defaultView="month"
                       defaultDate={new Date("2026-07-30")}
                        date={currentDate}
                        onNavigate={(date) => {
                            setCurrentDate(date);
                            loadAppointments(date);
                        }}
                       eventPropGetter={(event:any)=>{
                        switch(event.type){
                            case "appointment":
                            return{
                                style:{
                                    backgroundColor:"#259ceb",
                                    borderRadius:"6px",
                                    color:"white",
                                    border:"none"
                                },
                            };

                            case "available":
                                return{
                                    style:{
                                        backgroundColor:"#288f4d",
                                        borderRadius:"6px",
                                        color:"white",
                                        border:"none"
                                    }
                                };
                            
                            case "leave": 
                                return{
                                    style:{
                                        backgroundColor:"#e86c6c",
                                        borderRadius:"6px",
                                        color:"white",
                                        border:"none"
                                    }
                                }
                                
                            default:
                                return{}
                        }
                       }}
                    />
                </div>
            </div>
        </div>
    )
}