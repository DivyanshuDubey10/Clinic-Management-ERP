"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MailCheck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { verifyEmail, resendVerificationOTP } from "@/lib/auth";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      await verifyEmail(email, otp);

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Verification failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    try {
      setResending(true);
      setError("");
      setSuccess("");

      await resendVerificationOTP(email);

      setSuccess("A new verification code has been sent.");

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Unable to resend verification code."
      );
    } finally {
      setResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/50 grid lg:grid-cols-2">

      {/* Left Section */}
      <section className="hidden lg:flex flex-col justify-between bg-slate-950 text-white p-16">

        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-cyan-500 flex items-center justify-center">
            <MailCheck size={24} />
          </div>

          <h1 className="text-2xl font-bold">
            Clinic ERP
          </h1>
        </div>

        <div>

          <h2 className="text-5xl font-bold leading-tight">
            Verify
            <br />
            your email
          </h2>

          <p className="mt-6 text-slate-300 text-lg max-w-md">
            We sent a verification code to your email.
            Enter the code below to activate your account.
          </p>

        </div>

        <div className="flex items-center gap-3 text-slate-300">

          <ShieldCheck className="text-cyan-400" />

          Secure account verification

        </div>

      </section>

      {/* Right Section */}

      <section className="flex items-center justify-center px-5 py-10">

        <div className="w-full max-w-md rounded-3xl bg-card shadow-2xl p-8">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100">

              <MailCheck className="text-cyan-600" />

            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Verify Email
            </h2>

            <p className="mt-3 text-muted-foreground text-sm">
              Enter the 6-digit verification code sent to
            </p>

            <p className="font-semibold text-cyan-700 mt-1 break-all">
              {email}
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-xl border border-border px-4 py-3 text-center text-2xl tracking-[10px] font-semibold outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 p-3 text-sm">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 hover:bg-cyan-600 transition text-white py-3 font-semibold"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>

          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl border py-3 hover:bg-muted/50 transition"
          >
            <RotateCcw size={18} />

            {resending
              ? "Sending..."
              : "Resend Code"}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-8">

            Already verified?

            <Link
              href="/login"
              className="ml-1 font-semibold text-cyan-700 hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </section>

    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}