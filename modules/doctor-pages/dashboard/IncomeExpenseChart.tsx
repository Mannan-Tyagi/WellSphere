"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const data = {
  labels: months.slice(-6),
  datasets: [
    {
      label: "Income",
      data: [4500, 5200, 3800, 5100, 4900, 5400],
      backgroundColor: "rgb(34, 197, 94)",
    },
    {
      label: "Expenses",
      data: [2800, 3100, 2700, 3200, 2900, 3400],
      backgroundColor: "rgb(249, 115, 22)",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

function IncomeExpenseChart() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">Income & Expense</h3>
          <p className="text-sm text-gray-500">Last 6 months comparison</p>
        </div>
        <select className="text-sm border rounded-lg px-2 py-1">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>This month</option>
        </select>
      </div>
      <div className="h-[300px]">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}

export default IncomeExpenseChart;