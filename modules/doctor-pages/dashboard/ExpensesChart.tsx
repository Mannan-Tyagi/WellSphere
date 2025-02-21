"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const chartData = {
  labels: ["Internet", "Electricity", "Transactions", "Rental Cost", "Foods", "Other"],
  datasets: [
    {
      data: [45, 26, 22, 8, 3, 2],
      backgroundColor: [
        "rgb(99, 102, 241)",
        "rgb(34, 197, 94)",
        "rgb(249, 115, 22)",
        "rgb(234, 179, 8)",
        "rgb(236, 72, 153)",
        "rgb(161, 161, 170)",
      ],
      borderWidth: 0,
    },
  ],
};

function ExpensesChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium mb-1">Expenses</h3>
          <p className="text-sm text-gray-500">Last 6 months</p>
        </div>
        <select className="text-sm border rounded-lg px-2 py-1">
          <option>Last 6 months</option>
          <option>Last 3 months</option>
          <option>Last month</option>
        </select>
      </div>
      <div className="h-[200px] mb-6">
        <Doughnut data={chartData} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            <span>Internet</span>
          </div>
          <span className="font-medium">45%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Electricity</span>
          </div>
          <span className="font-medium">26%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <span>Transactions</span>
          </div>
          <span className="font-medium">22%</span>
        </div>
      </div>
    </div>
  );
}

export default ExpensesChart;