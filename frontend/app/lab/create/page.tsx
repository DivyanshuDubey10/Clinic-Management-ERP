"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getPatients } from "@/lib/patient";
import { getConsultations } from "@/lib/patientPortal";
import { createLabOrder } from "@/lib/lab";

type Patient = { _id: string; firstName?: string; lastName?: string; name?: string };
type Consultation = {
  _id: string;
  symptoms?: string;
  diagnosis?: string;
  doctorId?: string | { _id: string };
  doctor?: string | { _id: string; name?: string };
};

const doctorIdFor = (consultation?: Consultation) => {
  const doctor = consultation?.doctorId ?? consultation?.doctor;
  return typeof doctor === "string" ? doctor : doctor?._id || "";
};

export default function CreateLabOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [formData, setFormData] = useState({ patientId: "", consultationId: "", doctorId: "", testName: "", priority: "Routine", notes: "" });

  useEffect(() => {
    getPatients().then((response) => setPatients(response.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.patientId) { setConsultations([]); return; }
    getConsultations({ patientId: formData.patientId }).then((response) => setConsultations(response.data || [])).catch(console.error);
  }, [formData.patientId]);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    if (name === "patientId") {
      setFormData((current) => ({ ...current, patientId: value, consultationId: "", doctorId: "" }));
      return;
    }
    if (name === "consultationId") {
      const consultation = consultations.find((item) => item._id === value);
      setFormData((current) => ({ ...current, consultationId: value, doctorId: doctorIdFor(consultation) }));
      return;
    }
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!formData.doctorId) { setError("The selected consultation has no doctor assigned. Please choose another consultation."); return; }

    try {
      setLoading(true);
      await createLabOrder({
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        consultationId: formData.consultationId,
        tests: [formData.testName.trim()],
        priority: formData.priority,
        notes: formData.notes.trim(),
      });
      router.push("/lab");
    } catch (caughtError: unknown) {
      const message = typeof caughtError === "object" && caughtError !== null && "response" in caughtError ? (caughtError as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
      setError(message || "Failed to create the lab order.");
    } finally { setLoading(false); }
  }

  return <div className="flex min-h-screen bg-slate-50"><Sidebar /><div className="min-w-0 flex-1"><Navbar /><main className="mx-auto max-w-3xl p-5 sm:p-8"><h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Lab Order</h1><p className="mt-2 text-slate-500">Order laboratory investigations for a patient consultation.</p>
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Select label="Patient" name="patientId" value={formData.patientId} onChange={handleChange} required><option value="">Select patient</option>{patients.map((patient) => <option key={patient._id} value={patient._id}>{patient.name || `${patient.firstName || ""} ${patient.lastName || ""}`.trim()}</option>)}</Select>
      <Select label="Consultation" name="consultationId" value={formData.consultationId} onChange={handleChange} required disabled={!formData.patientId}><option value="">{formData.patientId ? "Select consultation" : "Select a patient first"}</option>{consultations.map((consultation) => <option key={consultation._id} value={consultation._id}>{consultation.symptoms || consultation.diagnosis || `Consultation ${consultation._id.slice(-6)}`}</option>)}</Select>
      <Field label="Test name"><input required name="testName" value={formData.testName} onChange={handleChange} placeholder="CBC, X-Ray Chest, MRI Brain..." className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" /></Field>
      <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange}><option value="Routine">Routine</option><option value="Urgent">Urgent</option><option value="Stat">Stat</option></Select>
      <Field label="Notes (optional)"><textarea rows={4} name="notes" value={formData.notes} onChange={handleChange} placeholder="Additional instructions..." className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100" /></Field>
      {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating…" : "Create Lab Order"}</button>
    </form></main></div></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>{children}</label>; }
function Select({ label, children, ...props }: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) { return <Field label={label}><select {...props} className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-50">{children}</select></Field>; }
