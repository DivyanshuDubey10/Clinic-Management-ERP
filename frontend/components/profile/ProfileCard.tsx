"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";


export default function ProfileCard(){
    const [user, setUser] = useState<any>();

    useEffect(()=>{
        const data = localStorage.getItem("user");

        if(data){
            setUser(JSON.parse(data));
        }
    },[])
    return(
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

            <div className="relative w-fit mx-auto">

                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700">
                    <Camera size={19}/>
                </button>

            </div>

            <h2 className="text-2xl font-bold mt-6">
                {user?.name}
            </h2>

            <p className="capitalize text-gray-500">
                {user?.role}
            </p>

            <div className="mt-8 border-t pt-6">
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500">
                        Status
                    </span>

                    <span className="text-green-600 font-semibold">
                        Active
                    </span>

                </div>

                <div className="flex justify-between">
                    <span className="text-gray-500">
                        Member
                    </span>

                    <span>2026</span>
                    
                </div>

            </div>
        </div>
    )
}