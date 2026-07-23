"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from '@/components/profile/ProfileCard';
import AccountInfo from "@/components/profile/AccountInfo";
import PersonalInfo from "@/components/profile/PersonalInfo";

export default function ProfilePage(){
    return(
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <main className="p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8">
                        My Profile
                    </h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <ProfileCard/>

                        <div className="grid:col-span-2 space-y-8">
                            <PersonalInfo/>
                            <AccountInfo/>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}