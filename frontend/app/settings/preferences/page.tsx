"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function PreferencesSettingsPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalOffers: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem("ziva_preferences");
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("ziva_preferences", JSON.stringify(preferences));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="font-medium text-gray-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span className={`block w-4 h-4 rounded-full bg-card absolute top-1 transition-all ${checked ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-card-foreground">Notification Preferences</h1>
            <p className="text-muted-foreground mt-2">Manage how Ziva Care communicates with you.</p>
          </div>

          <div className="bg-card rounded-xl shadow p-6 max-w-lg">
            <h2 className="text-xl font-semibold mb-6">Communication Settings</h2>
            
            {saved && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Preferences saved successfully.</div>}

            <div className="space-y-2">
              <Toggle
                label="Email Notifications"
                checked={preferences.emailNotifications}
                onChange={(c) => setPreferences({ ...preferences, emailNotifications: c })}
              />
              <Toggle
                label="SMS Notifications"
                checked={preferences.smsNotifications}
                onChange={(c) => setPreferences({ ...preferences, smsNotifications: c })}
              />
              <Toggle
                label="Appointment Reminders"
                checked={preferences.appointmentReminders}
                onChange={(c) => setPreferences({ ...preferences, appointmentReminders: c })}
              />
              <Toggle
                label="Promotional Offers"
                checked={preferences.promotionalOffers}
                onChange={(c) => setPreferences({ ...preferences, promotionalOffers: c })}
              />
            </div>

            <div className="pt-6">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition w-full"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
