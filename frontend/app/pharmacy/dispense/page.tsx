"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { dispensePrescription } from "@/lib/pharmacy";
import { getPrescriptions } from "@/lib/pharmacy";



export default function DispenseMedicinePage() {
  const router = useRouter();

  const [prescriptionId, setPrescriptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState<any[]>([])


  useEffect(()=>{
    loadPendingPrescriptions()
  },[])


  const loadPendingPrescriptions = async () => {
  try {
    const res = await getPrescriptions();

    // Supports:
    // { data: prescriptions }
    // { data: { data: prescriptions } }

    const prescriptionList = res.data?.data ?? res.data ?? [];

    const pendingPrescriptions = prescriptionList.filter(
        (prescription: any) =>
          !prescription.status ||
          prescription.status.toLowerCase() === "pending"
      );

    
    

    setPrescriptions(pendingPrescriptions);
  } catch (err) {
    console.error(err);
  }
};



  const handleDispense = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await dispensePrescription(prescriptionId);

      alert("Medicine dispensed successfully");

      setPrescriptionId("")
      loadPendingPrescriptions();

    } catch (err: any) {

      console.error(err);
      alert(err.response?.data?.message || "Dispense failed");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8 max-w-2xl mx-auto">

          <div className="bg-white rounded-2xl shadow p-8">

            <h1 className="text-3xl font-bold mb-2">
              Dispense Medicine
            </h1>

            <p className="text-gray-500 mb-8">
              Enter a prescription ID to dispense medicines.
            </p>

            <form
              onSubmit={handleDispense}
              className="space-y-6"
            >

              <div>
                <label className="block mb-2 font-medium">
                  Prescription ID
                </label>

                <select
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  className="w-full border rounded-xl p-3"
                  required
                  disabled={loading || prescriptions.length === 0}
                >
                  <option value="">
                    {prescriptions.length === 0
                      ? "No pending prescriptions available"
                      : "Select Pending Prescription"}
                  </option>

                  {prescriptions.map((prescription: any) => (
                    <option key={prescription._id} value={prescription._id}>
                      {prescription.patientId
                        ? `${prescription.patientId.firstName ?? ""} ${
                            prescription.patientId.lastName ?? ""
                          }`.trim()
                        : "Patient unavailable"}
                      {" • "}
                      Prescription: {prescription._id.slice(-6).toUpperCase()}
                    </option>
                  ))}
                </select>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
              >
                {loading ? "Dispensing..." : "Dispense"}
              </button>

            </form>

          </div>

        </main>
      </div>
    </div>
  );
}