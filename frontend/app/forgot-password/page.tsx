"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, HeartPlus } from "lucide-react";
import { forgotPassword } from "@/lib/forgotPassword";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage(){
    const router = useRouter();

    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        setError("")

        try {
            setLoading(true)

            await forgotPassword(email)

            alert("OTP sent successfully")

            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);

        } catch (error: any) {
            setError(
                error.response?.data?.message || "Failed to send OTP"
            );
        }finally{

            setLoading(false)
        }
    }

    return(
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-500 text-white p-20">
                <div className="flex tems-center gap-3 mb-8">

                    <h1 className="text-4xl font-bold">Clinic ERP</h1>
                </div>

                <h2 className="text-5xl font-bold">
                    Forgot
                    <br/>
                    Password
                </h2>

                <p className="mt-6 text-lg text-blue-100 max-w-md">
                    Enter your registered email 
                </p>
            </div>

            <div className="flex justify-center items-center p-8">
                <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

                    <h2 className="text-3xl font-bold gext-center">
                        Forgot Password
                    </h2>

                    <p className="text-center text-gray-500 mt-2">
                        Enter your registered email to verify OTP
                    </p>

                    <form onSubmit={handleSubmit}
                    className="space-y-5 mt-8">
                        <div className="relative">

                            <Mail size={20}
                            className="absolute left-4 top-4 text-gray-400"/>

                            <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            required
                            className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>

                        {error &&(
                            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}


                        <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                    </form>

                    <p className="ext-center mt-6">
                        <Link href="/login"
                        className="text-blue-600 font-semibold">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}