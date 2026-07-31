// "use client";

// import { useEffect, useState } from "react";
// import { Camera, CheckCircle2, CalendarDays } from "lucide-react";

// type User = { name?: string; role?: string };

// export default function ProfileCard() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const loadCachedUser = () => {
//       const cachedUser = localStorage.getItem("user");
//       if (!cachedUser) return;
//       try { setUser(JSON.parse(cachedUser)); } catch { localStorage.removeItem("user"); }
//     };
//     queueMicrotask(loadCachedUser);
//   }, []);

//   const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

//   return (
//     <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
//       <div className="h-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700" />
//       <div className="px-6 pb-6 text-center">
//         <div className="relative -mt-14 mx-auto w-fit">
//           <div className="grid h-28 w-28 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-600 text-4xl font-bold text-white shadow-xl shadow-blue-950/20">{initial}</div>
//           <button type="button" aria-label="Change profile photo" className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-xl border-2 border-white bg-slate-900 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"><Camera size={17} /></button>
//         </div>

//         <h2 className="mt-5 truncate text-xl font-bold tracking-tight text-foreground">{user?.name || "Your profile"}</h2>
//         <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role || "Clinic user"}</p>
//         <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} /> Active account</div>

//         <div className="mt-6 grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100 py-4 text-left">
//           <div className="px-3"><p className="text-xs text-muted-foreground">Account status</p><p className="mt-1 text-sm font-semibold text-card-foreground">Verified</p></div>
//           <div className="px-3"><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={13} />Member since</div><p className="mt-1 text-sm font-semibold text-card-foreground">Jul 2026</p></div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Camera, CheckCircle2, CalendarDays } from "lucide-react";

type User = { name?: string; role?: string };

export default function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadCachedUser = () => {
      const cachedUser = localStorage.getItem("user");
      if (!cachedUser) return;
      try { setUser(JSON.parse(cachedUser)); } catch { localStorage.removeItem("user"); }
    };
    queueMicrotask(loadCachedUser);
  }, []);

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="h-24 bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700" />
      <div className="px-6 pb-6 text-center">
        <div className="relative -mt-14 mx-auto w-fit">
          <div className="grid h-28 w-28 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-600 text-4xl font-bold text-white shadow-xl shadow-blue-950/20">{initial}</div>
          <button type="button" aria-label="Change profile photo" className="absolute -bottom-2 -right-2 grid h-9 w-9 place-items-center rounded-xl border-2 border-white bg-slate-900 text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"><Camera size={17} /></button>
        </div>

        <h2 className="mt-5 truncate text-xl font-bold tracking-tight text-foreground">{user?.name || "Your profile"}</h2>
        <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role || "Clinic user"}</p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={14} /> Active account</div>

        <div className="mt-6 grid grid-cols-2 divide-x divide-slate-100 border-y border-slate-100 py-4 text-left">
          <div className="px-3"><p className="text-xs text-muted-foreground">Account status</p><p className="mt-1 text-sm font-semibold text-card-foreground">Verified</p></div>
          <div className="px-3"><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><CalendarDays size={13} />Member since</div><p className="mt-1 text-sm font-semibold text-card-foreground">Jul 2026</p></div>
        </div>
      </div>
    </section>
  );
}
