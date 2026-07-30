"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import { FileText, Upload, Download } from "lucide-react"


export default function LabResultPage(){

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const reports = [
        {
            id:1,
            test: "Complete Blood Count (CBC)",
            date: "24 Jul 2026",
            file: "cbc-report.pdf"
        },{
            id:2,
            test:"Chest X-Ray",
            date:"24 Jul 2026",
            file:"chest-xray.png"
        }
    ];


    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        

        //upload api
    }


    return(
        <div className="flex bg-gray min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <div className="p-6 space-y-6">
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="  text-2xl font-semibold mb-5">
                            Upload Lab Report
                        </h2>


                        <form onSubmit={handleSubmit}
                        className="space-y-5">

                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e)=> setSelectedFile(e.target.files ? e.target.files[0] : null)}
                              className="border p-3 rounded-lg w-full"
                            />

                            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                                <Upload size={18}/>

                                Upload Report
                            </button>

                        </form>
                    </div>


                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-2xl font-semibold mb-5">
                            Previous Reports
                        </h2>

                        <table className="w-full">
                            <thead className="bg-gray-100">

                                <tr>
                                    <th className="p-3 text-left">Test</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">File</th>
                                    <th className="p-3 text-left">Action</th>
                                </tr>

                            </thead>

                            <tbody>
                                {reports.map((report) => (

                                    <tr key={report.id}
                                    className="border-b">

                                        <td className="p-3">
                                            {report.test}
                                        </td>

                                        <td className="p-3">
                                            {report.date}
                                        </td>
                                        
                                        <td className="p-3 flex items-center gap-2">
                                            {report.file}
                                        </td>

                                        <td className="p-3">

                                            <button className="flex items-center gap-2 text-blue-500">
                                                <Download size={18}/>
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    )
}