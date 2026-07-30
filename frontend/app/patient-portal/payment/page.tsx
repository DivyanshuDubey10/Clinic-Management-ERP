"use client";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { getMyInvoices } from "@/lib/portal";
import { createRazorpayOrder, verifyPayment } from "@/lib/portal";
import { Currency } from "lucide-react";

interface Window{
  Razorpay: any;
}


export default function PaymentPage() {

  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true);


  useEffect(()=>{
    loadInvoices()
  },[])


  async function loadInvoices() {
    try {
      const response = await getMyInvoices();

      

      setInvoices(response.data)

    } catch (error) {

      console.error(error)
    }finally{

      setLoading(false)
    }
  }


  if(loading){
    return(
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar/>

        <div className="flex-1">
          <Navbar/>

          <main className="p-8">
            Loading invoices...
          </main>
        </div>
      </div>
    )
  }


  // Razor Pay
  const loadRazorPayScript = () => {
    return new Promise<boolean>((resolve) => {
      const existing = document.getElementById("razorpay-script")

      if(existing){
        resolve(true)
        return
      }

      const script = document.createElement("script");
      script.id = "razorpay-script"
      script.src = "https://checkout.razorpay.com/v1/checkout.js"

      script.onload = ()=> resolve(true)
      script.onerror = ()=> resolve(false)

      document.body.appendChild(script);


    })
  }


  const handlePayment = async (invoice: any) => {
    const loaded = await loadRazorPayScript();

    if(!loaded){
      alert("Unable to load Razorpay");
      return;
    }

    try {

      const order = await createRazorpayOrder(invoice._id);

      const options = {
        key: order.data.keyId,
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Clinic Management ERP",
        description: invoice.invoiceNumber,
        order_id: order.data.orderId,


        handler: async function(response: any){
          try {
            await verifyPayment(invoice._id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            alert("Payment Successful!")

            loadInvoices()

          } catch (error) {
            
            console.error(error)
            alert("Payment verification failed")
          }
        },


        prefill:{
          name:"",
          email:"",
          contact:"",
        },

        theme:{
          color: "#0f172a"
        },
      };


      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.open();

    } catch (error: any) {
      error.response?.data?.message || "Unable to initiate payment"
    }
  }




  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar/>

        <main className="p-8 space-y-8">

          <div>
            <h1 className="text-3xl font-bold">
              Payments
            </h1>

            <p className="text-slate-500 mt-2">
              View and pay your outstanding invoices.
            </p>
          </div>

          {invoices.length === 0 ? (
            <div className="bg-white rounded-2xl border p-10 text-center text-slate-500">
              No invoices found.
            </div>

          ):(
            <div className="grid gap-5">

              {invoices.map((invoice) => (

                <div
                  key={invoice._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >
                  <div className="flex justify-between">

                    <div>

                      <h2 className="text-xl font-semibold">
                        {invoice.invoiceNumber}
                      </h2>

                      <p className="text-slate-500 mt-5">
                        {new Date(
                          invoice.createdAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                          invoice.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "Partial"
                          ? "bg-yellow-100 text-yellow-700"
                          :"bg-red-100 text-red-700"
                      }`}
                    >
                      {invoice.status}
                    </span>

                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-6">

                    <div>
                      <p className="text-sm text-slate-500">
                        Grand Total
                      </p>

                      <p className="text-xl font-bold">
                        ₹{invoice.billingDetails.grandTotal}
                      </p>

                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Paid
                      </p>

                      <p className="text-xl font-bold text-green-600">
                        ₹{invoice.billingDetails.amountPaid}
                      </p>

                    </div>


                    <div>
                      <p className="text-sm text-slate-500">
                        Due
                      </p>

                      <p className="text-xl font-bold text-red-600">
                         ₹{invoice.billingDetails.amountDue}
                      </p>

                    </div>

                  </div>


                  {invoice.billingDetails.amountDue > 0 && (

                    <button
                       onClick={()=> handlePayment(invoice)} 
                       className="mt-6 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl transition"
                    >
                       Pay ${invoice.billingDetails.amountDue}
                    </button>
                  )}
                </div>

              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}