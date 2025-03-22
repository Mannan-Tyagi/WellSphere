"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale);

const data = {
  labels: ["Internet", "Electricity", "Transactions", "Rental Cost", "Foods", "Other"],
  datasets: [
    {
      data: [45, 26, 22, 8, 3, 2],
      backgroundColor: [
        "#6366F1", // indigo-500
        "#10B981", // green-500
        "#F97316", // orange-500
        "#FACC15", // yellow-400 for Rental Cost
        "#EC4899", // pink-500 for Foods
        "#A3A3A3", // gray-500 for Other
      ],
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  ],
};

const options = {
  cutout: "65%",
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1f2937",
      titleFont: {
        size: 16,
        weight: "600",
      },
      bodyFont: {
        size: 14,
      },
      xPadding: 12,
      yPadding: 12,
      borderRadius: 8,
    },
  },
  animation: {
    animateScale: true,
    animateRotate: true,
  },
};

type ChartLegendProps = {
  label: string;
  color: string;
  percentage: string;
};

const ChartLegend = ({ label, color, percentage }: ChartLegendProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-700">{percentage}</span>
  </div>
);

const ExpensesChart = () => {
  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-white via-gray-100 to-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Monthly Expenses</h2>
          <p className="text-sm text-gray-500">Overview of last 6 months</p>
        </div>
        <select className="bg-white border border-gray-300 rounded-xl p-2 text-sm shadow-sm focus:outline-none">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last month</option>
        </select>
      </div>
      <div className="relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700">$1,234</h3>
          <p className="text-xs text-gray-500">Total Expenses</p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <ChartLegend label="Internet" color="bg-indigo-500" percentage="45%" />
        <ChartLegend label="Electricity" color="bg-green-500" percentage="26%" />
        <ChartLegend label="Transactions" color="bg-orange-500" percentage="22%" />
        <ChartLegend label="Rental Cost" color="bg-yellow-400" percentage="8%" />
        <ChartLegend label="Foods" color="bg-pink-500" percentage="3%" />
        <ChartLegend label="Other" color="bg-gray-500" percentage="2%" />
      </div>
    </div>
  );
};

export default ExpensesChart;