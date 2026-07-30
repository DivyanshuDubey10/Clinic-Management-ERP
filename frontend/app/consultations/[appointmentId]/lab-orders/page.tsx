"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {Plus, Trash2} from "lucide-react"

interface Labtest{
    testName: string;
    priority: string;
    notes: string;
}

export default function LabOrdersPage(){
    const [tests, setTests] = useState<Labtest[]>([
        {
            testName:"",
            priority:"Routine",
            notes:"",
        },
    ])


    const addTest = () =>{
        setTests([
            ...tests,
            {
                testName:"",
                priority:"Routine",
                notes:"",
            }
        ])
    }


    const removeTest = (index: number)=>{
        setTests(tests.filter((_,i) => i !==index));
    }


    const updateTest=(
        index: number,
        field: keyof Labtest,
        value: string
    )=>{
        
        const updated = [...tests];

        updated[index][field] = value;
        setTests(updated)
    }


    const handleSubmit = (e: React.FormEvent)=>{
        e.preventDefault();

        
    }


     return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6"
          >

            <h2 className="text-2xl font-semibold mb-6">
              Order Lab Tests
            </h2>

            {tests.map((test, index) => (

              <div
                key={index}
                className="border rounded-xl p-5 mb-5"
              >

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Test Name"
                    value={test.testName}
                    onChange={(e) =>
                      updateTest(index, "testName", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />

                  <select
                    value={test.priority}
                    onChange={(e) =>
                      updateTest(index, "priority", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  >
                    <option>Routine</option>
                    <option>Urgent</option>
                    <option>Emergency</option>
                  </select>

                </div>

                <textarea
                  rows={3}
                  placeholder="Clinical Notes"
                  value={test.notes}
                  onChange={(e) =>
                    updateTest(index, "notes", e.target.value)
                  }
                  className="border rounded-lg w-full mt-4 p-3"
                />

                {tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTest(index)}
                    className="flex items-center gap-2 mt-4 text-red-600"
                  >
                    <Trash2 size={18} />
                    Remove Test
                  </button>
                )}

              </div>

            ))}

            <button
              type="button"
              onClick={addTest}
              className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              Add Test
            </button>

            <div className="mt-8">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Submit Lab Orders
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}