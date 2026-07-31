"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getInvoice } from "@/lib/billing";

export default function InvoiceDetailsPage() {

  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    loadInvoice();
  }, []);

  async function loadInvoice() {
    try {
      const res = await getInvoice(id as string);
      setInvoice(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">Loading...</main>
        </div>
      </div>
    );

  if (!invoice)
    return (
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">Invoice Not Found</main>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-muted/30">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h1 className="text-3xl font-bold">
                {invoice.invoiceNumber}
              </h1>

              <p className="text-muted-foreground">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Print
              </button>

              {invoice.billingDetails.amountDue > 0 && (
                <Link
                  href={`/billing/payment/${invoice._id}`}
                  className="bg-green-600 text-white px-5 py-3 rounded-xl"
                >
                  Collect Payment
                </Link>
              )}

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-card rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold mb-4">
                Patient Details
              </h2>

              <p>
                <strong>Name:</strong>{" "}
                {invoice.patientId ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}` : "Unknown Patient"}
              </p>

              <p>
                <strong>Patient ID:</strong>{" "}
                {invoice.patientId ? invoice.patientId.patientId : "N/A"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {invoice.patientId.phone}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {invoice.patientId.email}
              </p>

            </div>

            <div className="bg-card rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold mb-4">
                Billing Summary
              </h2>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{invoice.billingDetails.subTotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{invoice.billingDetails.tax}</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-₹{invoice.billingDetails.discount}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{invoice.billingDetails.grandTotal}</span>
                </div>

                <div className="flex justify-between text-green-600">
                  <span>Paid</span>
                  <span>₹{invoice.billingDetails.amountPaid}</span>
                </div>

                <div className="flex justify-between text-red-600">
                  <span>Due</span>
                  <span>₹{invoice.billingDetails.amountDue}</span>
                </div>

              </div>

            </div>

          </div>

          <div className="bg-card rounded-xl shadow p-6 mt-8">

            <h2 className="text-xl font-semibold mb-5">
              Billing Items
            </h2>

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-3">Type</th>

                  <th className="text-left p-3">Description</th>

                  <th className="text-left p-3">Qty</th>

                  <th className="text-left p-3">Unit Price</th>

                  <th className="text-left p-3">Total</th>

                </tr>

              </thead>

              <tbody>

                {invoice.items.map((item: any, index: number) => (

                  <tr key={index} className="border-t">

                    <td className="p-3">
                      {item.type}
                    </td>

                    <td className="p-3">
                      {item.description}
                    </td>

                    <td className="p-3">
                      {item.quantity}
                    </td>

                    <td className="p-3">
                      ₹{item.unitPrice}
                    </td>

                    <td className="p-3 font-semibold">
                      ₹{item.total}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div className="bg-card rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold mb-4">
                Payment History
              </h2>

              {invoice.paymentHistory.length === 0 ? (

                <p className="text-muted-foreground">
                  No payments recorded
                </p>

              ) : (

                invoice.paymentHistory.map((payment: any, index: number) => (

                  <div
                    key={index}
                    className="border-b py-3"
                  >

                    <p>
                      ₹{payment.amount}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {payment.method}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleString()}
                    </p>

                  </div>

                ))

              )}

            </div>

            <div className="bg-card rounded-xl shadow p-6">

              <h2 className="text-xl font-semibold mb-4">
                Insurance
              </h2>

              <p>
                <strong>Provider:</strong>{" "}
                {invoice.insuranceDetails.provider || "-"}
              </p>

              <p>
                <strong>Policy:</strong>{" "}
                {invoice.insuranceDetails.policyNumber || "-"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {invoice.insuranceDetails.claimStatus}
              </p>

              <p>
                <strong>Claim:</strong>{" "}
                ₹{invoice.insuranceDetails.claimAmount}
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}