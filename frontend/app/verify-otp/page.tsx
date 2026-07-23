"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { verifyResetOTP } from "@/lib/forgotPassword";


export default function verifyOTPPage(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || ""

    const [otp, setOtp] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")


    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            await verifyResetOTP(email, otp);

            alert("OTP Verified!")

            router.push(`/reset-password?email=${encodeURIComponent(
                    email
                )}&otp=${encodeURIComponent(otp)}`
            )


        } catch (error: any) {
            setError(
                error.reposne?.data?.message || "Invalid OTP"
            )
        }finally{
            setLoading(false)
        }
    }



    return(
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-700 to-blue-500 text-white p-20">

                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-bold">
                        Clinic ERP
                    </h1>
                </div>

                <h2 className="text-5xl font-bold">
                    Verify
                    <br/>
                    OTP
                </h2>

                <p className="mt-6 text-lg text-blue-100 max-w-md">
                    Enter the OTP sent to your email
                </p>

            </div>

            <div className="flex justify-center items-center p-8">
                <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">
                    <h2 className="text-3xl font-bold text-center">
                        Verify OTP
                    </h2>

                    <p className="text-center text-gray-500 mt-2">
                        {email}
                    </p>

                    <form className="space-y-5 mt-8">

                        <div className="relative">

                            <ShieldCheck size={20}
                            className="absolute left-4 top-4 text-gray-400"/>

                            <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                            required/>

                        </div>

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                        type="submit"
                        disabled={loading}
                         className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                    </form>

                    <p className="text-center mt-6">
                        <Link href="/forgot-password"
                        className="text-blue-600 font-semibold">
                            Back
                        </Link>
                    </p>
                    
                </div>
            </div>
        </div>
    )
}