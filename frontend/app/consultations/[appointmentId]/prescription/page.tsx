"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { Plus, Trash2 } from "lucide-react";

interface Medicine {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function PrescriptionPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicine: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof Medicine,
    value: string
  ) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    

    // Backend later
  };

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
              Prescription
            </h2>

            {medicines.map((medicine, index) => (

              <div
                key={index}
                className="border rounded-xl p-5 mb-5"
              >

                <div className="grid md:grid-cols-2 gap-4">

                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={medicine.medicine}
                    onChange={(e) =>
                      handleChange(index, "medicine", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleChange(index, "dosage", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Frequency"
                    value={medicine.frequency}
                    onChange={(e) =>
                      handleChange(index, "frequency", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />

                  <input
                    type="text"
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) =>
                      handleChange(index, "duration", e.target.value)
                    }
                    className="border rounded-lg p-3"
                  />

                </div>

                <textarea
                  placeholder="Instructions"
                  value={medicine.instructions}
                  onChange={(e) =>
                    handleChange(index, "instructions", e.target.value)
                  }
                  className="border rounded-lg w-full mt-4 p-3"
                  rows={3}
                />

                {medicines.length > 1 && (

                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="flex items-center gap-2 mt-4 text-red-600"
                  >
                    <Trash2 size={18} />
                    Remove Medicine
                  </button>

                )}

              </div>

            ))}

            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              Add Medicine
            </button>

            <div className="mt-8 flex gap-4">

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg"
              >
                Save Prescription
              </button>

              <button
                type="button"
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Print PDF
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}