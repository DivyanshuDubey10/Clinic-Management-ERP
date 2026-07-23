import Link from "next/link";
import{
    UserPlus,
    CalendarPlus,
    FileText,
    BarChart3,
} from 'lucide-react';

const actions = [
    {
        title:"Add Patient",
        icon:<UserPlus size={28}/>,
        href:"/patients",
    },
    {
        title:"Schedule Appointment",
        icon:<CalendarPlus size={28}/>,
        href:"/appointment"
    },
    {
        title:"Create Invoice",
        icon:<FileText size={28}/>,
        href:"/billing"
    },{
        title:"View Reports",
        icon: <BarChart3 size={28}/>,
        href:"/reports"
    }
];

export default function QuickActions(){
    return(
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-5">
                Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {actions.map((action)=>(
                    <Link key={action.title}
                    href={action.href}
                     className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center justify-center gap-4 hover:-translate-y-1">
                        <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                            {action.icon}
                        </div>

                        <h3 className="font-semibold text-center">
                            {action.title}
                        </h3>
                     </Link>
                ))}
            </div>
        </div>
    )
}