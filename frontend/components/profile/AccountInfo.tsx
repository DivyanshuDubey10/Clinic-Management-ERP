"use client";

import { Shield, Clock, Calendar } from "lucide-react";

export default function AccountInfo() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      <h2 className="text-2xl font-bold mb-8">
        Account Information
      </h2>

      <div className="space-y-6">

        <div className="flex items-center gap-4">

          <Calendar className="text-blue-600"/>

          <div>

            <p className="text-gray-500">
              Member Since
            </p>

            <h3 className="font-semibold">
              July 2026
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <Clock className="text-green-600"/>

          <div>

            <p className="text-gray-500">
              Last Login
            </p>

            <h3 className="font-semibold">
              Today
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <Shield className="text-purple-600"/>

          <div>

            <p className="text-gray-500">
              Account Status
            </p>

            <h3 className="font-semibold text-green-600">
              Verified
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
}