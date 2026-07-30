"use client";

import Link from "next/link";
import {
  User,
  Settings,
  ChevronRight,
  Shield,
  Info,
} from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Administration
            </h1>

            <p className="text-slate-500 mt-2">
              Manage your account and system settings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Profile */}

            <Link
              href="/settings/profile"
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 group"
            >
              <div className="flex justify-between items-center">

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                    <User
                      size={28}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      My Profile
                    </h2>

                    <p className="text-gray-500 mt-1">
                      View and manage your account information.
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className="text-gray-400 group-hover:text-blue-600"
                />

              </div>
            </Link>

            {/* System Settings */}

            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                  <Settings
                    size={28}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    System Settings
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Configure application preferences.
                  </p>
                </div>

              </div>

              <div className="mt-6">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                  Coming Soon
                </span>
              </div>

            </div>

            {/* Security */}

            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
                  <Shield
                    size={28}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Security
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Change password and account security.
                  </p>
                </div>

              </div>

              <div className="mt-6">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
                  Coming Soon
                </span>
              </div>

            </div>

            {/* About */}

            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Info
                    size={28}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    About
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Clinic ERP Management System
                  </p>
                </div>

              </div>

              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">
                  Version
                </p>

                <p className="font-semibold">
                  v1.0.0
                </p>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}