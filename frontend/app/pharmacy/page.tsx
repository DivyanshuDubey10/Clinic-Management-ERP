"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  LoaderCircle,
} from "lucide-react";
import { getMedicines, deleteMedicine } from "@/lib/pharmacy";

type Medicine = {
  _id: string;
  name?: string;
  batchName?: string;
  batchNumber?: string;
  expiryDate?: string;
  stock?: number;
  totalStock?: number;
  reorderLevel?: number;
  reorderThreshold?: number;
  batches?: {
    batchName?: string;
    batchNumber?: string;
    expiryDate?: string;
    stock?: number;
    quantity?: number;
  }[];
};

function getBatch(medicine: Medicine) {
  return medicine.batches?.[0] ?? medicine;
}

function getStock(medicine: Medicine) {
  const batch = getBatch(medicine);

  return (
    medicine.totalStock ??
    medicine.stock ??
    batch.stock ??
    // batch.quantity ??
    0
  );
}

function getReorderLevel(medicine: Medicine) {
  return medicine.reorderThreshold ?? medicine.reorderLevel ?? 0;
}

function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "-"
    : parsedDate.toLocaleDateString();
}

export default function PharmacyPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {
    try {
      setLoading(true);
      setError("");

      const response = await getMedicines();

      // Supports both: { data: medicines } and { data: { data: medicines } }
      const medicineList = response.data?.data ?? response.data ?? [];

      setMedicines(Array.isArray(medicineList) ? medicineList : []);
    } catch (caughtError) {
      console.error(caughtError);
      setError("Failed to load medicines.");
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

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) =>
      (medicine.name ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }, [medicines, search]);

  const lowStockCount = medicines.filter(
    (medicine) => getStock(medicine) <= getReorderLevel(medicine)
  ).length;

  const inStockCount = medicines.filter(
    (medicine) => getStock(medicine) > getReorderLevel(medicine)
  ).length;

  return (
    <div className="flex min-h-screen bg-muted/50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto max-w-7xl p-5 sm:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={16} className="text-cyan-600" />
                Pharmacy
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Pharmacy Inventory
              </h1>

              <p className="mt-2 text-muted-foreground">
                Manage medicines, stock levels, and inventory alerts.
              </p>
            </div>

            <Link
              href="/pharmacy/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-700"
            >
              <Plus size={18} />
              Add Medicine
            </Link>
          </div>

          <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Medicines" value={medicines.length} />

            <StatCard
              label="Low Stock"
              value={lowStockCount}
              valueClassName="text-rose-600"
            />

            <StatCard
              label="In Stock"
              value={inStockCount}
              valueClassName="text-emerald-600"
            />

            <StatCard
              label="Inventory Alerts"
              value={lowStockCount}
              valueClassName="text-orange-600"
            />
          </div>

          <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-border py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px]">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4 font-semibold">Medicine ID</th>
                    <th className="p-4 font-semibold">Medicine</th>
                    <th className="p-4 font-semibold">Batch</th>
                    <th className="p-4 font-semibold">Expiry</th>
                    <th className="p-4 font-semibold">Stock</th>
                    <th className="p-4 font-semibold">Reorder Level</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {loading && (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                          <LoaderCircle size={18} className="animate-spin" />
                          Loading medicines...
                        </span>
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-rose-600">
                        {error}
                      </td>
                    </tr>
                  )}

                  {!loading && !error && filteredMedicines.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-10 text-center text-muted-foreground">
                        No medicines found.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    !error &&
                    filteredMedicines.map((medicine) => {
                      const batch = getBatch(medicine);
                      const stock = getStock(medicine);
                      const reorderLevel = getReorderLevel(medicine);
                      const isLowStock = stock <= reorderLevel;

                      return (
                        <tr
                          key={medicine._id}
                          className="transition hover:bg-muted/50/80"
                        >
                          <td className="p-4 font-mono text-xs font-semibold text-slate-600">
                            {medicine._id.slice(-6).toUpperCase()}
                          </td>

                          <td className="p-4 font-semibold text-card-foreground">
                            {medicine.name || "Unnamed medicine"}
                          </td>

                          <td className="p-4 text-slate-600">
                            {batch.batchNumber || batch.batchName || "-"}
                          </td>

                          <td className="p-4 text-slate-600">
                            {formatDate(batch.expiryDate)}
                          </td>

                          <td className="p-4 font-semibold text-card-foreground">
                            {stock}
                          </td>

                          <td className="p-4 text-slate-600">
                            {reorderLevel}
                          </td>

                          <td className="p-4">
                            {isLowStock ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                                <AlertTriangle size={14} />
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/pharmacy/edit/${medicine._id}`)
                                }
                                title="Edit medicine"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                              >
                                <Edit size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(medicine._id)}
                                disabled={deletingId === medicine._id}
                                title="Delete medicine"
                                className="grid h-9 w-9 place-items-center rounded-lg bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingId === medicine._id ? (
                                  <LoaderCircle size={17} className="animate-spin" />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <h2 className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</h2>
    </div>
  );
}