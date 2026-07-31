"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { getPatients } from "@/lib/patient";
import { getMedicines } from "@/lib/pharmacy";
import { LoaderCircle, Search, User, Package, ChevronRight } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [patientsRes, medicinesRes] = await Promise.allSettled([
          getPatients(),
          getMedicines()
        ]);

        let allPatients = [];
        let allMedicines = [];

        if (patientsRes.status === "fulfilled") {
          allPatients = patientsRes.value?.data || [];
        }

        if (medicinesRes.status === "fulfilled") {
          allMedicines = medicinesRes.value?.data?.data || medicinesRes.value?.data || [];
        }

        const qLower = query.toLowerCase();

        setPatients(
          allPatients.filter((p: any) =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(qLower) ||
            p.phone?.toLowerCase().includes(qLower) ||
            p.patientId?.toLowerCase().includes(qLower)
          )
        );

        setMedicines(
          allMedicines.filter((m: any) =>
            m.name?.toLowerCase().includes(qLower) ||
            m._id?.toLowerCase().includes(qLower)
          )
        );

      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Search Results
        </h1>
        <p className="text-slate-500">
          Showing results for <span className="font-semibold text-slate-800">&quot;{query}&quot;</span>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 text-slate-500">
          <LoaderCircle size={32} className="animate-spin mr-3 text-cyan-600" />
          <span>Searching...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {!query ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500">
              <Search size={48} className="mx-auto mb-4 text-slate-300" />
              <p>Type something in the global search bar to see results.</p>
            </div>
          ) : patients.length === 0 && medicines.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500">
              <Search size={48} className="mx-auto mb-4 text-slate-300" />
              <p>No results found for &quot;{query}&quot;.</p>
            </div>
          ) : (
            <>
              {patients.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Patients ({patients.length})</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {patients.map(patient => (
                      <Link 
                        href={`/patients/${patient._id}`} 
                        key={patient._id}
                        className="flex items-center justify-between p-5 hover:bg-slate-50 transition"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-sm text-slate-500 flex gap-4 mt-1">
                            <span>ID: {patient.patientId || patient._id.slice(-6).toUpperCase()}</span>
                            <span>Phone: {patient.phone}</span>
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {medicines.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="border-b border-slate-100 bg-slate-50/50 p-5 flex items-center gap-3">
                    <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                      <Package size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Medicines ({medicines.length})</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {medicines.map(medicine => (
                      <Link 
                        href={`/pharmacy/edit/${medicine._id}`} 
                        key={medicine._id}
                        className="flex items-center justify-between p-5 hover:bg-slate-50 transition"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {medicine.name}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            ID: {medicine._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-slate-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Navbar />
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
