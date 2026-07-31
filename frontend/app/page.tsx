"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Activity,
  Calendar,
  Shield,
  ArrowRight,
  HeartPulse,
  Users,
  Clock,
  Stethoscope,
  FileText,
  CreditCard,
  FlaskConical,

  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useRef } from "react";

/* ── Reusable scroll-reveal wrapper ──────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* ─── Navbar ──────────────────────────────────────────── */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10 w-full max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20">
            <HeartPulse size={26} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-800">Ziva Care</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </nav>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-semibold bg-blue-600 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95">
            Register
          </Link>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────── */}
      <section className="container mx-auto px-6 pt-24 pb-20 relative z-10 flex flex-col items-center justify-center max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="px-5 py-2 rounded-full bg-blue-100/80 text-blue-700 font-semibold text-sm mb-8 inline-block shadow-sm">
            Next-Generation Ziva Care
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl text-center leading-[1.1]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Your Health, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Perfectly Managed.</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl text-center leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Experience seamless healthcare administration. From booking appointments to accessing lab reports, everything is just a click away.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group text-base">
            Register as Patient
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-base">
            Sign In to Portal
          </Link>
        </motion.div>
      </section>

      {/* ─── Stats Strip ─────────────────────────────────────── */}
      <section className="relative z-10 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-6xl px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "6", label: "Departments", icon: Activity },
            { value: "5", label: "Modules", icon: Stethoscope },
            { value: "24/7", label: "Online Access", icon: Clock },
            { value: "100%", label: "Digital Records", icon: Shield },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="flex flex-col items-center gap-2">
                <stat.icon size={28} className="text-blue-600 mb-1" />
                <span className="text-3xl md:text-4xl font-extrabold text-slate-900">{stat.value}</span>
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────── */}
      <section id="features" className="relative z-10 container mx-auto max-w-7xl px-6 py-28">
        <Reveal className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Everything You Need</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">Powerful Features for Better Care</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">A comprehensive suite of tools designed to simplify every aspect of clinic operations and patient experience.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {[
            { icon: Calendar, color: "blue", title: "Easy Appointments", desc: "Book, reschedule, or cancel your clinic visits instantly with our intuitive scheduling system." },
            { icon: Activity, color: "indigo", title: "Health Tracking", desc: "Access your medical history, prescriptions, and lab reports securely from anywhere." },
            { icon: Shield, color: "emerald", title: "Secure & Private", desc: "Your data is protected with enterprise-grade security, ensuring your privacy is never compromised." },
            { icon: CreditCard, color: "amber", title: "Online Payments", desc: "Pay bills seamlessly with integrated Razorpay checkout — UPI, cards, and net banking supported." },
            { icon: FlaskConical, color: "rose", title: "Lab Reports", desc: "View and download your laboratory test results as soon as they're published by the clinic." },
            { icon: FileText, color: "cyan", title: "Digital Prescriptions", desc: "Receive and review your prescriptions digitally — no more lost paper slips." },
          ].map((feat, i) => {
            const colors: Record<string, string> = {
              blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
              indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600",
              emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
              amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-600",
              rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600",
              cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600",
            };
            return (
              <Reveal key={feat.title} delay={i * 0.08}>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:text-white transition-colors ${colors[feat.color]}`}>
                    <feat.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="relative z-10 bg-white py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <Reveal className="text-center mb-20">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">Get Started in 3 Easy Steps</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-14 left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-200 to-emerald-200" />

            {[
              { step: "01", title: "Create Account", desc: "Register with your basic details — name, email, and phone number. It takes less than a minute.", color: "blue" },
              { step: "02", title: "Book Appointment", desc: "Browse available doctors, pick a convenient time slot, and confirm your appointment instantly.", color: "indigo" },
              { step: "03", title: "Get Treated", desc: "Visit the clinic, consult your doctor, and access prescriptions, billing & reports from your portal.", color: "emerald" },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-28 h-28 rounded-full bg-${item.color}-50 border-4 border-white shadow-lg flex items-center justify-center mb-8 relative z-10`}>
                    <span className={`text-3xl font-extrabold text-${item.color}-600`}>{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ─── Why Choose Us ───────────────────────────────────── */}
      <section className="relative z-10 bg-white py-28">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Why Ziva Care</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-6">Healthcare, Simplified for Everyone</h2>
                <p className="text-slate-500 leading-relaxed mb-8">
                  We built Ziva Care to bridge the gap between clinics and patients. Whether you&#39;re managing a busy practice or simply trying to book a doctor visit, our platform makes it effortless.
                </p>
                <ul className="space-y-4">
                  {[
                    "No more long queues — book online anytime",
                    "Instant access to prescriptions & reports",
                    "Transparent billing with online payment",
                    "Real-time notifications & reminders",
                    "Works on desktop, tablet, and mobile",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl shadow-blue-600/20">
                <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
                <p className="text-blue-100 leading-relaxed mb-8">
                  Simplify your healthcare journey with Ziva Care. Registration is free and takes under a minute.
                </p>
                <Link href="/register" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                  Create Free Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ──────────────────────────────────────── */}
      <section className="relative z-10">
        <div className="container mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl px-10 py-16 md:px-20 text-center text-white shadow-2xl shadow-blue-600/25 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative">Take Control of Your Health Today</h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg leading-relaxed relative">
                Register for free and experience a smarter way to manage your healthcare. No hidden charges, no complicated setup.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
                <Link href="/register" className="px-8 py-4 bg-white text-blue-700 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 group">
                  Get Started — It&apos;s Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all backdrop-blur-sm">
                  Sign In Instead
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer id="contact" className="relative z-10 bg-slate-900 text-slate-400 pt-20 pb-10">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <HeartPulse size={22} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-white">Ziva Care</span>
              </div>
              <p className="text-sm leading-relaxed">
                A modern clinic management platform built for patients and healthcare providers alike. Simplifying healthcare, one click at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><span className="hover:text-white transition-colors cursor-default">Appointments</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Consultations</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Lab Reports</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Pharmacy</span></li>
                <li><span className="hover:text-white transition-colors cursor-default">Billing</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><MapPin size={16} className="text-blue-400 flex-shrink-0" /> 123 Health Ave, Medical District</li>
                <li className="flex items-center gap-3"><Phone size={16} className="text-blue-400 flex-shrink-0" /> +91 98765 43210</li>
                <li className="flex items-center gap-3"><Mail size={16} className="text-blue-400 flex-shrink-0" /> support@zivacare.in</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Ziva Care. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}