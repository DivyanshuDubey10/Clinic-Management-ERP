"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { User, Mail, Phone, Lock, Eye, EyeOff, HeartPulse } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    role:"",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("");

    if(form.password !== form.confirmPassword){
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name:form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role:form.role,
      });

      alert("Registration Successful");

      router.push("/login");

    } catch (err: any) {

      setError(
        err.response?.data?.message || "Registration Failed"
      );

    }finally{

      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-500 text-white p-20">

        <div className="flex items-center gap-3 mb-8">
          <HeartPulse size={42} />
          <h1 className="text-4xl font-bold">
            Clinic ERP
          </h1>
        </div>

        <h2 className="text-5xl font-bold">
          Create
          <br />
          Your Account
        </h2>

        <p className="mt-6 text-lg text-blue-100 max-w-md">
          Join the Clinic ERP platform and manage healthcare efficiently.
        </p>

      </div>

      <div className="flex items-center justify-center p-8">

        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

          <h2 className="text-3xl font-bold text-center">
            Register
          </h2>

          <p className="text-center text-gray-500 mt-2">
            Create a new account
          </p>

          <form className="space-y-4 mt-8" onSubmit={handleSubmit}>

            <Input icon={<User size={20} />} placeholder="Name" name="name" value={form.name} onChange={handleChange} type="text" />
            <Input icon={<Mail size={20} />} placeholder="Email" name="email" value={form.email} onChange={handleChange} type="email" />
            <Input icon={<Phone size={20} />} placeholder="Phone Number" name="phone" value={form.phone} onChange={handleChange} type="tel" />
            <Input icon={<Lock size={20} />} placeholder="Password" name="password" value={form.password} onChange={handleChange} type="password" />
            <Input icon={<Lock size={20} />} placeholder="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" />

            {error &&(
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            

            <select name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500">
                <option value="patient">Patient</option>
                <option value="admin">Admin</option>
            </select>


            <button type="submit" disabled={loading}
             className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex justify-center items-center gap-2">
              {loading ? (
                <>
                 <div className="w-5 h-5 border-2 border-whote border-t-transparent rounded-full animate-spin"></div>
                  Registering...
                </>
              ):(
                "Register"
              )}
            </button>

          </form>

          <p className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

function Input({
  icon,
  placeholder,
  type,
  name,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  type: string;
  name:string;
  value:string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-4 text-gray-400">
        {icon}
      </div>

      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}