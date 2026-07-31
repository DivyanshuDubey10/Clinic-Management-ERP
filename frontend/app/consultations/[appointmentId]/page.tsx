"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { getAppointment } from "@/lib/appointment";
import { createConsultation, getConsultationByAppointment, updateConsultation } from "@/lib/consultation";

const emptyForm = { symptoms: "", examinationFindings: "", diagnosis: "", treatmentPlan: "", followUpDate: "" };

export default function ConsultationPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<any>(null);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const appointmentResponse = await getAppointment(appointmentId);
        setAppointment(appointmentResponse.data.data);
        try {
          const consultationResponse = await getConsultationByAppointment(appointmentId);
          const consultation = consultationResponse.data.consultation;
          setConsultationId(consultation._id);
          setForm({
            symptoms: consultation.symptoms || "",
            examinationFindings: consultation.examinationFindings || "",
            diagnosis: consultation.diagnosis || "",
            treatmentPlan: consultation.treatmentPlan || "",
            followUpDate: consultation.followUpDate ? consultation.followUpDate.slice(0, 10) : ""
          });
        } catch (consultationError: any) {
          if (consultationError.response?.status !== 404) throw consultationError;
        }
      } catch (loadError: any) {
        setError(loadError.response?.data?.message || "Unable to load this appointment.");
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, [appointmentId]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.symptoms.trim() || !form.diagnosis.trim() || !form.treatmentPlan.trim()) {
      setError("Symptoms, diagnosis, and treatment plan are required.");
      return;
    }
    setSaving(true); setError(""); setMessage("");
    try {
      const payload = { ...form, followUpDate: form.followUpDate || undefined };
      if (consultationId) {
        await updateConsultation(consultationId, { ...payload, status: "Completed" });
      } else {
        const response = await createConsultation({ appointmentId, ...payload });
        setConsultationId(response.data._id);
      }
      setMessage("Consultation saved successfully.");
    } catch (saveError: any) {
      setError(saveError.response?.data?.message || "Unable to save the consultation.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-screen bg-muted/30"><Sidebar /><div className="flex-1"><Navbar /><main className="p-8">Loading consultation workspace...</main></div></div>;
  if (!appointment) return <div className="flex min-h-screen bg-muted/30"><Sidebar /><div className="flex-1"><Navbar /><main className="p-8">{error || "Appointment not found."}</main></div></div>;

  return <div className="flex min-h-screen bg-muted/30"><Sidebar /><div className="flex-1"><Navbar /><main className="mx-auto max-w-5xl p-6 sm:p-8">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-3xl font-bold text-foreground">Consultation workspace</h1><p className="mt-1 text-muted-foreground">Record the clinical SOAP note for this appointment.</p></div><button type="button" onClick={() => router.push("/consultations")} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-slate-700">Back to consultations</button></div>
    <section className="mb-6 rounded-xl bg-card p-6 shadow"><h2 className="mb-4 text-lg font-semibold">Appointment and patient</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Info label="Patient" value={`${appointment.patientId?.firstName || ""} ${appointment.patientId?.lastName || ""}`.trim() || "-"} /><Info label="Doctor" value={appointment.doctorId?.name || "-"} /><Info label="Appointment" value={appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleString() : "-"} /><Info label="Reason for visit" value={appointment.reasonForVisit || "-"} /><Info label="Status" value={appointment.status || "-"} /></div></section>
    <form onSubmit={handleSubmit} className="rounded-xl bg-card p-6 shadow"><div className="mb-6"><h2 className="text-xl font-semibold">SOAP clinical note</h2><p className="mt-1 text-sm text-muted-foreground">S: symptoms, O: examination findings, A: diagnosis, P: treatment and follow-up.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</p>}<div className="space-y-5"><TextArea label="Subjective — symptoms" name="symptoms" value={form.symptoms} onChange={(value) => setForm({ ...form, symptoms: value })} placeholder="Patient complaints and history" /><TextArea label="Objective — examination findings" name="examinationFindings" value={form.examinationFindings} onChange={(value) => setForm({ ...form, examinationFindings: value })} placeholder="Vitals, examination, and observations" /><TextArea label="Assessment — diagnosis" name="diagnosis" value={form.diagnosis} onChange={(value) => setForm({ ...form, diagnosis: value })} placeholder="Clinical assessment or diagnosis" /><TextArea label="Plan — treatment plan" name="treatmentPlan" value={form.treatmentPlan} onChange={(value) => setForm({ ...form, treatmentPlan: value })} placeholder="Treatment, advice, and next steps" /><label className="block max-w-sm text-sm font-medium text-slate-700">Follow-up date<input type="date" value={form.followUpDate} onChange={(event) => setForm({ ...form, followUpDate: event.target.value })} className="mt-2 w-full rounded-lg border border-border p-3" /></label></div><div className="mt-7 flex justify-end"><button disabled={saving} className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white disabled:opacity-60">{saving ? "Saving..." : consultationId ? "Update consultation" : "Save consultation"}</button></div></form>
  </main></div></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 font-medium text-foreground">{value}</p></div>; }
function TextArea({ label, value, onChange, placeholder }: { label: string; name: string; value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="block text-sm font-medium text-slate-700">{label}<textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-lg border border-border p-3 font-normal" /></label>; }
