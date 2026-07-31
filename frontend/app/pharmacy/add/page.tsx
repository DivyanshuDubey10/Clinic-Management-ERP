"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LoaderCircle, PackagePlus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { addMedicine } from "@/lib/pharmacy";

export default function AddMedicinePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    category: "Tablet",
    manufacturer: "",
    unitPrice: "",
    purchasePrice:"",
    reorderThreshold: "50",
    batchNumber: "",
    expiryDate: "",
    openingStock: "",
  });

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const unitPrice = Number(formData.unitPrice);
    const reorderThreshold = Number(formData.reorderThreshold);
    const openingStock = Number(formData.openingStock);

    if (unitPrice < 0 || reorderThreshold < 0 || openingStock < 0) {
      setError("Price and stock values cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      await addMedicine({
        name: formData.name.trim(),
        genericName: formData.genericName.trim(),
        category: formData.category,
        manufacturer: formData.manufacturer.trim(),
        unitPrice,

        // Used by the pharmacy inventory table
        totalStock: openingStock,
        reorderThreshold,

        // Used for batch and expiry columns
        batches: [
          {
            batchNumber: formData.batchNumber.trim(),
            expiryDate: formData.expiryDate,
            quantity: openingStock,
            purchasePrice:Number(formData.purchasePrice)
          },
        ],
      });

      router.push("/pharmacy");
    } catch (caughtError: unknown) {
      const message =
        typeof caughtError === "object" &&
        caughtError !== null &&
        "response" in caughtError
          ? (
              caughtError as {
                response?: { data?: { message?: string } };
              }
            ).response?.data?.message
          : undefined;

      setError(message || "Failed to add medicine.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="mx-auto max-w-3xl p-5 sm:p-8">
          <div className="mb-8">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <PackagePlus size={22} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Add Medicine
            </h1>

            <p className="mt-2 text-muted-foreground">
              Add medicine details, batch information, and opening stock.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <section>
              <h2 className="text-lg font-bold text-foreground">
                Medicine Details
              </h2>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <Field label="Medicine Name">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Paracetamol 500mg"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Generic / Brand Name">
                  <input
                    type="text"
                    name="genericName"
                    value={formData.genericName}
                    onChange={handleChange}
                    placeholder="e.g. Crocin"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Category">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                    <option value="Drops">Drops</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <Field label="Manufacturer">
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="e.g. Sun Pharma"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Unit Price">
                  <input
                    type="number"
                    name="unitPrice"
                    value={formData.unitPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Reorder Threshold">
                  <input
                    type="number"
                    name="reorderThreshold"
                    value={formData.reorderThreshold}
                    onChange={handleChange}
                    min="0"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Purchase Price">
                    <input
                        type="number"
                        name="purchasePrice"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full rounded-xl border border-border px-3.5 py-3 text-sm 
                        outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    />
                    </Field>
              </div>
            </section>

            <section className="mt-8 border-t border-slate-100 pt-8">
              <h2 className="text-lg font-bold text-foreground">
                Initial Batch & Stock
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                This information will appear in the pharmacy inventory table.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <Field label="Batch Number">
                  <input
                    type="text"
                    name="batchNumber"
                    value={formData.batchNumber}
                    onChange={handleChange}
                    placeholder="e.g. PCM-2026-01"
                    required
                    className="input"
                  />
                </Field>

                <Field label="Expiry Date">
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </Field>

                <Field label="Opening Stock">
                  <input
                    type="number"
                    name="openingStock"
                    value={formData.openingStock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    required
                    className="input"
                  />
                </Field>
              </div>
            </section>

            {error && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/pharmacy")}
                disabled={loading}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-muted/50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <LoaderCircle size={17} className="animate-spin" />}
                {loading ? "Adding Medicine..." : "Add Medicine"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}