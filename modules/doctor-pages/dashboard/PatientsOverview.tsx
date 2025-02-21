"use client";

import React from "react";

function PatientsOverview() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-medium mb-4">Patients Overview</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Total Patients</span>
            <span className="text-sm font-medium">142</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: "75%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Previous: 128</span>
            <span className="text-xs text-green-500">+14 this month</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">New Patients</span>
            <span className="text-sm font-medium">21</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: "25%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Previous: 18</span>
            <span className="text-xs text-green-500">+3 this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsOverview;