"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getInvoices, updateInsurance } from "@/lib/billing";

export default function InsurancePage() {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    invoiceId: "",
    provider: "",
    policyNumber: "",
    claimStatus: "Pending",
    claimAmount: 0,
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoices");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  async function handleSubmit() {
    if (!formData.invoiceId) {
      return alert("Please select an invoice");
    }

    try {
      setLoading(true);

      const res = await updateInsurance(formData.invoiceId, {
        provider: formData.provider,
        policyNumber: formData.policyNumber,
        claimStatus: formData.claimStatus,
        claimAmount: Number(formData.claimAmount),
      });

      alert(res.message || "Insurance updated successfully");

      setFormData({
        invoiceId: "",
        provider: "",
        policyNumber: "",
        claimStatus: "Pending",
        claimAmount: 0,
      });

      loadInvoices();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Failed to update insurance"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <div className="bg-card rounded-2xl shadow max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">
              Insurance Claim
            </h1>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-medium">
                  Invoice
                </label>

                <select
                  name="invoiceId"
                  value={formData.invoiceId}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="">Select Invoice</option>

                  {invoices.map((invoice) => (
                    <option
                      key={invoice._id}
                      value={invoice._id}
                    >
                      {invoice.invoiceNumber} -{" "}
                      {invoice.patientId ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}` : "Unknown Patient"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Insurance Provider
                </label>

                <input
                  name="provider"
                  value={formData.provider}
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Insurance"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}