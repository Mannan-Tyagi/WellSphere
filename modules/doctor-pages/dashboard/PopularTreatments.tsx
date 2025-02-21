"use client";

import React from "react";
import { Star, ArrowUpRight, ArrowDownRight } from "lucide-react";

function PopularTreatments() {
  const treatments = [
    {
      name: "Scaling Teeth",
      rating: 4.7,
      patients: 432,
      change: "+12%",
      changeType: "up",
    },
    {
      name: "Tooth Extraction",
      rating: 4.4,
      patients: 287,
      change: "-3%",
      changeType: "down",
    },
    {
      name: "General Checkup",
      rating: 4.6,
      patients: 658,
      change: "+8%",
      changeType: "up",
    },
  ];

  const changeIcon = (changeType: string) => {
    if (changeType === "up") {
      return (
        <span className="text-green-500 text-sm flex items-center">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          {""}
        </span>
      );
    }
    return (
      <span className="text-red-500 text-sm flex items-center">
        <ArrowDownRight className="w-4 h-4 mr-1" />
        {""}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">Popular Treatments</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="space-y-6">
        {treatments.map((treatment, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium">{treatment.name}</span>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{treatment.rating}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-600">{treatment.patients} patients</span>
              </div>
            </div>
            <div className="flex items-center">
              {changeIcon(treatment.changeType)}
              <span
                className={`${
                  treatment.changeType === "up" ? "text-green-500" : "text-red-500"
                } text-sm`}
              >
                {treatment.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularTreatments;