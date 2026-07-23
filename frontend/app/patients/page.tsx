'use client';

import { useEffect,useState } from "react";
import { getPatients,deletePatient } from "@/lib/patient";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

import {
    Search,
    Eye,
    Pencil,
    Trash2,
    UserPlus
} from 'lucide-react'


export default function patientPage(){
    const [patients, setPatients] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");


    useEffect(()=>{
        loadPatients()
    },[])


    async function loadPatients(){
        try {
            const response = await getPatients();

            setPatients(response.data)
            setFiltered(response.data)

        } catch (error) {
            console.error('Error:', error)
        }
    }


    function handleSearch(value:string){
        setSearch(value);

        const filteredPatients = patients.filter((patient)=>
        `${patient.firstName} ${patient.lastName}`.toLowerCase()
        .includes(value.toLowerCase())
        )

        setFiltered(filteredPatients)
    }


    async function handleDelete(id:string){
        const confirmDelete = confirm(
            "Delete this patient?"
        );

        if(!confirmDelete) return;

        try {
            await deletePatient(id)

            loadPatients()
        } catch (error) {
            console.log(error)
        }
    } 


    return(
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Patients
                            </h1>

                            <p className="text-gray-500">
                                Manage all registered patients
                            </p>

                        </div>

                        <Link href="/patients/add"
                        className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">
                            <UserPlus size={20}/>
                            Add Patient
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="relative mb-6">

                            <Search size={18}
                            className="absolute left-4 top-4 text-gray-400"/>

                            <input placeholder="Search Patient..."
                            value={search}
                            onChange={(e)=> handleSearch(e.target.value)}
                            className="w-full border rounded-xl pl-11 pr-4 py-3"
                            />

                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-4">#</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Blood</th>
                                    <th>Gender</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((patient,index)=>(
                                    <tr className="border-b hover:bg-gray-50"
                                    key={patient._id}>

                                        <td className="py-4">
                                            {index+1}
                                        </td>

                                        <td>
                                            {patient.firstName}{" "}
                                            {patient.lastName}
                                        </td>

                                        <td>{patient.phone}</td>
                                        <td>{patient.bloodGroup}</td>
                                        <td>{patient.gender}</td>

                                        <td>
                                            <div className="flex justify-center gap-3">

                                                <Link href={`/patients/${patient._id}`}
                                                className="text-blue-600">
                                                    <Eye size={18}/>
                                                </Link>

                                                <Link href={`/patients/edit/${patient._id}`}
                                                className="text-green-600">
                                                  <Pencil size={18}/>
                                                </Link>

                                                <button onClick={()=>
                                                    handleDelete(patient._id)}
                                                    className="text-red-600">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

            </div>
        </div>
    )
}