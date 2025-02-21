"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ArrowUpRight } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const data = {
  labels: months,
  datasets: [
    {
      data: [65000, 59000, 80000, 81000, 76000, 82000, 90000, 85000, 91000, 95000, 98000, 100000],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

function CashflowChart() {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">Cashflow</h3>
          <p className="text-sm text-gray-500">Last 12 months</p>
        </div>
        <select className="text-sm border rounded-lg px-2 py-1">
          <option>Last 12 months</option>
          <option>Last 6 months</option>
          <option>Last 30 days</option>
        </select>
      </div>
      <div className="text-2xl font-semibold text-gray-900 mb-1">$710,897</div>
      <div className="text-sm text-green-500 mb-6 flex items-center">
        <ArrowUpRight className="w-4 h-4 mr-1" />
        4.51% vs last month
      </div>
      <div className="h-[300px]">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}

export default CashflowChart;