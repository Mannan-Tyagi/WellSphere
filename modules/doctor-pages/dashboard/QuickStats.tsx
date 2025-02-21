"use client";

import React from "react";
import { Users, Calendar, Stethoscope, UserCog, ArrowUpRight, ArrowDownRight } from "lucide-react";

function QuickStats() {
  const stats = [
    {
      label: "Total Patients",
      value: "1,482",
      change: "12%",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      trend: "up",
    },
    {
      label: "Today's Appointments",
      value: "48",
      change: "8%",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      trend: "up",
    },
    {
      label: "Surgeries This Week",
      value: "24",
      change: "3%",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      icon: <Stethoscope className="w-6 h-6 text-purple-600" />,
      trend: "down",
    },
    {
      label: "Active Staff",
      value: "128",
      change: "5%",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: <UserCog className="w-6 h-6 text-orange-600" />,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 ${stat.iconBg} rounded-lg`}>{stat.icon}</div>
            {stat.trend === "up" ? (
              <span className="text-sm text-green-500 flex items-center">
                <ArrowUpRight className="w-4 h-4" />
                {stat.change}
              </span>
            ) : (
              <span className="text-sm text-red-500 flex items-center">
                <ArrowDownRight className="w-4 h-4" />
                {stat.change}
              </span>
            )}
          </div>
          <h4 className="text-lg font-semibold mb-1">{stat.value}</h4>
          <p className="text-gray-500 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;