"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  AlertTriangle,
  Clock,
  Trash2,
  LoaderCircle,
} from "lucide-react";
import { getAlerts, deleteMedicine } from "@/lib/pharmacy";

type Batch = {
  batchNumber?: string;
  batchName?: string;
  expiryDate?: string;
  stock?: number;
  quantity?: number;
};

type Medicine = {
  _id: string;
  id?: string;
  name?: string;
  medicine?: string;
  totalStock?: number;
  stock?: number;
  reorderThreshold?: number;
  reorderLevel?: number;
  batches?: Batch[];
};

function getMedicineName(medicine: Medicine) {
  return medicine.name || medicine.medicine || "Unnamed medicine";
}

function getStock(medicine: Medicine) {
  return medicine.totalStock ?? medicine.stock ?? 0;
}

function getReorderLevel(medicine: Medicine) {
  return medicine.reorderThreshold ?? medicine.reorderLevel ?? 0;
}

function getDaysUntilExpiry(expiryDate?: string) {
  if (!expiryDate) return null;

  const expiry = new Date(expiryDate);
  if (Number.isNaN(expiry.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export default function PharmacyAlertsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    try {
      setLoading(true);
      setError("");

      const response = await getAlerts();

      // Supports both { data: medicines } and { data: { data: medicines } }
      const medicineList = response.data?.data ?? response.data ?? [];

      setMedicines(Array.isArray(medicineList) ? medicineList : []);
    } catch (caughtError) {
      console.error(caughtError);
      setError("Failed to load pharmacy alerts.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteMedicine(id);

      setMedicines((currentMedicines) =>
        currentMedicines.filter((medicine) => medicine._id !== id)
      );
    } catch (caughtError) {
      console.error(caughtError);
      alert("Failed to delete medicine.");
    } finally {
      setDeletingId("");
    }
  }

  const lowStockMedicines = useMemo(() => {
    return medicines.filter(
      (medicine) => getStock(medicine) <= getReorderLevel(medicine)
    );
  }, [medicines]);

  const expiringBatches = useMemo(() => {
    return medicines.flatMap((medicine) =>
      (medicine.batches ?? [])
        .map((batch) => ({
          medicine,
          batch,
          daysRemaining: getDaysUntilExpiry(batch.expiryDate),
        }))
        .filter(
          (item) =>
            item.daysRemaining !== null &&
            item.daysRemaining >= 0 &&
            item.daysRemaining <= 30
        )
    );
  }, [medicines]);

  return (
    <div className="flex min-h-screen bg-muted/50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Inventory Alerts
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track low-stock medicines and batches nearing expiry.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white shadow-lg shadow-rose-200">
              <p className="text-sm font-medium text-white/80">
                Low Stock Medicines
              </p>
              <h2 className="mt-2 text-4xl font-bold">
                {lowStockMedicines.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white shadow-lg shadow-orange-200">
              <p className="text-sm font-medium text-white/80">
                Expiring Within 30 Days
              </p>
              <h2 className="mt-2 text-4xl font-bold">
                {expiringBatches.length}
              </h2>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle size={18} className="animate-spin" />
                Loading alerts...
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 p-6">
                  <AlertTriangle className="text-rose-600" />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Low Stock Alert
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Medicines at or below their reorder threshold.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-4">Medicine</th>
                        <th className="p-4">Current Stock</th>
                        <th className="p-4">Reorder Threshold</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {lowStockMedicines.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-muted-foreground"
                          >
                            No low-stock medicines.
                          </td>
                        </tr>
                      )}

                      {lowStockMedicines.map((medicine) => (
                        <tr key={medicine._id} className="hover:bg-muted/50">
                          <td className="p-4 font-semibold text-card-foreground">
                            {getMedicineName(medicine)}
                          </td>

                          <td className="p-4 font-semibold text-slate-700">
                            {getStock(medicine)}
                          </td>

                          <td className="p-4 text-slate-600">
                            {getReorderLevel(medicine)}
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                              <AlertTriangle size={14} />
                              Reorder Required
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(medicine._id)}
                              disabled={deletingId === medicine._id}
                              title="Delete medicine"
                              className="inline-grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === medicine._id ? (
                                <LoaderCircle
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 p-6">
                  <Clock className="text-amber-600" />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Expiry Alert
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Batches expiring within the next 30 days.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="p-4">Medicine</th>
                        <th className="p-4">Batch</th>
                        <th className="p-4">Expiry Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {expiringBatches.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-8 text-center text-muted-foreground"
                          >
                            No batches expiring within 30 days.
                          </td>
                        </tr>
                      )}

                      {expiringBatches.map(
                        ({ medicine, batch, daysRemaining }, index) => (
                          <tr
                            key={`${medicine._id}-${batch.batchNumber}-${index}`}
                            className="hover:bg-muted/50"
                          >
                            <td className="p-4 font-semibold text-card-foreground">
                              {getMedicineName(medicine)}
                            </td>

                            <td className="p-4 text-slate-600">
                              {batch.batchNumber || batch.batchName || "-"}
                            </td>

                            <td className="p-4 text-slate-600">
                              {batch.expiryDate
                                ? new Date(
                                    batch.expiryDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                <Clock size={14} />
                                {daysRemaining === 0
                                  ? "Expires today"
                                  : `${daysRemaining} days left`}
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleDelete(medicine._id)}
                                disabled={deletingId === medicine._id}
                                title="Delete medicine"
                                className="inline-grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId === medicine._id ? (
                                  <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}