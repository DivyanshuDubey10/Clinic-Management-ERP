"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createStaff } from "@/lib/staff";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

export default function AddStaffPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "doctor",
        phone: "",
        specialization: "" // For doctors
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await createStaff(formData);
            router.push("/staff");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create staff member");
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <Link href="/staff" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition">
                                <ArrowLeft size={20} className="text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold">Add Staff Member</h1>
                                <p className="text-gray-500">Create a new staff account</p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Dr. John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@clinic.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                    <select
                                        name="role"
                                        required
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="doctor">Doctor</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="pharmacist">Pharmacist</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>

                                {formData.role === "doctor" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Cardiology, Pediatrics, etc."
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end pt-4 border-t mt-8">
                                <Link href="/staff" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium mr-4">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2 disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    Create Staff
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
