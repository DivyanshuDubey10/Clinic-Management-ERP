"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPatient } from "@/lib/patient"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import { Phone } from "lucide-react"


export default function AddPatientPage(){
    const router = useRouter();

    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        firstName:"",
        lastName:"",
        gender:"",
        dateOfBirth:"",
        phone:"",
        email:"",
        address:"",
        bloodGroup:"",
        allergies:"",
        medicalHistory:"",
        emergencyPhone:"",
        emergencyName:"",
        emergencyRelation:"",
    })

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ){
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setLoading(true);

        try {
            await createPatient({
                firstName: form.firstName,
                lastName: form.lastName,
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                phone: form.phone,
                email: form.email,
                address: form.address,
                bloodGroup: form.bloodGroup,

                allergies: form.allergies
                ? form.allergies.split(",").map((a)=>a.trim())
                :[],

                medicalHistory: form.medicalHistory
                ? form.medicalHistory.split(",").map((m)=>m.trim())
                :[],

                emergencyContact:{
                    name:form.emergencyName,
                    phone:form.emergencyPhone,
                    emergencyRelation:form.emergencyRelation
                }
            });

            alert("Patient added successfully!")

            router.push("/patients");

        } catch (err:any) {
            console.error("Created Patient Error:",err);
            console.error("Response:", err.response?.data)

            alert(
                err.response?.data?.message || "Failed to add patient"
            );

        }finally{

            setLoading(false)

        }
    }


    return(
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-white rounded-2xl shadow p-8 max-w-4xl mx-auto">
                        <h1>Add Patient</h1>

                        <form onSubmit={handleSubmit}
                        className="grid grid-cols-2 gap-5">

                            <input name="firstName"
                                placeholder="First Name"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.firstName}
                            />

                            <input name="lastName"
                                placeholder="Last Name"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.lastName}
                            />

                            <select name="gender"
                            className="border p-3 rounded-lg"
                            onChange={handleChange}
                            value={form.gender}>
                                <option value="">Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>


                            <input
                                type="date"
                                name="dateOfBirth"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.dateOfBirth}
                            />

                            <input
                                name="phone"
                                placeholder="Phone"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.phone}
                            />

                            <input
                                name="email"
                                placeholder="Email"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.email}
                            />

                            <input
                                name="bloodGroup"
                                placeholder="Blood Group"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.bloodGroup}
                            />

                            <input
                                name="address"
                                placeholder="Address"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.address}
                            />

                            <input
                                name="allergies"
                                placeholder="Allergies (comma separated)"
                                className="border p-3 rounded-lg col-span-2"
                                onChange={handleChange}
                                value={form.allergies}
                            />

                            <input
                                name="medicalHistory"
                                placeholder="Medical History (comma separated)"
                                className="border p-3 rounded-lg col-span-2"
                                onChange={handleChange}
                                value={form.medicalHistory}
                            />

                            <input
                                name="emergencyName"
                                placeholder="Emergency Contact Name"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.emergencyName}
                            />

                            <input
                                name="emergencyPhone"
                                placeholder="Emergency Contact Phone"
                                className="border p-3 rounded-lg"
                                onChange={handleChange}
                                value={form.emergencyPhone}
                            />

                            <input
                                name="emergencyRelation"
                                placeholder="Relation"
                                className="border p-3 rounded-lg col-span-2"
                                onChange={handleChange}
                                value={form.emergencyRelation}
                            />


                            <button type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white py-3 rounded-xl col-span-2 hover:bg-blue-700">
                                    {loading ? "Adding..." : "Add Patient"}
                            </button>


                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}