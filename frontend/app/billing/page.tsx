"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { createInvoice } from "@/lib/billing";
import { getPatients } from "@/lib/patient";
import { getConsultations } from "@/lib/patientPortal";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([])
  const [consultations, setConsultations] = useState<any[]>([])

  const [formData, setFormData] = useState({
    patientId: "",
    consultationId: "",

    consultationFee: 500,
    labFee: 350,
    pharmacyFee: 700,
    procedureFee: 0,
    otherFee: 0,

    tax: 5,
    discount: 50,

    insuranceProvider: "",
    policyNumber: "",
    claimStatus: "Pending",
    claimAmount: 0,
  });


  useEffect(() => {
  loadPatients();
  }, []);


  useEffect(()=>{

    if(formData.patientId){
        loadConsultations(formData.patientId);
    }else{
        setConsultations([]);
    }

  },[formData.patientId])


  const loadConsultations = async(patientId: string)=>{
    try {
        const res = await getConsultations({patientId})

        setConsultations(res.data || [])

    } catch (error) {
        console.error(error)

        setConsultations([])
    }
  }


    const loadPatients = async () => {
    try {
        const res = await getPatients();
        setPatients(res.data || []);
    } catch (error) {
        console.error(error);
    }
    };



  const subtotal =
    Number(formData.consultationFee) +
    Number(formData.labFee) +
    Number(formData.pharmacyFee) +
    Number(formData.procedureFee) +
    Number(formData.otherFee);

  const taxAmount = (subtotal * Number(formData.tax)) / 100;

  const grandTotal =
    subtotal + taxAmount - Number(formData.discount);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        patientId: formData.patientId,
        consultationId: (formData.consultationId
          ? { consultationId: formData.consultationId }
          : {}),

        items: [
          {
            type: "Consultation Fee",
            description: "Consultation",
            quantity: 1,
            unitPrice: Number(formData.consultationFee),
          },
          {
            type: "Lab Test",
            description: "Laboratory Charges",
            quantity: 1,
            unitPrice: Number(formData.labFee),
          },
          {
            type: "Pharmacy",
            description: "Medicine Charges",
            quantity: 1,
            unitPrice: Number(formData.pharmacyFee),
          },
          {
            type: "Procedure",
            description: "Procedure Charges",
            quantity: 1,
            unitPrice: Number(formData.procedureFee),
          },
          {
            type: "Other",
            description: "Other Charges",
            quantity: 1,
            unitPrice: Number(formData.otherFee),
          },
        ].filter((item) => item.unitPrice > 0),

        tax: Number(formData.tax),
        discount: Number(formData.discount),

        insuranceDetails: {
          provider: formData.insuranceProvider,
          policyNumber: formData.policyNumber,
          claimStatus: formData.claimStatus,
          claimAmount: Number(formData.claimAmount),
        },
      };

      const res = await createInvoice(payload);

      alert(res.message || "Invoice Created Successfully");

      setFormData({
        patientId: "",
        consultationId: "",

        consultationFee: 500,
        labFee: 350,
        pharmacyFee: 700,
        procedureFee: 0,
        otherFee: 0,

        tax: 5,
        discount: 50,

        insuranceProvider: "",
        policyNumber: "",
        claimStatus: "Pending",
        claimAmount: 0,
      });
    } catch (error: any) {
      alert(
        error?.response?.data?.message || "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <div className="bg-white rounded-2xl shadow p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
              Create Invoice
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                    Patient
                </label>

                <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                >
                    <option value="">Select Patient</option>

                    {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                        {patient.firstName} {patient.lastName}
                    </option>
                    ))}
                </select>
                </div>

               <div>
                <label className="block mb-2 font-medium">
                    Consultation
                </label>

                <select
                    name="consultationId"
                    value={formData.consultationId}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                    >
                    <option value="">
                        Select Consultation
                    </option>

                    {consultations.map((consultation) => (
                        <option
                        key={consultation._id}
                        value={consultation._id}
                        >
                        {consultation.symptoms ||
                            consultation.diagnosis ||
                            consultation._id}
                        </option>
                    ))}
                </select>
             </div>

              <div>
                <label className="block mb-2 font-medium">
                  Consultation Fee
                </label>

                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Lab Charges
                </label>

                <input
                  type="number"
                  name="labFee"
                  value={formData.labFee}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Pharmacy Charges
                </label>

                <input
                  type="number"
                  name="pharmacyFee"
                  value={formData.pharmacyFee}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Procedure Charges
                </label>

                <input
                  type="number"
                  name="procedureFee"
                  value={formData.procedureFee}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Other Charges
                </label>

                <input
                  type="number"
                  name="otherFee"
                  value={formData.otherFee}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Tax (%)
                </label>

                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Discount (₹)
                </label>

                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Insurance Provider
                </label>

                <input
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Policy Number
                </label>

                <input
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Claim Status
                </label>

                <select
                  name="claimStatus"
                  value={formData.claimStatus}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Settled</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Claim Amount
                </label>

                <input
                  type="number"
                  name="claimAmount"
                  value={formData.claimAmount}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>
            </div>

            <div className="mt-10 border-t pt-6 space-y-2 text-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax ({formData.tax}%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>- ₹{formData.discount}</span>
              </div>

              <div className="flex justify-between text-2xl font-bold border-t pt-4">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl disabled:bg-gray-400"
              >
                {loading ? "Generating..." : "Generate Invoice"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}