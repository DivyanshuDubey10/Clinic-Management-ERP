"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  User,
  Settings,
  ChevronRight,
  Shield,
  Info,
  Bell,
  Activity
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

type SettingCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  roles: string[]; // roles that can see this card
};

const settingsCards: SettingCard[] = [
  {
    title: "My Profile",
    description: "View and manage your account information.",
    href: "/settings/profile",
    icon: User,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    roles: ["admin", "doctor", "receptionist", "pharmacist", "patient"],
  },
  {
    title: "System Settings",
    description: "Configure clinic wide application preferences.",
    href: "/settings/system",
    icon: Settings,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    roles: ["admin"],
  },
  {
    title: "Notification Preferences",
    description: "Manage how you receive alerts and reminders.",
    href: "/settings/preferences",
    icon: Bell,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    roles: ["admin", "doctor", "receptionist", "pharmacist", "patient"],
  },
  {
    title: "Security",
    description: "Change password and account security.",
    href: "/settings/security",
    icon: Shield,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    roles: ["admin", "doctor", "receptionist", "pharmacist", "patient"],
  },
  {
    title: "Audit Logs",
    description: "View system audit logs and activities.",
    href: "/settings/audit-logs",
    icon: Activity,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    roles: ["admin"],
  }
];

export default function SettingsPage() {
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

  const visibleCards = settingsCards.filter((card) =>
    card.roles.includes(userRole)
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and system settings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  href={card.href}
                  className="bg-card rounded-2xl shadow hover:shadow-lg transition p-6 group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center`}
                      >
                        <Icon size={28} className={card.iconColor} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{card.title}</h2>
                        <p className="text-muted-foreground mt-1">{card.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-blue-600" />
                  </div>
                </Link>
              );
            })}

            {/* About Card (Visible to all) */}
            <div className="bg-card rounded-2xl shadow p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Info size={28} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">About</h2>
                  <p className="text-muted-foreground mt-1">Ziva Care System</p>
                </div>
              </div>
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="font-semibold">v1.1.0</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}