"use client";

import { useEffect, useState } from "react";
import { getStaff, deleteStaff } from "@/lib/staff";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Search, Trash2, UserPlus, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StaffPage() {
    const [staffList, setStaffList] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Simple client-side protection for Admin only route
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role?.toLowerCase() !== "admin") {
                    router.push("/dashboard");
                    return;
                }
            } catch (e) {
                // fall through
            }
        }
        loadStaff();
    }, [router]);

    async function loadStaff() {
        try {
            const response = await getStaff();
            setStaffList(response.data.data || []);
            setFiltered(response.data.data || []);
        } catch (error) {
            console.error("Error loading staff:", error);
        }
    }

    function handleSearch(value: string) {
        setSearch(value);
        const filteredStaff = staffList.filter((staff) =>
            `${staff.name} ${staff.email} ${staff.role}`.toLowerCase()
                .includes(value.toLowerCase())
        );
        setFiltered(filteredStaff);
    }

    async function handleDelete(id: string) {
        const confirmDelete = confirm("Are you sure you want to delete this staff member?");
        if (!confirmDelete) return;

        try {
            await deleteStaff(id);
            setStaffList((current) => current.filter((staff) => staff._id !== id));
            setFiltered((current) => current.filter((staff) => staff._id !== id));
        } catch (error: any) {
            console.error("Error deleting staff:", error);
            alert(error.response?.data?.message || "Unable to delete this staff member.");
        }
    }

    return (
        <div className="flex bg-slate-100 min-h-screen">
            <Sidebar />

            <div className="flex-1">
                <Navbar />

                <main className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">Staff Management</h1>
                            <p className="text-gray-500">Manage doctors, receptionists, and pharmacists</p>
                        </div>

                        <Link href="/staff/add"
                            className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700">
                            <UserPlus size={20} />
                            Add Staff
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="relative mb-6">
                            <Search size={18} className="absolute left-4 top-4 text-gray-400" />
                            <input
                                placeholder="Search Staff..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full border rounded-xl pl-11 pr-4 py-3"
                            />
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-4">#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">
                                            <ShieldAlert size={40} className="mx-auto mb-3 text-gray-300" />
                                            No staff members found.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((staff, index) => (
                                        <tr className="border-b hover:bg-gray-50" key={staff._id}>
                                            <td className="py-4">{index + 1}</td>
                                            <td className="font-medium">{staff.name}</td>
                                            <td className="text-gray-500">{staff.email}</td>
                                            <td>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                                                    ${staff.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        staff.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                                                            staff.role === 'pharmacist' ? 'bg-green-100 text-green-700' :
                                                                'bg-orange-100 text-orange-700'}`}>
                                                    {staff.role}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex justify-center gap-3">
                                                    {staff.role !== 'admin' && (
                                                        <button onClick={() => handleDelete(staff._id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
