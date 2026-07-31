
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Eye, EyeOff, HeartPulse, Lock, Mail, Phone, ShieldCheck, User, UsersRound } from "lucide-react";
import { registerUser } from "@/lib/auth";
import { useLoading } from "@/lib/loading";

type Form = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword:string; 
  role: string;
  specialization: string;
};

const initialForm: Form = { 
  name: "",
  email: "", 
  phone: "", 
  password: "", 
  confirmPassword: "", 
  role: "patient",
  specialization: ""
};

export default function RegisterPage() {

  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState<Form>(initialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) { 
    const { name, value } = event.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, phone: digitsOnly }));
      return;
    }
    setForm((current) => ({ 
      ...current,
       [name]: value

       })
    ); 
 }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {

    event.preventDefault(); 
    setError("");
    if (form.password.length < 6)
       return setError("Use a password with at least 6 characters.");

    if (form.phone.length !== 10)
       return setError("Phone number must be exactly 10 digits.");


    if (form.password !== form.confirmPassword) 
      return setError("The passwords do not match.");


    try {
      setLoading(true);
      showLoading("Creating your account...");

      const data = await registerUser({ 
        name: form.name, 
        email: form.email, 
        phone: form.phone, 
        password: form.password, 
        role: "patient"
      });

      // Auto-login: store tokens from the register response
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);

      window.setTimeout(() => {
        router.push(
          // `/verify-email?email=${encodeURIComponent(form.email)}`
          "/login"
        );
      }, 1000);

      window.setTimeout(() => router.push("/patient-portal"), 1200);
    } catch (caughtError: unknown) {

      const message = typeof caughtError === "object" && 
        caughtError !== null && "response" in caughtError ? 
         (caughtError as { response?: 
        { data?: { message?: string }

        } 
      }).response?.data?.message : undefined;


      setError(message || "We couldn't create your account. Please try again.");

    } finally { 
      setLoading(false);
      hideLoading(); 
    }
  }


  return(
  <main className="relative grid min-h-screen overflow-hidden bg-muted/50 lg:grid-cols-[1.05fr_0.95fr]">

    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />

    <motion.section initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} 
         transition={{ duration: 0.6, ease: "easeOut" }} 
         className="relative hidden overflow-hidden bg-slate-950 px-12 py-16 text-white lg:flex 
         lg:flex-col lg:justify-between xl:px-20">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,.25),transparent_28%),
      radial-gradient(circle_at_85%_75%,rgba(59,130,246,.35),transparent_30%)]" />

      <div className="relative flex items-center gap-3">

          <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400 
             text-slate-950 shadow-lg shadow-cyan-400/20">
              
              <HeartPulse size={24} strokeWidth={2.6} />
              
          </div>
          
          <span className="text-xl font-bold tracking-tight">
            Clinic Patient Portal
          </span>
        </div>

      <div className="relative max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 
        bg-card/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
          
          <UsersRound size={14} />
          Your personal health hub
          </div>
          
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Your health journey
            <br />
            <span className="text-cyan-300">starts here.
              </span>

              </h1>
              
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Create your secure patient account to access your medical records, book appointments, and connect with your doctors.
                 </p>
            </div>


      <div className="relative flex items-center gap-3 border-t border-white/10 pt-8 text-sm text-slate-200">
      <ShieldCheck className="text-cyan-300" size={20} />
      Your medical data is protected with enterprise-grade security.
      </div>


    </motion.section>

    <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ duration: 0.5, delay: 0.1 }} 
      className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl shadow-slate-900/10 sm:p-9">

      <div className="mb-7 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-foreground">
          
          <HeartPulse className="text-cyan-600" size={23} />
          Clinic Patient Portal
          </div>
          
          </div>


      <div>
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
          
          <User size={22} />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Create your account
            </h2>
            
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your details to get started.
              </p>
              
              </div>


      <form onSubmit={handleSubmit} className="mt-7 space-y-4">

        <Field label="Full name" icon={<User size={18} />}>

        <input 
          required 
          autoComplete="name" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Your name" 
          className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm 
          text-card-foreground outline-none transition placeholder:text-muted-foreground hover:border-border 
          focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" 
          />
        
        </Field>


        <Field label="Email address" icon={<Mail size={18} />}>
        
        <input 
          required autoComplete="email" 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          placeholder="you@clinic.com" 
          className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-card-foreground outline-none transition 
          placeholder:text-muted-foreground hover:border-border focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" />

        </Field>


        <Field 
        label="Phone number" 
        icon={<Phone size={18} />}
        >
          
        <input 
          required 
          autoComplete="tel" 
          type="tel" 
          name="phone" 
          value={form.phone} 
          onChange={handleChange} 
          placeholder="10 digit phone number" 
          maxLength={10}
          inputMode="numeric"
          pattern="[0-9]{10}"
          className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-card-foreground outline-none 
          transition placeholder:text-muted-foreground hover:border-border focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" 
        />
        
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field 
          label="Password" 
          icon={<Lock size={18} />}>
            
            <input 
            required 
            minLength={6} 
            autoComplete="new-password" 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="6+ characters" 
            className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-sm text-card-foreground 
            outline-none transition placeholder:text-muted-foreground hover:border-border focus:border-cyan-400 focus:ring-4 
            focus:ring-cyan-100" />
            
            <Toggle 
            onClick={() => setShowPassword((value) => !value)} 
            shown={showPassword} />
            
            </Field>
            
            
            <Field 
            label="Confirm password" 
            icon={<Lock size={18} />}>
              
              <input required 
              autoComplete="new-password" 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              placeholder="Repeat password" 
              className="h-12 w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-sm text-card-foreground 
              outline-none transition placeholder:text-muted-foreground hover:border-border focus:border-cyan-400 focus:ring-4 
              focus:ring-cyan-100" />
              
              <Toggle 
              onClick={() => setShowConfirmPassword((value) => !value)}
               shown={showConfirmPassword} />
               
               </Field>
               
               </div>




        <AnimatePresence>
          {(error || success) && 
          
          <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }} 
          exit={{ opacity: 0, height: 0 }} 
          className="overflow-hidden">
            
            <p role={error ? "alert" : "status"} 
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-sm ${success ? "border-emerald-100 bg-emerald-50 text-emerald-700" 
            : "border-rose-100 bg-rose-50 text-rose-700"}`}>
              
              <CheckCircle2 size={17} />
              {success ? "Account created! Signing you in..." : error}
              
              </p>
              
              </motion.div>}
              
              </AnimatePresence>

        <motion.button 
        whileHover={{ y: -1 }} 
        whileTap={{ scale: 0.99 }} 
        type="submit" 
        disabled={loading || success}
         className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg 
         shadow-slate-900/15 transition hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-100 
         disabled:cursor-not-allowed disabled:opacity-70">
          
          {loading && 
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          
          {loading ? "Creating account..." : "Create account"}
          
          </motion.button>

      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account? 
        
        <Link href="/login" 
        className="font-semibold text-cyan-700 transition hover:text-cyan-900 hover:underline">
          Sign in
          </Link>
          </p>

    </motion.div>
    </section>
  </main>
  )
}

function Field({ label, icon, children }
  : { label: string; icon: ReactNode; children: ReactNode })
   { return <label className="relative block">
    
    <span className="mb-2 block text-sm font-medium text-slate-700">
      {label}
      
      </span>
      
      <span className="pointer-events-none absolute left-3.5 top-[37px] text-muted-foreground">
        {icon}
        </span>
        
        {children}
        
        </label>; }
        
function Toggle({ onClick, shown }
  : { onClick: () => void; 
    shown: boolean 
  }) 
  { 
    return(
      <button 
        type="button" 
        onClick={onClick} 
        aria-label={shown ? "Hide password" : "Show password"} 
        className="absolute right-3 top-[37px] rounded-md p-1 text-muted-foreground transition hover:text-cyan-600 
        focus:outline-none focus:ring-2 focus:ring-cyan-400">

        {shown ? <EyeOff size={18} /> 
        : <Eye size={18} />}
        </button>
   ) 
}