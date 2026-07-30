"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { getMyLabOrders, downloadPrescription } from "@/lib/portal";
import { getMyPrescriptions, downloadLabReports } from "@/lib/portal";

export default function ReportPage(){
    const [prescriptions, setPrescription] = useState<any[]>([])
    const [labOrders, setLabOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(()=>{
        loadReports();
    },[])


    async function loadReports() {
        try {
            const [PrescriptionRes, labRes] = await Promise.all([
                getMyPrescriptions(),
                getMyLabOrders(),
            ]);

            console.log("Prescription", PrescriptionRes.data)
            console.log("Lab", labRes.data)

            setPrescription(PrescriptionRes.data);

            setLabOrders(labRes.data)

        } catch (error) {

            console.log(error)
        }finally{

            setLoading(false)
        }
    }

    const reports= [
        {
            name:"Prescription",
            doctor:"Dr. Amit Das",
            date: "20 Jul 2026",
        },
        {
            name: "Blood Test Report",
            doctor: "Diagnostic Lab",
            date: "18 Jul 2026",
        },
        {
            name: "X-Ray Report",
            doctor: "Radiology",
            date: "10 Jul 2026",
        }
    ];


    if(loading){
        return(
            <div className="flex min-h-screen bg-slate-100">
                <Sidebar/>

                <div className="flex-1">
                    <Navbar/>
                    <main className="p-8">Loading reports....</main>
                </div>
            </div>
        )
    }


   return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8 space-y-10">
                  {/* Header */}

                  <div>
                    <h1 className="text-3xl font-bold">
                        Medical Reports
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Access your Prescriptions and Laboratory reports
                    </p>
                  </div>

                  {/* Prescription */}

                  <section>
                    <h2 className="text-2xl font-semibold mb-5">
                        Prescription
                    </h2>

                    {prescriptions.length === 0 ? (
                        <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
                            No prescriptions available
                        </div>

                    ):(
                        <div className="grid gap-5">
                            {prescriptions.map((prescription)=>(
                                <div
                                  key={prescription._id}
                                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                                >
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                Dr. {prescription.doctorId?.name}
                                            </h3>

                                            <p className="text-slate-500">
                                                {prescription.doctorId?.specialization}
                                            </p>

                                            <p className="text-sm text-slate-400 mt-2">
                                                {new Date(
                                                    prescription.createdAt
                                                ).toLocaleDateString()}

                                            </p>

                                        </div>


                                        <button
                                          onClick={()=> downloadPrescription(prescription._id)}
                                          className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition"
                                        >
                                            Download PDF
                                        </button>

                                    </div>

                                    <div className="mt-6">

                                        <h4 className="font-medium mb-2">
                                            Medications
                                        </h4>

                                        <ul className="space-y-2">
                                            {prescription.medications?.map(
                                                (medicine: any, index:number) => (

                                                    <li
                                                      key={index}
                                                      className="text-slate-600"
                                                    >
                                                        • {medicine.drugName} ({medicine.dosage})
                                                    </li>

                                                )
                                            )}
                                        </ul>

                                    </div>

                                    {prescription.notes && (
                                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                            <p className="text-sm font-medium">
                                                Doctor's Notes
                                            </p>

                                            <p className="text-slate-600 mt-1">
                                                {prescription.notes}
                                            </p>
                                        </div>
                                    )}

                                </div>
                            ))}

                        </div>

                    )}

                  </section>


                  {/* Lab Reports */}
                  <section>

                    <h2 className="text-2xl font-semibold mb-5">
                        Laboratory Reports
                    </h2>

                    {labOrders.length === 0 ? (

                        <div className="bg-white rounded-2xl border p-10 text-center text-center text-slate-500">
                            No Laboratory Reports available
                        </div>

                    ):(
                        
                        <div className="grid gap-5">
                            {labOrders.map((report)=>(

                                <div
                                  key={report._id}
                                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                                >
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <h3 className="text-xl font-semibold">
                                                Dr. {report.doctorId?.name}
                                            </h3>

                                            <p className="text-slate-500">
                                                {report.doctorId?.specialization}
                                            </p>

                                            <p className="text-sm text-slate-400 mt-2">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </p>

                                        </div>

                                        <button
                                          onClick={()=> downloadLabReports(report._id)}
                                          className="border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition"
                                        >
                                            Download Report
                                        </button>

                                    </div>

                                    <div className="mt-6">

                                        <h4 className="font-medium mb-2">
                                            Tests
                                        </h4>

                                        <div className="flex flex-wrap gap-2">
                                            {report.test?.map(
                                                (test:string, index:number) => (

                                                    <span
                                                      key={index}
                                                      className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                                                    >
                                                        {test}
                                                    </span>
                                                )
                                            )}
                                        </div>

                                    </div>


                                    <div className="mt-5">
                                        <span
                                           className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                                               report.status === "Completed"
                                               ? "bg-green-100 text-green-700"
                                               :"bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                  </section>
                </main>
            </div>
        </div>
    );
}