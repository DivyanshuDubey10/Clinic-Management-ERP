// "use client";

// import { Calendar, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

// const details = [
//   { label: "Member since", value: "July 2026", icon: Calendar, iconClass: "bg-blue-50 text-blue-600" },
//   { label: "Last login", value: "Today", icon: Clock, iconClass: "bg-emerald-50 text-emerald-600" },
//   { label: "Account status", value: "Verified", icon: ShieldCheck, iconClass: "bg-violet-50 text-violet-600" },
// ];

// export default function AccountInfo() {
//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
//       <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">Account Information</h2><p className="mt-1 text-sm text-slate-500">Your account activity and security status.</p></div><CheckCircle2 size={20} className="mt-1 text-emerald-500" /></div>
//       <div className="grid gap-3 sm:grid-cols-3">
//         {details.map(({ label, value, icon: Icon, iconClass }) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md"><div className={`grid h-9 w-9 place-items-center rounded-lg ${iconClass}`}><Icon size={18} /></div><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className={`mt-1 text-sm font-semibold ${value === "Verified" ? "text-emerald-600" : "text-slate-800"}`}>{value}</p></div>)}
//       </div>
//     </section>
//   );
// }

"use client";

import { Calendar, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

const details = [
  { label: "Member since", value: "July 2026", icon: Calendar, iconClass: "bg-blue-50 text-blue-600" },
  { label: "Last login", value: "Today", icon: Clock, iconClass: "bg-emerald-50 text-emerald-600" },
  { label: "Account status", value: "Verified", icon: ShieldCheck, iconClass: "bg-violet-50 text-violet-600" },
];

export default function AccountInfo() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-slate-900">Account Information</h2><p className="mt-1 text-sm text-slate-500">Your account activity and security status.</p></div><CheckCircle2 size={20} className="mt-1 text-emerald-500" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {details.map(({ label, value, icon: Icon, iconClass }) => <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md"><div className={`grid h-9 w-9 place-items-center rounded-lg ${iconClass}`}><Icon size={18} /></div><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className={`mt-1 text-sm font-semibold ${value === "Verified" ? "text-emerald-600" : "text-slate-800"}`}>{value}</p></div>)}
      </div>
    </section>
  );
}
