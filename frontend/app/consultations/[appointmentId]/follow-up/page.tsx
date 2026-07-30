"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Navbar from "@/components/layout/Navbar"
import {CalendarDays} from "lucide-react"

export default function FollowUpPage(){
    const [form, setForm] = useState({
        followUpDate:"",
        followUpTime:"",
        reason:"",
        notes:""
    });


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
    }


    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault()
        console.log(form)

        //api
    }


    return(
        <div className="flex bg-gray-100 min-h-screen">
            <Sidebar/>

            <div className="flex-1">
                <Navbar/>

                <div className="p-6">
                    <div className="bg-white rounded-xl shadow p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <CalendarDays className="text-blue-600" size={30}/>

                            <h1 className="text-2xl font-bold">
                                Follow Up Appointment
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit}
                        className="space-y-5">

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Follow-Up Date
                                    </label>

                                    <input
                                      type="date"
                                      name="followUpDate"
                                      value={form.followUpDate}
                                      onChange={handleChange}
                                      className="border rounded-lg w-full p-3"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">
                                        Follow-up Time
                                    </label>

                                    <input
                                      type="time"
                                      name="followUpTime"
                                      value={form.followUpTime}
                                      onChange={handleChange}
                                      className="border rounded-lg w-full p-3"
                                    />
                                </div>

                            </div>


                            <div>
                                <label className="block mb-2 font-medium">
                                    Reason
                                </label>

                                <input
                                  type="text"
                                  name="reason"
                                  value={form.reason}
                                  onChange={handleChange}
                                  className="border rounded-lg w-full p-3"
                                  placeholder="Follow-Up reason..."
                                />

                            </div>

                             <div>
                                <label className="block mb-2 font-medium">
                                    Doctor Notes
                                </label>

                                <textarea
                                    rows={5}
                                    name="notes"
                                    value={form.notes}
                                    onChange={handleChange}
                                    placeholder="Additional instructions..."
                                    className="border rounded-lg w-full p-3"
                                />

                            </div>

                            <div className="flex gap-4">
                                <button type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-ehite px-6 py-3 rounded-lg">
                                    Schedule Follow-Up
                                </button>

                                <button type="button"
                                className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}