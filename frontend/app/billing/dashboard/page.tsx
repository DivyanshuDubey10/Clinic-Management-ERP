"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getInvoices } from "@/lib/billing";
import {
  FileText,
  IndianRupee,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function BillingDashboard() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const res = await getInvoices();
      setInvoices(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;

    const totalRevenue = invoices.reduce(
      (sum, inv) => sum + (inv.billingDetails?.amountPaid || 0),
      0
    );

    const pendingAmount = invoices.reduce(
      (sum, inv) => sum + (inv.billingDetails?.amountDue || 0),
      0
    );

    const outstanding = invoices.filter(
      (inv) => inv.billingDetails?.amountDue > 0
    ).length;

    return {
      totalInvoices,
      totalRevenue,
      pendingAmount,
      outstanding,
    };
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">Loading...</main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold mb-8">
            Billing Dashboard
          </h1>

          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-card rounded-xl shadow p-6">
              <FileText className="mb-3 text-blue-600" />
              <p className="text-muted-foreground">Invoices</p>
              <h2 className="text-3xl font-bold">
                {stats.totalInvoices}
              </h2>
            </div>

            <div className="bg-card rounded-xl shadow p-6">
              <IndianRupee className="mb-3 text-green-600" />
              <p className="text-muted-foreground">Revenue</p>
              <h2 className="text-3xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </h2>
            </div>

            <div className="bg-card rounded-xl shadow p-6">
              <Clock className="mb-3 text-yellow-600" />
              <p className="text-muted-foreground">Pending Amount</p>
              <h2 className="text-3xl font-bold">
                ₹{stats.pendingAmount.toLocaleString()}
              </h2>
            </div>

            <div className="bg-card rounded-xl shadow p-6">
              <AlertTriangle className="mb-3 text-red-600" />
              <p className="text-muted-foreground">
                Outstanding Invoices
              </p>
              <h2 className="text-3xl font-bold">
                {stats.outstanding}
              </h2>
            </div>

          </div>

          <div className="bg-card rounded-xl shadow p-6 mb-8">

            <h2 className="text-xl font-semibold mb-4">
              Quick Actions
            </h2>

            <div className="flex flex-wrap gap-4">

              <Link
                href="/billing"
                className="bg-blue-600 text-white px-5 py-3 rounded-xl"
              >
                Create Invoice
              </Link>

              <Link
                href="/billing/history"
                className="bg-green-600 text-white px-5 py-3 rounded-xl"
              >
                Billing History
              </Link>

              <Link
                href="/billing/insurance"
                className="bg-purple-600 text-white px-5 py-3 rounded-xl"
              >
                Insurance
              </Link>

            </div>

          </div>

          <div className="bg-card rounded-xl shadow overflow-hidden">

            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Recent Invoices
              </h2>
            </div>

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="text-left p-4">Invoice</th>
                  <th className="text-left p-4">Patient</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Due</th>
                </tr>

              </thead>

              <tbody>

                {invoices.slice(0, 5).map((invoice) => (

                  <tr
                    key={invoice._id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {invoice.invoiceNumber}
                    </td>

                    <td className="p-4">
                      {invoice.patientId ? `${invoice.patientId.firstName} ${invoice.patientId.lastName}` : "Unknown Patient"}
                    </td>

                    <td className="p-4">
                      {invoice.status}
                    </td>

                    <td className="p-4">
                      ₹{invoice.billingDetails?.grandTotal}
                    </td>

                    <td className="p-4 text-red-600">
                      ₹{invoice.billingDetails?.amountDue}
                    </td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>
    </div>
  );
}