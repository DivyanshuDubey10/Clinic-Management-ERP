// "use client";

// import { useEffect, useState, type ChangeEvent } from "react";
// import { CheckCircle2, Edit3, LoaderCircle, Save, X } from "lucide-react";
// import { getProfile, updateProfile } from "@/lib/auth";

// type ProfileForm = { name: string; email: string; role: string; phone: string; specialization: string; consultationHours: string };
// const emptyForm: ProfileForm = { name: "", email: "", role: "", phone: "", specialization: "", consultationHours: "" };

// export default function PersonalInfo() {
//   const [form, setForm] = useState<ProfileForm>(emptyForm);
//   const [savedForm, setSavedForm] = useState<ProfileForm>(emptyForm);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

//   useEffect(() => {
//     async function loadProfile() {
//       try {
//         const profile = { ...emptyForm, ...getProfile ? (await getProfile()).user : {} };
//         setForm(profile); setSavedForm(profile);
//       } catch (error) { console.error(error); }
//     }
//     loadProfile();
//   }, []);

//   function handleChange(event: ChangeEvent<HTMLInputElement>) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
//   function cancelEdit() { setForm(savedForm); setEditing(false); setMessage(null); }
//   async function handleSave() {
//     try {
//       setLoading(true); setMessage(null);
//       await updateProfile({ name: form.name, email: form.email, phone: form.phone, specialization: form.specialization, consultationHours: form.consultationHours });
//       const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
//       localStorage.setItem("user", JSON.stringify({ ...cachedUser, ...form }));
//       setSavedForm(form); setEditing(false); setMessage({ text: "Profile updated successfully.", success: true });
//     } catch (error) { console.error(error); setMessage({ text: "We couldn't update your profile. Please try again.", success: false }); }
//     finally { setLoading(false); }
//   }

//   return (
//     <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
//       <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-bold text-slate-900">Personal Information</h2><p className="mt-1 text-sm text-slate-500">Keep your contact information up to date.</p></div>
//         {!editing ? <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"><Edit3 size={16} />Edit profile</button> : <div className="flex gap-2"><button type="button" onClick={cancelEdit} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"><X size={16} />Cancel</button><button type="button" onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{loading ? "Saving" : "Save changes"}</button></div>}
//       </div>

//       {message && <div className={`mb-6 flex items-center gap-2 rounded-xl border p-3 text-sm ${message.success ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}><CheckCircle2 size={17} />{message.text}</div>}

//       <div className="grid gap-5 md:grid-cols-2">
//         <Input label="Full name" name="name" value={form.name} onChange={handleChange} disabled={!editing} />
//         <Input label="Email address" name="email" type="email" value={form.email} onChange={handleChange} disabled={!editing} />
//         <Input label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={!editing} />
//         <Input label="Role" name="role" value={form.role} disabled />
//         {form.role.toLowerCase() === "doctor" && <><Input label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} disabled={!editing} /><Input label="Consultation hours" name="consultationHours" value={form.consultationHours} onChange={handleChange} disabled={!editing} /></>}
//       </div>
//     </section>
//   );
// }

// function Input({ label, name, value, onChange, disabled, type = "text" }: { label: string; name: keyof ProfileForm; value: string; onChange?: (event: ChangeEvent<HTMLInputElement>) => void; disabled: boolean; type?: string }) {
//   return <label className="block"><span className="text-sm font-medium text-slate-700">{label}</span><input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className={`mt-2 h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition ${disabled ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-500" : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"}`} /></label>;
// }

"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { CheckCircle2, Edit3, LoaderCircle, Save, X } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/auth";

type ProfileForm = { name: string; email: string; role: string; phone: string; specialization: string; consultationHours: string };
const emptyForm: ProfileForm = { name: "", email: "", role: "", phone: "", specialization: "", consultationHours: "" };

export default function PersonalInfo() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [savedForm, setSavedForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = { ...emptyForm, ...getProfile ? (await getProfile()).user : {} };
        setForm(profile); setSavedForm(profile);
      } catch (error) { console.error(error); }
    }
    loadProfile();
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  function cancelEdit() { setForm(savedForm); setEditing(false); setMessage(null); }
  async function handleSave() {
    try {
      setLoading(true); setMessage(null);
      await updateProfile({ name: form.name, email: form.email, phone: form.phone, specialization: form.specialization, consultationHours: form.consultationHours });
      const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...cachedUser, ...form }));
      setSavedForm(form); setEditing(false); setMessage({ text: "Profile updated successfully.", success: true });
    } catch (error) { console.error(error); setMessage({ text: "We couldn't update your profile. Please try again.", success: false }); }
    finally { setLoading(false); }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-bold text-slate-900">Personal Information</h2><p className="mt-1 text-sm text-slate-500">Keep your contact information up to date.</p></div>
        {!editing ? <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"><Edit3 size={16} />Edit profile</button> : <div className="flex gap-2"><button type="button" onClick={cancelEdit} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"><X size={16} />Cancel</button><button type="button" onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{loading ? "Saving" : "Save changes"}</button></div>}
      </div>

      {message && <div className={`mb-6 flex items-center gap-2 rounded-xl border p-3 text-sm ${message.success ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-rose-100 bg-rose-50 text-rose-700"}`}><CheckCircle2 size={17} />{message.text}</div>}

      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Full name" name="name" value={form.name} onChange={handleChange} disabled={!editing} />
        <Input label="Email address" name="email" type="email" value={form.email} onChange={handleChange} disabled={!editing} />
        <Input label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={!editing} />
        <Input label="Role" name="role" value={form.role} disabled />
        {form.role.toLowerCase() === "doctor" && <><Input label="Specialization" name="specialization" value={form.specialization} onChange={handleChange} disabled={!editing} /><Input label="Consultation hours" name="consultationHours" value={form.consultationHours} onChange={handleChange} disabled={!editing} /></>}
      </div>
    </section>
  );
}

function Input({ label, name, value, onChange, disabled, type = "text" }: { label: string; name: keyof ProfileForm; value: string; onChange?: (event: ChangeEvent<HTMLInputElement>) => void; disabled: boolean; type?: string }) {
  return <label className="block"><span className="text-sm font-medium text-slate-700">{label}</span><input type={type} name={name} value={value} onChange={onChange} disabled={disabled} className={`mt-2 h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition ${disabled ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-500" : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"}`} /></label>;
}
