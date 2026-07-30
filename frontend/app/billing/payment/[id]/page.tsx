"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  getInvoice,
  recordManualPayment,
  createRazorpayOrder,
  verifyPayment
} from "@/lib/billing";


export default function PaymentCollectionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [invoice, setInvoice] = useState<any>(null);

  const [formData, setFormData] = useState({
    amount: 0,
    method: "Cash",
    transactionId: "",
  });

  useEffect(() => {
    loadInvoice();
  }, []);

  async function loadInvoice() {
    try {
      const res = await getInvoice(id as string);

      setInvoice(res.data);

      setFormData({
        amount: res.data.billingDetails.amountDue,
        method: "Cash",
        transactionId: "",
      });
    } catch (err: any) {

        console.log(err.response?.data);
        console.log(err.response?.status);
        console.error(err);

        alert("Unable to load Invoice")

    } finally {
      setLoading(false);
    }
  }


  const handleOnlinePayment = async () => {
  try {
    const order = await createRazorpayOrder(id as string);

    const options = {
      key: order.data.keyId,
      amount: order.data.amount,
      currency: order.data.currency,
      name: "Clinic Management ERP",
      description: "Invoice Payment",
      order_id: order.data.orderId,

      prefill: {
        name: `${invoice.patientId.firstName} ${invoice.patientId.lastName}`,
        email: invoice.patientId.email,
        contact: invoice.patientId.phone,
      },

      theme: {
        color: "#2563eb",
      },

      handler: async function (response: any) {
        try {
          const verify = await verifyPayment(id as string, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert(
            verify.message || "Payment Successful"
          );

          loadInvoice();
        } catch (err: any) {
          console.error(err);

          alert(
            err?.response?.data?.message ||
              "Payment verification failed"
          );
        }
      },
    };

    const razorpay = new (window as any).Razorpay(options);

    razorpay.open();

  } catch (err: any) {
    console.error(err);

    alert(
      err?.response?.data?.message ||
        "Unable to initiate payment"
    );
  }
};


  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "amount"
          ? Number(e.target.value)
          : e.target.value,
    });
  }

  async function handleSubmit() {
    if (formData.amount <= 0) {
      return alert("Enter valid amount");
    }

    try {
      setSaving(true);

      const res = await recordManualPayment(
        id as string,
        formData
      );

      alert(res.message);

      router.push("/billing/history");

    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Payment failed"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">
            Loading...
          </main>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          <div className="bg-white rounded-2xl shadow max-w-3xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-8">
              Collect Payment
            </h1>

            <div className="space-y-6">

              <div>

                <label className="block mb-2 font-medium">
                  Invoice
                </label>

                <input
                  readOnly
                  value={invoice.invoiceNumber}
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Patient
                </label>

                <input
                  readOnly
                  value={`${invoice.patientId.firstName} ${invoice.patientId.lastName}`}
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Grand Total
                </label>

                <input
                  readOnly
                  value={`₹${invoice.billingDetails.grandTotal}`}
                  className="w-full border rounded-xl p-3 bg-gray-100"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Already Paid
                </label>

                <input
                  readOnly
                  value={`₹${invoice.billingDetails.amountPaid}`}
                  className="w-full border rounded-xl p-3 bg-green-50"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Remaining Due
                </label>

                <input
                  readOnly
                  value={`₹${invoice.billingDetails.amountDue}`}
                  className="w-full border rounded-xl p-3 bg-red-50"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Payment Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Payment Method
                </label>

                <select
                  name="method"
                  value={formData.method}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                </select>

              </div>

              {(formData.method === "Card" ||
                formData.method === "UPI") && (

                <div>

                  <label className="block mb-2 font-medium">
                    Transaction ID
                  </label>

                  <input
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3"
                  />

                </div>

              )}

              <div className="bg-slate-100 rounded-xl p-5">

                <div className="flex justify-between text-lg">

                  <span>Payment</span>

                  <span className="font-bold">
                    ₹{formData.amount}
                  </span>

                </div>

              </div>


              <div className="space-y-4">

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl disabled:bg-gray-400"
                >
                    {saving
                    ? "Recording..."
                    : "Record Manual Payment"}
                </button>

                <button
                    onClick={handleOnlinePayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                >
                    Pay Online with Razorpay
                </button>

                </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}