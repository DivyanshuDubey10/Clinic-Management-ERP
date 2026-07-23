"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Lock,
    Eye,
    EyeOff
} from "lucide-react"
import { resetPassword } from "@/lib/forgotPassword";

export default function ResetPasswordPage(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") ||"";
    const otp = searchParams.get("otp") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")


    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()

        setError("");

        if(newPassword !== confirmPassword){
            setError("Password do not match")
            return;
        }

        try {
            setLoading(true)

            await resetPassword(email,otp,newPassword);

            alert("Password reset successfully!")

            router.push("/login");

        } catch (error:any) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password"
            );
        }finally{

            setLoading(false)
        }
    }


    return(
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
            <div className="hidden lg:flex flex-cols justify-center bg-gradient-to-br from-blue-500 text-white p-20">

                <div className="flex items-center gap-3 mb-8">
                    <h1 className="text-4xl font-bold">
                        Clinic ERP
                    </h1>
                </div>

                <h2 className="text-5xl font-bold">
                    Reset
                    <br/>
                    Password
                </h2>

                <p className="mt-6 text-lg text-blue-100 max-w-md">
                    Create a strong new password to secure your account
                </p>
            </div>


            <div className="flex justify-center items-center p-8">
                <div className="bg-white shadow-2xl rounded-3xl w-full max-w-md p-10">

                    <h2 className="text-3xl font-bold text-center">
                        Reset Password
                    </h2>

                    <p className="text-center text-gray-500 mt-2">
                        {email}
                    </p>

                    <form className="space-y-5 mt-8"
                       onSubmit={handleSubmit}>

                       <div className="relative">

                        <Lock size={20}
                        className="absolute left-4 top-4 text-gray-400"/>

                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e)=> setNewPassword(e.target.value)}
                          className="w-full pl-12 pr-12 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />

                        <button
                          type="button"
                          onClick={()=> setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeOff size={20}/>
                            ):(
                                <Eye size={20}/>
                            )}
                        </button>

                       </div>


                       <div className="realtive">

                         <Lock className="absolute left-4 top-4 text-gray-400"
                         size={20}/>

                         <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                            setConfirmPassword(e.target.value)
                            }
                            className="w-full pl-12 pr-12 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />


                        <button type="button"
                        onClick={()=>
                            setShowConfirm(!showConfirm)
                        }>
                            {showConfirm ? (
                                <EyeOff size={20}/>
                            ):(
                                <Eye size={20}/>
                            )}
                        </button>

                       </div>

                       {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                       )}


                       <button type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opactiy-60">
                            {loading
                                ? "Resetting..."
                                : "Reset Password"
                            }
                       </button>

                    </form>

                    <p className="text-center mt-6">

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