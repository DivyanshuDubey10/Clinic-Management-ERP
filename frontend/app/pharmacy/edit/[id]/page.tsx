"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, LoaderCircle, Save } from "lucide-react";
import {
  getMedicineById,
  updateMedicine,
} from "@/lib/pharmacy";

export default function EditMedicinePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    manufacturer: "",
    category: "",
    price: "",
    stock: "",
    reorderLevel: "",
    expiryDate: "",
    batchNumber: "",
  });

  useEffect(() => {
    loadMedicine();
  }, []);

  async function loadMedicine() {
    try {
      const response = await getMedicineById(id as string);

      const medicine = response.data ?? response;

      setForm({
        name: medicine.name || "",
        genericName: medicine.genericName || "",
        manufacturer: medicine.manufacturer || "",
        category: medicine.category || "",
        price: medicine.unitPrice || medicine.price || "",
        stock: medicine.stock || medicine.totalStock || "",
        reorderLevel:
          medicine.reorderLevel ||
          medicine.reorderThreshold ||
          "",
        expiryDate: medicine.expiryDate
          ? medicine.expiryDate.slice(0, 10)
          : "",
        batchNumber: medicine.batchNumber || "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load medicine.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await updateMedicine(id as string, {
        name: form.name,
        genericName: form.genericName,
        category: form.category,
        manufacturer: form.manufacturer,
        unitPrice: Number(form.price),
        reorderThreshold: Number(form.reorderLevel),
        stock: Number(form.stock),
        expiryDate: form.expiryDate,
        batchNumber: form.batchNumber
      });

      alert("Medicine updated successfully.");

      router.push("/pharmacy");
    } catch (err) {
      console.error(err);
      alert("Failed to update medicine.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/50">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="mx-auto max-w-4xl p-8">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-cyan-600 hover:text-cyan-700"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="rounded-2xl bg-card p-8 shadow">
            <h1 className="mb-8 text-3xl font-bold">
              Edit Medicine
            </h1>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 md:grid-cols-2"
            >
              <Input
                label="Medicine Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <Input
                label="Generic Name"
                name="genericName"
                value={form.genericName}
                onChange={handleChange}
              />

              <Input
                label="Manufacturer"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
              />

              <Input
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
              />

              <Input
                label="Price"
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
              />

              <Input
                label="Stock"
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
              />

              <Input
                label="Reorder Level"
                name="reorderLevel"
                type="number"
                value={form.reorderLevel}
                onChange={handleChange}
              />

              <Input
                label="Batch Number"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
              />

              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
              />

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={18} />
                  )}

                  {saving ? "Saving..." : "Update Medicine"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-border px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
      />
    </div>
  );
}