"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    CreditCard,
    BarChart3,
    Settings,
    HeartPulse,
} from 'lucide-react';
import {User} from "lucide-react"

const links = [
    {
        name:"Dashboard",
        href:"/dashboard",
        icon:LayoutDashboard
    },
    {
        name:"Patients",
        href:'/patients',
        icon: Users
    },
    {
        name:"Appointments",
        href:"/appointments",
        icon:CalendarDays,
    },
    {
        name:"Billing",
        href:"/billing",
        icon: CreditCard
    },
    {
        name:"Reports",
        href:"/reports",
        icon:BarChart3,
    },
    {
        name:"Settings",
        href:"/settings",
        icon: Settings
    },
    {
        name:"Profile",
        href:'/profile',
        icon:User
    }
];

export default function Sidebar(){

    const pathname = usePathname();

    return(
      <aside className='w-72 bg-slate-900 text-white flex flex-col min-h-screen'>
        <div className='p-8 border border-slate-700'>
            <div className='flex items-center gap-3'>
                <HeartPulse size={34} className='text-blue-400'/>

                <div>
                    <h1 className='text-2xl font-bold'>
                        Clinic ERP
                    </h1>

                    <p className='text-slate-400 text-sm'>
                        Management System
                    </p>
                </div>
            </div>
        </div>

        <nav className='flex-1 px-5 py-8 space-y-2'> 
            {links.map((link)=>{
                const Icon = link.icon;

                const active = pathname === link.href;

                return(
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition
                        ${active?"bg-blue-600 text-white": "text-slate-300 hover:bg-slate-800"}
                    `}>
                        <Icon size={20}/>
                        {link.name}
                    </Link>
                )
            })}
        </nav>

        <div className='p-6 border-t border-slate-700'>
            <div className='bg-slate-800 rounded-xl p-4'>
                <p className='text-sm text-slate-400'>
                    Clinic ERP
                </p>

                <h3 className='font-semibold mt-1'>
                    Version 1.0
                </h3>
            </div>
        </div>
      </aside>
    )
}