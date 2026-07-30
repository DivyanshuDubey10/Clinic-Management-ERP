"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search, Settings, UserRound, CheckCircle2, Info, AlertTriangle, XCircle, Check } from "lucide-react";
import { getProfile } from "@/lib/auth";
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, type Notification } from "@/lib/notification";

type User = { name?: string; role?: string };

export default function Navbar() {
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadUser() {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const data = await getProfile();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Load notifications
        try {
          const notifData = await getNotifications();
          setNotifications(notifData.data);
          setUnreadCount(notifData.unreadCount);
        } catch (e) {
          console.error("Failed to load notifications", e);
        }

      } catch (error) {
        console.error(error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        router.push("/login");
      }
    }

    loadUser();
  }, [router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  }

  async function handleNotificationClick(notif: Notification) {
    if (!notif.isRead) {
      try {
        await markNotificationAsRead(notif._id);
        setNotifications((prev) => prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }

    if (notif.link) {
      setIsNotificationMenuOpen(false);
      router.push(notif.link);
    }
  }

  async function handleMarkAllAsRead(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case "success": return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "warning": return <AlertTriangle className="text-amber-500" size={18} />;
      case "error": return <XCircle className="text-rose-500" size={18} />;
      case "info":
      default: return <Info className="text-blue-500" size={18} />;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const initials = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 shadow-sm shadow-slate-200/50 backdrop-blur-xl sm:px-6 lg:px-8">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Dashboard</h2>
        </div>
        <p className="mt-1 pl-3 text-sm text-slate-500">Here&apos;s what&apos;s happening at your clinic.</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <span className="sr-only">Search</span>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search patients, records..."
            className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:w-72 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </label>

        <button type="button" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 md:hidden">
          <Search size={20} />
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationMenuRef}>
          <button 
            type="button" 
            aria-label={`Notifications, ${unreadCount} unread`} 
            onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
            className={`relative grid h-10 w-10 place-items-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-cyan-400 ${isNotificationMenuOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full border-2 border-white bg-rose-500 px-0.5 text-[9px] font-bold leading-none text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <div 
            className={`absolute right-0 top-[calc(100%+0.6rem)] w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 transition-all duration-200 ${isNotificationMenuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"}`}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="font-semibold text-slate-800">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead} 
                  className="flex items-center gap-1.5 text-xs font-medium text-cyan-600 transition hover:text-cyan-800"
                >
                  <Check size={14} />
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto mb-2 text-slate-300" size={32} />
                  <p className="text-sm text-slate-500">No notifications yet.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <button
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`flex w-full items-start gap-3 border-b border-slate-50 p-4 text-left transition hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'}`}>
                          {notif.title}
                        </p>
                        <p className={`mt-0.5 text-xs leading-relaxed ${!notif.isRead ? 'text-slate-600' : 'text-slate-500'}`}>
                          {notif.message}
                        </p>
                        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>
                      {!notif.isRead && (
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-1" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((value) => !value)}
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-cyan-200/60">
            {initials}
            </div>

            <div className="hidden min-w-0 lg:block">

              <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                {user?.name || "Loading..."}
                
                </p>

              <p className="max-w-32 truncate text-xs capitalize text-slate-500">
                {user?.role || ""}
                </p>
                
            </div>
            <ChevronDown size={16} 
              className={`hidden text-slate-400 transition-transform duration-200 lg:block 
               ${isProfileMenuOpen ? "rotate-180" : ""}`} 
              />
          </button>

          <div role="menu" className={`absolute right-0 top-[calc(100%+0.6rem)] w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 transition-all duration-200 ${isProfileMenuOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0"}`}>
            <div className="border-b border-slate-100 px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-slate-800">{user?.name || "User"}</p>
              <p className="truncate text-xs capitalize text-slate-500">{user?.role || "Clinic account"}</p>
            </div>
            <button type="button" role="menuitem" onClick={() => router.push("/settings/profile")} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><UserRound size={17} />My profile</button>
            <button type="button" role="menuitem" onClick={() => router.push("/settings")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"><Settings size={17} />Settings</button>
            <div className="my-1 border-t border-slate-100" />
            <button type="button" role="menuitem" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"><LogOut size={17} />Sign out</button>
          </div>
        </div>
      </div>
    </header>
  );
}
