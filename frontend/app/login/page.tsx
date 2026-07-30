
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Eye, EyeOff, HeartPulse, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { loginUser } from "@/lib/auth";

const benefits = ["Secure, role-based access", "Complete patient records", "Billing and appointments in one place"];

export default function LoginPage() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault();
    setError("");
    setLoading(true);

    try {

      const data = await loginUser(form);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role?.toLowerCase()) {

        case "doctor": router.push("/dashboard/doctor"); break;

        case "patient": router.push("/patient-portal/dashboard"); break;

        default: router.push("/dashboard");
      }

    } catch (caughtError: unknown) {

      const message = typeof caughtError === "object" 
      && caughtError !== null && "response" in caughtError

        ? (caughtError as { response?: 
          { data?: { message?: string } } }).response?.data?.message
        : undefined;

      setError(message || "Invalid email or password. Please try again.");
      
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">

      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />

      <motion.section initial={{ opacity: 0, x: -32 }}
         animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} 
         className="relative hidden overflow-hidden bg-slate-950 px-12 py-16 text-white 
         lg:flex lg:flex-col lg:justify-between xl:px-20">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,
        rgba(34,211,238,.24),transparent_26%),radial-gradient(circle_at_85%_75%,
        rgba(59,130,246,.35),transparent_30%)]" />

        <div className="relative">
            <div className="flex items-center gap-3">

               <div className="grid h-11 w-11 place-items-center rounded-xl 
                  bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20">

                     <HeartPulse size={24} strokeWidth={2.6} />
                </div>

                 <span className="text-xl font-bold tracking-tight">
                   Clinic ERP
                  </span>
            </div>
        </div>

        <div className="relative max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full 
           border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-100">

            <Sparkles size={14} />

             Smarter clinic operations 

        </div>
          
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
              Care, coordinated.
              <br />

            <span className="text-cyan-300">
              Everything, simplified.
              </span>

          </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                A secure workspace for your team to manage patients, 
                appointments, billing, and care from a single place.
                </p>

      </div>


        <div className="relative space-y-3 border-t border-white/10 pt-8">

           {benefits.map((benefit, index) => 
            <motion.div key={benefit} initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.1 }} 

            className="flex items-center gap-3 text-sm text-slate-200">

              <CheckCircle2 size={18} className="text-cyan-300" />
                 {benefit}

              </motion.div>)}

        </div>

      </motion.section>

      <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">

        <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} 
          className="w-full max-w-md rounded-3xl border border-slate-200 
             bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-9">

          <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                  <HeartPulse className="text-cyan-600" size={23} />
                  Clinic ERP
              </div>
           </div>


          <div>
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-600">

              <ShieldCheck size={22} />
            </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome back
                </h2>


                <p className="mt-2 text-sm text-slate-500">
                  Enter your details to access your workspace.
                  </p>
            </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <Field label="Email address" icon={<Mail size={18} />}>

              <input 
              required 
              autoComplete="email" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="you@clinic.com" 
              className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 
              outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" />

            </Field>

            <Field 
              label="Password" 
              icon={<Lock size={18} />}>
                
              <input required 
              autoComplete="current-password" 
              type={showPassword ? "text" : "password"} 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="Enter your password"

              className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-11 
              text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 
              focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" />
             
             <button 
              type="button" 
              onClick={() => setShowPassword((value) => !value)} 
              aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-[37px] rounded-md p-1 text-slate-400 transition hover:text-cyan-600 
                focus:outline-none focus:ring-2 focus:ring-cyan-400">

                {showPassword 
                ? <EyeOff size={18} /> 
                : <Eye size={18} />}

                </button>
            </Field>

            <div className="flex justify-end">
              <Link href="/forgot-password" 
              className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-900 hover:underline">
                Forgot password?
                </Link>
                </div>

            <AnimatePresence>
              {error && <motion.div initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
               className="overflow-hidden">
                
                <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                  {error}
                  </p>
                  
                  </motion.div>}
                  
                  </AnimatePresence>


            <motion.button whileHover={{ y: -1 }} 
            whileTap={{ scale: 0.99 }}
             type="submit" 
             disabled={loading} 
             className="flex h-12 w-full items-center justify-center gap-2
              rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition 
              hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-70">
                {loading && 
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                {loading ? "Signing in..." : "Sign in"}
                
                </motion.button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don&apos;t have an account?
             <Link href="/register" 
             className="font-semibold text-cyan-700 transition hover:text-cyan-900 hover:underline">
              Create one
              </Link>
              
              </p>

        </motion.div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return <label 
  className="relative block">
    <span className="mb-2 block text-sm font-medium text-slate-700">
      {label}
      </span>
      <span className="pointer-events-none absolute left-3.5 top-[37px] text-slate-400">
        {icon}
        </span>
        {children}
        </label>;
}
