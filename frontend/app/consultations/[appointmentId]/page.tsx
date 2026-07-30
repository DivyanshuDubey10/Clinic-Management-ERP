"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function ConsultationPage(){
    const [form, setForm] = useState({
        symptoms:"",
        examination:"",
        diagnosis:"",
        treatmentPlan:"",
        notes:""
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }


    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        
    };


    return(
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <div className="p-6">
                    {/* Patient card */}

                    <div className="bg-white rounded-xl shadow p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Patient Information
                        </h2>

                        <div className="grid md:grid-cols-3">

                            <div>
                                <p className="text-gray-500 text-sm">Patient Name</p>
                                <p className="font medium">Rahul Sharma</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Age</p>
                                <p className="font-medium">28</p>
                            </div>
                            
                            <div>
                                <p className="text-gray-500 text-sm">Gender</p>
                                <p className="font-medium">Male</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Blood Group</p>
                                <p className="font-medium">O+</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Appointment Time</p>
                                <p className="font-medium">10:00 AM</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">Reason</p>
                                <p className="font-medium">Fever</p>
                            </div>

                        </div>
                    </div>


                    {/* SOAP Notes */}

                    <form onSubmit={handleSubmit}
                       className="bg-white rounded-xl shadow p-6 space-y-6"
                    >
                        <h2 className="text-xl font-semibold">
                            SOAP Consultation Note
                        </h2>

                        <div>
                            <label className="font-medium">
                                Subjective (Symptoms)
                            </label>

                            <textarea
                              rows={4}
                              name="symptoms"
                              value={form.symptoms}
                              onChange={handleChange}
                              className="border rounded-lg w-full mt-2 p-3"
                              placeholder="Patient complaints..."
                            />
                        </div>


                        <div>
                            <label className="font-medium">
                                Objective (Examination)
                            </label>

                            <textarea
                            rows={4}
                            name="examination"
                            value={form.examination}
                            onChange={handleChange}
                            className="border rounded-lg w-full mt-2 p-3"
                            placeholder="Clinical Findings..."
                            />

                        </div>


                         <div>

                            <label className="font-medium">
                                Assessment (Diagnosis)
                            </label>

                            <textarea
                                rows={4}
                                name="diagnosis"
                                value={form.diagnosis}
                                onChange={handleChange}
                                className="border rounded-lg w-full mt-2 p-3"
                                placeholder="Diagnosis..."
                            />

                            </div>

                            <div>

                            <label className="font-medium">
                                Plan (Treatment Plan)
                            </label>

                            <textarea
                                rows={4}
                                name="treatmentPlan"
                                value={form.treatmentPlan}
                                onChange={handleChange}
                                className="border rounded-lg w-full mt-2 p-3"
                                placeholder="Treatment plan..."
                            />

                            </div>

                            <div>

                            <label className="font-medium">
                                Additional Notes
                            </label>

                            <textarea
                                rows={4}
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                className="border rounded-lg w-full mt-2 p-3"
                                placeholder="Other observations..."
                            />

                            </div>


                            <div className="flex gap-4">
                                <button type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                                    Save Consultation
                                </button>

                                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                                type="button">
                                    Create Prescription
                                </button>

                                <button type="button"
                                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                                >
                                    Order Lab Test
                                </button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}