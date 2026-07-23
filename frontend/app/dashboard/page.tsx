"use client";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import StatCards from "@/components/dashboard/StatCards";
import RecentAppointments from "@/components/dashboard/RecentAppointments";
import QuickActions from "@/components/dashboard/QuickActions";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboard } from "@/lib/dashboard";


export default function Dashboard() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalPatients:0,
    totalDoctors:0,
    totalAppointments:0,
    pendingAppointments:0,
    completedAppointments:0,
    cancelledAppointments:0
  });

  //if someone types url of dashboard manually -> redirect em to login page
  useEffect(()=>{
    const token = localStorage.getItem("token")

    
    if(!token){
      router.push("/login")
    }
    
    loadDashboard();

  },[router]);



  async function loadDashboard(){
    try {
      const response = await getDashboard();

      setStats(response.data.data)

    } catch (error) {
      console.error(error)
    }
  }


  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-slate-100 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">
            Dashboard
          </h1>

            <StatCards stats={stats}/>

            <RecentAppointments/>

            <QuickActions/>

        </div>
      </div>
    </div>
  );
}