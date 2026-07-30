"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getInvoices } from "@/lib/billing";
import {
  Search,
  Eye,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

export default function BillingHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
    } finally {
      setLoading(false);
    }
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const patient =
        `${invoice.patientId?.firstName || ""} ${invoice.patientId?.lastName || ""}`.toLowerCase();

      const invoiceNumber =
        invoice.invoiceNumber?.toLowerCase() || "";

      const matchesSearch =
        patient.includes(search.toLowerCase()) ||
        invoiceNumber.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-8">
            Loading invoices...
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold">
                Billing History
              </h1>

              <p className="text-gray-500">
                View and manage invoices
              </p>
            </div>

            <Link
              href="/billing"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            >
              + Create Invoice
            </Link>

          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">

            <div className="grid md:grid-cols-2 gap-4">

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search invoice or patient..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border rounded-xl pl-10 pr-4 py-3"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border rounded-xl p-3"
              >
                <option>All</option>
                <option>Paid</option>
                <option>Partial</option>
                <option>Unpaid</option>
                <option>Cancelled</option>
              </select>

            </div>

          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr>

                  <th className="text-left p-4">
                    Invoice
                  </th>

                  <th className="text-left p-4">
                    Patient
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-left p-4">
                    Total
                  </th>

                  <th className="text-left p-4">
                    Due
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-center p-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>
                                {filteredInvoices.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center p-8 text-gray-500"
                    >
                      No invoices found.
                    </td>

                  </tr>

                ) : (

                  filteredInvoices.map((invoice) => (

                    <tr
                      key={invoice._id}
                      className="border-t hover:bg-slate-50"
                    >

                      <td className="p-4 font-medium">
                        {invoice.invoiceNumber}
                      </td>

                      <td className="p-4">
                        {invoice.patientId?.firstName}{" "}
                        {invoice.patientId?.lastName}
                      </td>

                      <td className="p-4">
                        {new Date(
                          invoice.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4 font-semibold">
                        ₹
                        {invoice.billingDetails?.grandTotal?.toLocaleString()}
                      </td>

                      <td className="p-4 text-red-600 font-medium">
                        ₹
                        {invoice.billingDetails?.amountDue?.toLocaleString()}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>

                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

                          <Link
                            href={`/billing/details/${invoice._id}`}
                            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                          {invoice.billingDetails?.amountDue > 0 && (

                            <Link
                              href={`/billing/payment/${invoice._id}`}
                              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                            >
                              <CreditCard size={16} />
                              Pay
                            </Link>

                          )}

                          <Link
                            href="/billing/insurance"
                            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <ShieldCheck size={16} />
                            Insurance
                          </Link>

                        </div>

                      </td>

                    </tr>

                  ))

                )}
              </tbody>
                            

            </table>

          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-8">

            <div className="bg-white rounded-xl shadow p-6">

              <p className="text-gray-500 text-sm">
                Total Invoices
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {filteredInvoices.length}
              </h2>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

              <p className="text-gray-500 text-sm">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold mt-2 text-green-600">
                ₹
                {filteredInvoices
                  .reduce(
                    (sum, invoice) =>
                      sum +
                      (invoice.billingDetails?.amountPaid || 0),
                    0
                  )
                  .toLocaleString()}
              </h2>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

              <p className="text-gray-500 text-sm">
                Pending Amount
              </p>

              <h2 className="text-3xl font-bold mt-2 text-red-600">
                ₹
                {filteredInvoices
                  .reduce(
                    (sum, invoice) =>
                      sum +
                      (invoice.billingDetails?.amountDue || 0),
                    0
                  )
                  .toLocaleString()}
              </h2>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

              <p className="text-gray-500 text-sm">
                Paid Invoices
              </p>

              <h2 className="text-3xl font-bold mt-2 text-blue-600">
                {
                  filteredInvoices.filter(
                    (invoice) => invoice.status === "Paid"
                  ).length
                }
              </h2>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}