"use client";
import {motion} from "framer-motion"
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, HeartPulse, Eye, EyeOff } from "lucide-react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        email:"",
        password:"",
    })

    const router = useRouter()
    const [error, setError] = useState("")


    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        setError("")
        
        try {
          setLoading(true)
          
          const data = await loginUser({
            email: form.email,
            password: form.password,
          })

          console.log(data)

          console.log("Login Response:", data)

          //store jwt
          localStorage.setItem("token", data.token)
          localStorage.setItem("user", JSON.stringify(data.user))
          

          alert("Login Successfull!")

          router.push("/dashboard");

        } catch (err: any) {

          setError(
            err.response?.data?.message || "Invalid email or password"
          );

        }finally{

          setLoading(false)

        }

        await new Promise(resolve => setTimeout(resolve,2000))
        
        console.log(form)

        setLoading(false)
        
    }


  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-slate-100 via-blur-50 to-slate-200">

      {/* Left Side */}
      <motion.div 
        initial={{x:-100, opacity:0}}
        animate={{x:0, opacity:1}}
        transition={{duration:0.8}}
        className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-500 text-white p-20">
          
        <div className="flex items-center gap-3 mb-8">
          <HeartPulse size={42} />
          <h1 className="text-4xl font-bold">
            Clinic ERP
          </h1>
        </div>

        <h2 className="text-5xl font-bold leading-tight">
          Smart Healthcare
          <br />
          Management
        </h2>

        <p className="mt-6 text-lg text-blue-100 max-w-md">
          Manage patients, appointments, billing and reports from one modern dashboard.
        </p>

        <div className="mt-10 space-y-3 text-lg">
          <p>✔ Secure Login</p>
          <p>✔ Patient Records</p>
          <p>✔ Billing System</p>
          <p>✔ Appointment Scheduling</p>
        </div>

      </motion.div>

      {/* Right Side */}

      <div className="flex items-center justify-center p-8">

        <motion.div
          initial={{opacity:0, y:40}}
          animate={{opacity:1, y:0}}
          transition={{
            duration:0.6,
            ease:"easeOut",
          }} 
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-xl p-12 border border-gray-100 transition-all duration-300">

          <h2 className="text-3xl font-bold text-center">
            Welcome Back
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Login to your account
          </p>

          <form className="space-y-5 mt-8"
          onSubmit={handleSubmit}>
            <div className="relative">

              <Mail
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="email"
                value={form.email}
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            <div className="relative">
            <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
            />

            <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl border 
                transition-all duration-300
                outline-none focus:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>

            {error &&(
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading?(
                <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Logging in...
                </>
              ):("Login")}
            </button>

            <Link href='/forgot-password'
               className="text-blue-600 text-sm hover:underline">
               Forgot Password?
            </Link>

          </form>

          <p className="text-center mt-6 text-sm">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="text-blue-600 font-semibold hover:text-blue-800 transition duration-300"
            >
              Register
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}