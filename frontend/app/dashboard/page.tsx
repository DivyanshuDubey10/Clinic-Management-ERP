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

  const [userRole, setUserRole] = useState("");

  const [stats, setStats] = useState({
    totalPatients:0,
    totalDoctors:0,
    totalAppointments:0,
    pendingAppointments:0,
    completedAppointments:0,
    cancelledAppointments:0
  });

  const [isChecking, setIsChecking] = useState(true);

  //if someone types url of dashboard manually -> redirect em to login page
  useEffect(()=>{
    const token = localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");
    
    if(!token){
      router.push("/login")
      return
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role?.toLowerCase() || "");
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    }
    
    setIsChecking(false);
    loadDashboard();

  },[router]);



  async function loadDashboard(){
    try {
      const response = await getDashboard();

      if (response.data && response.data.statistics) {
        const s = response.data.statistics;
        setStats({
          totalPatients: s.totalPatients || 0,
          totalDoctors: s.totalDoctors || 0,
          totalAppointments: s.totalAppointments || 0,
          pendingAppointments: s.bookedAppointments || 0,
          completedAppointments: s.completedAppointments || 0,
          cancelledAppointments: s.cancelledAppointments || 0
        });
      }

    } catch (error) {
      console.error(error)
    }
  }

  if (isChecking) {
    return null; // Prevent flash of protected content
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-muted/30 min-h-screen">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-foreground">
            Dashboard
          </h1>

            {(userRole === "admin" || userRole === "receptionist") && <StatCards stats={stats}/>}

            <RecentAppointments/>

            <QuickActions/>

        </div>
      </div>
    </div>
  );
}