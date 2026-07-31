"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import { getLabOrder, updateLabOrder } from "@/lib/lab";

export default function EditLabOrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    status: "",
    result: "",
    notes: "",
  });

  useEffect(() => {
    loadLabOrder();
  }, []);

  const loadLabOrder = async () => {
    try {
      const res = await getLabOrder(id as string);

      setFormData({
        status: res.data.status || "Pending",
        result: res.data.result || "",
        notes: res.data.notes || "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load lab order");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateLabOrder(
        id as string,
        formData
      );

      alert("Lab order updated successfully.");

      router.push(`/lab/${id}`);
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-8 max-w-3xl mx-auto">

          <div className="bg-card rounded-2xl shadow p-8">

            <h1 className="text-3xl font-bold mb-2">
              Update Lab Result
            </h1>

            <p className="text-muted-foreground mb-8">
              Update the laboratory investigation.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>
                <label className="block mb-2 font-medium">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                >
                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Sample Collected">
                    Sample Collected
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Result
                </label>

                <textarea
                  rows={8}
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Enter laboratory findings..."
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Notes
                </label>

                <textarea
                  rows={4}
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                  placeholder="Additional notes..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                {saving
                  ? "Saving..."
                  : "Update Lab Result"}
              </button>

            </form>

          </div>

        </main>
      </div>
    </div>
  );
}