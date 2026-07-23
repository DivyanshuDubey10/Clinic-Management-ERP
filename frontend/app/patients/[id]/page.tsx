"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getPatientId } from "@/lib/patient"
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function PatientDetailsPage(){
    const {id} = useParams();

    const [patient, setPatient] = useState<any>(null)
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        loadPatient();
    },[])

    async function loadPatient() {
        try {

            const response = await getPatientId(id as string);
            setPatient(response.data)

        } catch (err) {
            console.error(err)
        }finally{
            setLoading(false)
        }
    }

    if(loading)
        return(
            <div className="flex">
                <Sidebar/>

                <div className="flex-1">
                    <Navbar/>
                    <main className="p-8">Loading...</main>
                </div>
            </div>
        )
    

    return(
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <div className="bg-white rounded-2xl shadow p-8">

                        <h1 className="text-3xl font-bold mb-8">
                            Patient Details
                        </h1>

                        <div className="grid grid-cols-2 gap-6">

                            <Info title="First Name" value={patient.firstName}/>
                            <Info title="Last Name" value={patient.lastName}/>
                            <Info title="Gender" value={patient.gender}/>
                            <Info title="Blood Group" value={patient.bloodGroup}/>
                            <Info title="Phone" value={patient.phone}/>
                            <Info title="Email" value={patient.email}/>
                            <Info title="Address" value={patient.address}/>
                            <Info title="Date of Birth" value={patient.dateOfBirth}/>

                        </div>

                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-3">
                                Allergies
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {patient.allergies?.map((item:string, index:number)=>(
                                    <span key={index}
                                    className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                        {item}
                                    </span>
                                ))}
                            </div>

                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-3">
                                Medical History
                            </h2>

                            <div className="flex flex-wrap gap-2">
                                {patient.medicalHistory?.map((item:string, index:number)=>(
                                    <span key={index}
                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>


                        <div className="mt-10">
                            <h2 className="text-xl font-semibold mb-3">
                                Emergency Contact
                            </h2>

                            <div className="grid grid-cols-3 gap-5">

                                <Info title="Name"
                                value={patient.emergencyContact?.name}/>

                                <Info title="Phone"
                                value={patient.emergencyContact?.phone}/>

                                <Info title="Relation"
                                value={patient.emergencyContact?.relation}/>

                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}


function Info({
    title,
    value
}:{
    title:string;
    value:any
}){
    return(
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="font-semibold text-lg">
                {value || "-"}
            </p>
        </div>
    )
}