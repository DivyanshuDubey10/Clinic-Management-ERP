"use client";

import {
  Users,
  CalendarDays,
  IndianRupee,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  LucideIcon,
} from "lucide-react";


type StatCardsProps ={
  stats:{
    totalPatients:number;
    totalDoctors:number;
    totalAppointments:number;
    pendingAppointments:number;
    completedAppointments:number;
    cancelledAppointments:number;
  }
}


export default function StatCards({stats} : StatCardsProps) {

  const today = new Date().toLocaleDateString("em-IN",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
  })

  const cards :{
    title:string;
    value:number;
    icon:LucideIcon;
    change:string;
    positive: boolean;
    color:string;
  }[]=[
    {
      title:"Patients",
      value: stats.totalPatients,
      icon: Users,
      change: "+12%",
      positive: true,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title:"Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      change:"+3",
      positive: true,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      change: "-2%",
      positive: false,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending",
      value: stats.pendingAppointments,
      icon: IndianRupee,
      change: "+5%",
      positive: true,
      color: "bg-yellow-100 text-yellow-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
      {cards.map((card) => {

        const Icon = card.icon;

        return (
         <div
            key={card.title}
            className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
            <div className="flex justify-between">

              <div>
                <p className="text-gray-500">
                  {card.title}
                </p>

                <p className="text-gray-500">
                    {today}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {card.value}
                </h2>

                <div className="flex items-center gap-2 mt-5">

                  {card.positive ? (
                    <TrendingUp className="text-green-500" size={18} />
                  ) : (
                    <TrendingDown className="text-red-500" size={18} />
                  )}

                  <span
                    className={
                      card.positive
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {card.change}
                  </span>

                  <span className="text-gray-400 text-sm">
                    this month
                  </span>

                </div>
              </div>

              <div
                className={`w-16 h-16 rounded-2xl flex justify-center items-center ${card.color}`}>

                <Icon size={30}/>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}