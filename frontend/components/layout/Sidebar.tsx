"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {

  BarChart3,
  CalendarDays,
  ChevronDown,
  CreditCard,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Pill,
  Settings,
  Users,
  User,
} from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";

type MenuItem = {
  title: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  href?: string;
  children?: { title: string; href: string }[];
  roles?: string[]; // Array of roles allowed to see this item
};

const allMenuItems: MenuItem[] = [
  { title: "Dashboard", 
    icon: LayoutDashboard, 
    href: "/dashboard", 
    roles: ["admin", "receptionist"] 
  },
  { title: "Doctor Dashboard", 
    icon: LayoutDashboard, 
    href: "/dashboard/doctor", 
    roles: ["doctor"] 

  },
  { title: "Staff Management", icon: Users, 
    children: [{ title: "All Staff", 
    href: "/staff" }, 
    { title: "Add Staff", 
    href: "/staff/add" }], 
  roles: ["admin"] 
},
  { title: "Patient Management", 
    icon: Users, 
    children: [{ title: "Patients", 
    href: "/patients" }], 
  roles: ["admin", "receptionist", "doctor"] 
},
  { title: "Appointments", 
    icon: CalendarDays, 
    children: [{ title: "Appointments", 
    href: "/appointments" }], 
  roles: ["admin", "receptionist", "doctor"] 
},
  { title: "Pharmacy", 
    icon: Pill, 
    children: [{ title: "Medicine Inventory", 
    href: "/pharmacy" }, 
    { title: "Add Medicine", 
      href: "/pharmacy/add" }, 
    { title: "Dispense Medicine", 
      href: "/pharmacy/dispense" }, 
      { title: "Inventory Alerts", 
        href: "/pharmacy/alerts" }], 
        roles: ["admin", "pharmacist"]
       },
  { title: "Laboratory", 
    icon: FlaskConical, 
    children: [{ title: "Lab Orders", 
    href: "/lab" }, 
    { title: "Create Lab Order", 
      href: "/lab/create" }], 
  roles: ["admin", "doctor"] 
},
  { title: "Billing", 
    icon: CreditCard, 
    children: [{ title: "Generate Invoice", 
    href: "/billing" }, 

    // { title: "Payment Collection", 
    //   href: "/billing/payment" 
    // }, 

    { title: "Invoice History",
       href: "/billing/history" 
      }, 
       { title: "Insurance", 
        href: "/billing/insurance"
       }],
        roles: ["admin", "receptionist"] 
      },
  { title: "Patient Portal", 
    icon: User, 
    children: [{ title: "Dashboard", 
    href: "/patient-portal" }, 
    { title: "Reports", 
      href: "/patient-portal/reports" }, 
    { title: "Billing Payment", 
      href: "/patient-portal/payment" }],
       roles: ["admin", "patient"] 
      },
  { title: "Reports", 
    icon: BarChart3, 
    href: "/dashboard/reports", 
    roles: ["admin"] },
  { title: "Administration", 
    icon: Settings, 
    children: [{ title: "My Profile", 
    href: "/settings/profile" }, 
    { title: "System Settings", 
    href: "/settings" }], 
  roles: ["admin", "doctor", "receptionist", "pharmacist", "patient"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role?.toLowerCase() || "");
      } catch {
        console.error("Failed to parse user role");
      }
    }
  }, []);

  // Filter items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(userRole);
  });

  // Keep the section that owns the current route visible after navigation/refresh.
  // We only want this to run when the pathname actually changes, not on every render.
  useEffect(() => {
    const activeGroup = allMenuItems.find((item) => item.children?.some((child) => pathname === child.href));
    if (activeGroup) setOpenMenu(activeGroup.title);
  }, [pathname]);

  const isCurrentRoute = (href?: string) => href === pathname;

  return (
    <aside
      className={`relative flex min-h-screen flex-col overflow-hidden border-r border-slate-800 bg-slate-950 text-white shadow-2xl transition-[width] duration-300 ease-out ${collapsed ? "w-20" : "w-72"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-500/10 to-transparent" />

      <header className={`relative flex h-24 items-center border-b border-slate-800 transition-all duration-300 ${collapsed ? "justify-center" : "px-4"}`}>
        <div className={`flex min-w-0 items-center gap-3 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "flex-1 opacity-100"}`}>
          <div>
            <h1 className="whitespace-nowrap font-semibold tracking-tight">Clinic ERP</h1>
            <p className="whitespace-nowrap text-xs text-slate-400">Management system</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
        >
          <Menu size={19} />
        </button>
      </header>

      <nav aria-label="Primary navigation" className="relative flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {!collapsed && <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const groupHasActiveChild = item.children?.some((child) => isCurrentRoute(child.href));
          const isOpen = openMenu === item.title;
          const baseClasses = `group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-400/70 ${collapsed ? "justify-center" : "gap-3"}`;
          const stateClasses = isCurrentRoute(item.href) || groupHasActiveChild ? "bg-cyan-400/10 text-cyan-300 shadow-sm shadow-cyan-950/40" : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100";

          return (
            <div key={item.title}>
              {item.href ? (
                <Link href={item.href} title={collapsed ? item.title : undefined} className={`${baseClasses} ${stateClasses}`}>
                  <Icon size={20} strokeWidth={isCurrentRoute(item.href) ? 2.5 : 2} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {isCurrentRoute(item.href) && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => !collapsed && setOpenMenu((value) => (value === item.title ? null : item.title))}
                  aria-expanded={isOpen}
                  title={collapsed ? item.title : undefined}
                  className={`${baseClasses} ${stateClasses} cursor-pointer`}
                >
                  <Icon size={20} strokeWidth={groupHasActiveChild ? 2.5 : 2} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {!collapsed && <><span className="flex-1 truncate text-left">{item.title}</span><ChevronDown size={17} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`} /></>}
                </button>
              )}

              {!collapsed && item.children && (
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="relative ml-6 mt-1 space-y-0.5 border-l border-slate-800 py-1 pl-4">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className={`relative flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200 before:absolute before:-left-[21px] before:h-1.5 before:w-1.5 before:rounded-full ${isCurrentRoute(child.href) ? "bg-cyan-400/10 font-medium text-cyan-300 before:bg-cyan-300 before:shadow-[0_0_10px_rgba(103,232,249,0.8)]" : "text-slate-500 before:bg-slate-700 hover:bg-slate-800/70 hover:text-slate-200"}`}>
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <footer className="relative border-t border-slate-800 p-3">
        <div className={`rounded-xl bg-slate-900/70 transition-all duration-300 ${collapsed ? "p-2" : "p-3"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_9px_rgba(74,222,128,0.9)]" /></div>
            {!collapsed && <div className="min-w-0"><p className="text-xs font-medium text-slate-200">System operational</p><p className="text-[11px] text-slate-500">Clinic ERP · v1.0</p></div>}
          </div>
        </div>
      </footer>
    </aside>
  );
}
