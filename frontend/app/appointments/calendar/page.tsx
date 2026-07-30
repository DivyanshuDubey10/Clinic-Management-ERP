"use client"

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from  "react-big-calendar" ;
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllAvailability } from "@/lib/availability";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import api from "@/lib/api";

const localizer = momentLocalizer(moment);

export default function AppointmentCalendar(){
    const [events, setEvents] = useState<any[]>([])

    useEffect(()=>{
        loadAppointments();
    },[])


    async function loadAppointments(){
        try {
            const startDate = moment().startOf("month").format("YYYY-MM-DD");
            const endDate = moment().endOf("month").format("YYYY-MM-DD")

            const token = localStorage.getItem("accessToken");

            const response = await api.get(
                `/appointments?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )


            const data = response.data.map((appointment: any)=>({

                title: `${appointment.patientId?.firstName} ${appointment.patientId?.lastName}`,
                start: new Date(
                    `${appointment.date.split("T")[0]}T${appointment.timeslot}`
                ),

                end: moment(
                    `${appointment.date.split("T")[0]}T${appointment.timeslot}`
                ).add(15,"minutes").toDate(),

                type:"appointment",

            }))
            
            setEvents(data)
            
        } catch (error) {
            console.error(error)
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
                       style={{height:700}}
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