"use client";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { getPatientDashboard } from "@/lib/patientPortal";


export default function PatientPortal(){
  

    const [dashboard, setDashboard] = useState<any>(null)
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
      
        loadDashboard()
    },[])

    async function loadDashboard(){
      
        try{
            const response = await getPatientDashboard();

            
            setDashboard(response.data)

        }catch(err){

            console.error("Patient Dashboard Error:", err)
        }finally{

            setLoading(false)
        }
    }

    const cards = [
        {
            title: "Upcoming Appointments",
            value: dashboard?.upcomingAppointments?.length ?? 0,
            color: "bg-blue-500"
        },
        {
            title:"Prescription",
            value: dashboard?.recentPrescriptions?.length ?? 0,
            color: "bg-green-500"
        },
        {
            title:"Lab Reports",
            value:dashboard?.recentLabOrders?.length ?? 0,
            color:"bg-purple-500"
        },
        {
            title: "Pending Bills",
            value: dashboard?.outstandingInvoices?.length ?? 0,
            color:"bg-red-500"
        },
    ]


    if(loading){
        return(
            <div className="flex min-h-screen bg-muted/30">
                <Sidebar/>

                <div className="flex-1">
                    <Navbar/>

                    <main className="p-8">Loading...</main>
                </div>
            </div>
        )
    }



    return(
        <div className="flex min-h-screen bg-muted/30">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

               <main className="p-8 space-y-8">
  {/* Hero */}
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
    <div className="relative z-10">
      <p className="text-blue-100 text-sm">PATIENT PORTAL</p>

      <h1 className="mt-2 text-4xl font-bold">
        Hello, {dashboard?.profile?.firstName || "Patient"} 
      </h1>

      <p className="mt-3 max-w-2xl text-blue-100">
        Keep track of your appointments, prescriptions, reports and bills from
        one place.
      </p>
    </div>

    <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-card/10"></div>
    <div className="absolute right-32 bottom-0 h-32 w-32 rounded-full bg-card/10"></div>
  </div>

  {/* Stats */}
  <div className="grid gap-6 md:grid-cols-4">
    {cards.map((card) => (
      <div
        key={card.title}
        className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
      >
        <p className="text-sm text-muted-foreground">{card.title}</p>

        <h2 className="mt-3 text-4xl font-bold text-card-foreground">
          {card.value}
        </h2>
      </div>
    ))}
  </div>

  {/* Main Grid */}
  <div className="grid gap-6 lg:grid-cols-3">
    {/* Upcoming Appointment */}
    <div className="lg:col-span-2 rounded-3xl bg-card p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Upcoming Appointment
        </h2>

        <Link
          href="/patient-portal/appointments"
          className="text-blue-600 font-medium hover:underline"
        >
          View All →
        </Link>
      </div>

      {dashboard?.upcomingAppointments?.length ? (
        <div className="mt-6 rounded-2xl bg-muted/30 p-6 border border-border">
          <h3 className="text-xl font-semibold text-foreground">
            {dashboard.upcomingAppointments[0].doctorId?.name}
          </h3>

          <p className="text-muted-foreground">
            {dashboard.upcomingAppointments[0].doctorId?.specialization}
          </p>

          <div className="mt-5 flex flex-wrap gap-6 text-foreground">
            <span>
              📅{" "}
              {new Date(
                dashboard.upcomingAppointments[0].appointmentDate
              ).toLocaleDateString()}
            </span>

            <span>
              🕒{" "}
              {new Date(
                dashboard.upcomingAppointments[0].appointmentDate
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
              {dashboard.upcomingAppointments[0].status}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
          No upcoming appointments.
        </div>
      )}
    </div>

    {/* Quick Actions */}
<div className="rounded-3xl bg-card p-6 shadow-sm border border-border">
  <h2 className="text-2xl font-bold mb-6 text-foreground">
    Quick Actions
  </h2>

  <div className="space-y-3">
    <Link
      href="/patient-portal/appointments"
      className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-muted hover:border-primary"
    >
      <div>
        <p className="font-semibold text-foreground">
          Book Appointment
        </p>
        <p className="text-sm text-muted-foreground">
          Schedule a new consultation
        </p>
      </div>

      <span className="text-muted-foreground text-xl">→</span>
    </Link>

    <Link
      href="/patient-portal/prescriptions"
      className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-muted hover:border-primary"
    >
      <div>
        <p className="font-semibold text-foreground">
          View Prescriptions
        </p>
        <p className="text-sm text-muted-foreground">
          Access your medications
        </p>
      </div>

      <span className="text-muted-foreground text-xl">→</span>
    </Link>

    <Link
      href="/patient-portal/payment"
      className="flex items-center justify-between rounded-xl border border-border px-5 py-4 transition hover:bg-muted hover:border-primary"
    >
      <div>
        <p className="font-semibold text-foreground">
          Bills & Payments
        </p>
        <p className="text-sm text-muted-foreground">
          View and pay invoices
        </p>
      </div>

      <span className="text-muted-foreground text-xl">→</span>
    </Link>
  </div>
</div>

  </div>

  {/* Bottom Cards */}
  <div className="grid gap-6 md:grid-cols-2">
    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Recent Prescriptions
      </h2>

      <p className="mt-4 text-5xl font-bold text-green-600">
        {dashboard?.recentPrescriptions?.length || 0}
      </p>

      <p className="text-muted-foreground mt-2">
        Available prescriptions
      </p>
    </div>

    <div className="rounded-3xl border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Outstanding Bills
      </h2>

      <p className="mt-4 text-5xl font-bold text-red-600">
        {dashboard?.outstandingInvoices?.length || 0}
      </p>

      <p className="text-muted-foreground mt-2">
        Pending invoices
      </p>
    </div>
  </div>
</main>
            </div>
        </div>
    )
}