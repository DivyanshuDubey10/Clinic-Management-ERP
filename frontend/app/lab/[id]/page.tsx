"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Edit } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import { getLabOrder } from "@/lib/lab";

export default function LabOrderDetailsPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [labOrder, setLabOrder] = useState<any>(null);

  useEffect(() => {
    loadLabOrder();
  }, []);

  const loadLabOrder = async () => {
    try {
      const res = await getLabOrder(id as string);
      setLabOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load lab order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!labOrder) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Lab Order not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-8">

          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-3xl font-bold">
                Lab Order Details
              </h1>

              <p className="text-muted-foreground">
                Review laboratory investigation details.
              </p>
            </div>

            <Link
              href={`/lab/edit/${labOrder._id}`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            >
              <Edit size={18} />
              Update Result
            </Link>

          </div>

          <div className="bg-card rounded-2xl shadow p-8 space-y-6">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-muted-foreground text-sm">
                  Patient
                </p>

                <p className="font-semibold">
                  {labOrder.patientId?.firstName}{" "}
                  {labOrder.patientId?.lastName}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Doctor
                </p>

                <p className="font-semibold">
                  {labOrder.doctorId?.name ||
                    `${labOrder.doctorId?.firstName || ""} ${labOrder.doctorId?.lastName || ""}`}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Test Name
                </p>

                <p className="font-semibold">
                  {labOrder.testName}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Priority
                </p>

                <p className="font-semibold">
                  {labOrder.priority}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Status
                </p>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {labOrder.status}
                </span>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Ordered Date
                </p>

                <p className="font-semibold">
                  {new Date(
                    labOrder.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            <div>

              <p className="text-muted-foreground text-sm mb-2">
                Notes
              </p>

              <div className="border rounded-xl p-4 bg-muted/50">
                {labOrder.notes || "No notes available."}
              </div>

            </div>

            <div>

              <p className="text-muted-foreground text-sm mb-2">
                Result
              </p>

              <div className="border rounded-xl p-4 bg-muted/50 min-h-[120px]">
                {labOrder.result || "Result not available yet."}
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}