
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Eye, EyeOff, HeartPulse, Lock, Mail, Phone, ShieldCheck, User, UsersRound } from "lucide-react";
import { registerUser, verifyEmailOTP, resendVerificationOTP } from "@/lib/auth";

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

  const [form, setForm] = useState<Form>(initialForm);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

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
    if (form.password.length < 8)
       return setError("Use a password with at least 8 characters.");

    if (form.phone.length !== 10)
       return setError("Phone number must be exactly 10 digits.");


    if (form.password !== form.confirmPassword) 
      return setError("The passwords do not match.");

    if (form.role === "doctor" && !form.specialization.trim())
      return setError("Please enter your specialization.");


    try {
      setLoading(true);

      await registerUser({ 
        name: form.name, 
        email: form.email, 
        phone: form.phone, 
        password: form.password, 
        role: form.role,
        ...(form.role === "doctor" ? { specialization: form.specialization } : {})
      });

      setSuccess(true);
      setRegisteredEmail(form.email);
      setStep(2);
      setSuccess(false); // Reset success to show OTP step cleanly
      setError("");

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
    }
  }

  async function handleVerifyOTP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (otp.length !== 6) return setError("OTP must be 6 digits.");

    try {
      setLoading(true);
      await verifyEmailOTP({ email: registeredEmail, otp });
      setSuccess(true);
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (caughtError: unknown) {
      const message = typeof caughtError === "object" && caughtError !== null && "response" in caughtError ?
        (caughtError as any).response?.data?.message : undefined;
      setError(message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOTP() {
    setError("");
    try {
      setLoading(true);
      await resendVerificationOTP({ email: registeredEmail });
      setError("New OTP sent to your email!");
    } catch (caughtError: unknown) {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  return(
  <main className="relative grid min-h-screen overflow-hidden bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">

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
            Clinic ERP
          </span>
        </div>

      <div className="relative max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 
        bg-white/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
          
          <UsersRound size={14} />
          Built for connected care
          </div>
          
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight xl:text-6xl">
            Start managing
            <br />
            <span className="text-cyan-300">care with clarity.
              </span>

              </h1>
              
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Create your secure Clinic ERP account and bring every part
                 of your practice into one modern workspace.
                 </p>
            </div>


      <div className="relative flex items-center gap-3 border-t border-white/10 pt-8 text-sm text-slate-200">
      <ShieldCheck className="text-cyan-300" size={20} />
      Your account is protected with secure role-based access.
      </div>


    </motion.section>

    <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} 
      transition={{ duration: 0.5, delay: 0.1 }} 
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-9">

      <div className="mb-7 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          
          <HeartPulse className="text-cyan-600" size={23} />
          Clinic ERP
          </div>
          
          </div>


      <div>
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
          
          <User size={22} />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {step === 1 ? "Create your account" : "Verify your email"}
            </h2>
            
            <p className="mt-2 text-sm text-slate-500">
              {step === 1 ? "Enter your details to get started." : `Enter the 6-digit code sent to ${registeredEmail}`}
              </p>
              
              </div>


      {step === 1 ? (
      <form onSubmit={handleSubmit} className="mt-7 space-y-4">

        <Field label="Full name" icon={<User size={18} />}>

        <input 
          required 
          autoComplete="name" 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Your name" 
          className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm 
          text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 
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
          className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition 
          placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" />

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
          className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none 
          transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" 
        />
        
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field 
          label="Password" 
          icon={<Lock size={18} />}>
            
            <input 
            required 
            minLength={8} 
            autoComplete="new-password" 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            placeholder="8+ characters" 
            className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-800 
            outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 
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
              className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm text-slate-800 
              outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 
              focus:ring-cyan-100" />
              
              <Toggle 
              onClick={() => setShowConfirmPassword((value) => !value)}
               shown={showConfirmPassword} />
               
               </Field>
               
               </div>


        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            Account type
            </span>
            
            <select 
            required 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none 
            transition hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100">
              
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="admin">Administrator</option>
                </select>
                
                </label>

        {form.role === "doctor" && (
          <Field label="Specialization" icon={<HeartPulse size={18} />}>
            <input 
              required 
              name="specialization" 
              value={form.specialization} 
              onChange={handleChange} 
              placeholder="e.g. Cardiology, Pediatrics, General Medicine" 
              className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm 
              text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 
              focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" 
            />
          </Field>
        )}


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
              {success ? "Account created. Redirecting to sign in..." : error}
              
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
      ) : (
      <form onSubmit={handleVerifyOTP} className="mt-7 space-y-4">
        <Field label="Verification Code" icon={<Lock size={18} />}>
          <input
            required
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 text-center tracking-widest text-lg font-semibold"
          />
        </Field>

        <AnimatePresence>
          {(error || success) && 
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <p role={error ? "alert" : "status"} className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-sm ${success ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}>
              <CheckCircle2 size={17} />
              {success ? "Email verified. Redirecting to sign in..." : error}
            </p>
          </motion.div>}
        </AnimatePresence>

        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading || success} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-70">
          {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
          {loading ? "Verifying..." : "Verify Code"}
        </motion.button>
        
        <button type="button" onClick={handleResendOTP} disabled={loading} className="mt-4 w-full text-center text-sm font-medium text-cyan-700 transition hover:text-cyan-900 hover:underline">
          Resend code
        </button>
      </form>
      )}

      <p className="mt-7 text-center text-sm text-slate-500">
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
      
      <span className="pointer-events-none absolute left-3.5 top-[37px] text-slate-400">
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
        className="absolute right-3 top-[37px] rounded-md p-1 text-slate-400 transition hover:text-cyan-600 
        focus:outline-none focus:ring-2 focus:ring-cyan-400">

        {shown ? <EyeOff size={18} /> 
        : <Eye size={18} />}
        </button>
        
   ) 
}