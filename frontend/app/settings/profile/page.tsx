"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/profile/ProfileCard";
import AccountInfo from "@/components/profile/AccountInfo";
import PersonalInfo from "@/components/profile/PersonalInfo";

const entrance = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-muted/50">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={entrance} transition={{ duration: 0.35 }} className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>Administration</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span className="text-cyan-600">My Profile</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
              <p className="mt-2 text-sm text-muted-foreground">Manage your personal details and account preferences.</p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(34,197,94,0.8)]" /> Profile active
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            <motion.aside initial="hidden" animate="visible" variants={entrance} transition={{ duration: 0.35, delay: 0.08 }}><ProfileCard /></motion.aside>
            <div className="space-y-6 lg:col-span-2 lg:space-y-8">
              <motion.div initial="hidden" animate="visible" variants={entrance} transition={{ duration: 0.35, delay: 0.15 }}><PersonalInfo /></motion.div>
              <motion.div initial="hidden" animate="visible" variants={entrance} transition={{ duration: 0.35, delay: 0.22 }}><AccountInfo /></motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
