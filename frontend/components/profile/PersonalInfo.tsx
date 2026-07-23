"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "@/lib/auth";


export default function PersonalInfo(){
    const [user, setUser] = useState<any>()
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [message, setMessage] = useState("")

    const [form, setForm] = useState({
        name:"",
        email:"",
        role:"",
        phone:"",
        specialization:"",
        consultationHours:""
    });

    useEffect(()=>{
        async function loadProfile() {
            try {
                const data = await getProfile();

                setForm({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    phone: data.user.phone || "",
                    role: data.user.role || "",
                    specialization: data.user.specialization || "",
                    consultationHours: data.user.consultationHours || "",
                })

            } catch (error) {
                console.log(error)
            }
        }

        loadProfile()
    },[]);


    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setForm({
            ...form,
            [e.target.name] : e.target.value,
        })
    }

    async function handleSave(){
        try {
            setLoading(true);

            await updateProfile({
                name:form.name,
                email: form.email,
                phone: form.phone,
                specialization: form.specialization,
                consultationHours: form.consultationHours,
            });

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem('user') || "{}"),
                name:form.name,
                email: form.email,
                phone: form.phone,
                specialization: form.specialization,
                consultationHours: form.consultationHours,
                })
            )

            setMessage("Profile updated successfully");
            setEditing(false)

        } catch (err) {
            console.error(err);
            setMessage("Failed to update profile");
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold">
                    Personal Information
                </h2>

                {!editing ? (
                    <button onClick={()=>{setEditing(true)}} 
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700">
                        Edit Profile
                    </button>
                ) : (
                    <button onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 disabled:opactiy-60">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>


            {message &&(
                <div className="mb-6 rounded-xl bg-blue-50 text-blue-700 p-4">
                    {message}
                </div>
            )}


            <div className="grid md:grid-cols-2 gap-6">
                <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-6">

                <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editing}
                />

                <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editing}
                />

                <Input
                label="Phone number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!editing}
                />

                <Input
                label="Role"
                name="role"
                value={form.role}
                disabled
                />

                {form.role === "doctor" && (
                    <>
                        <Input
                        label="Specialization"
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        disabled={!editing}
                        />

                        <Input
                        label="Consultation Hours"
                        name="consultationHours"
                        value={form.consultationHours}
                        onChange={handleChange}
                        disabled={!editing}
                        />
                    </>
                )}

            </div>

        </div>
    )
}


function Input({
    label,
    name,
    value,
    onChange,
    disabled,
}:any){
    return(
        <div>
            <label className="text-gray-500">{label}</label>

            <input className={`w-full mt-2 border rounded-xl p-3 ${
                disabled ? "bg-gray-100" : ""}`} 
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </div>
    )
}