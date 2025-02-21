"use client";

import React from "react";

function StockAvailability() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium">Stock Availability</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">View Inventory</button>
      </div>
      <div className="space-y-6">
        {/* Asset */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Total Asset</span>
            <span className="text-sm font-medium">$53,000</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: "80%" }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Previous: $48,000</span>
            <span className="text-xs text-green-500">+$5,000</span>
          </div>
        </div>
        {/* Products */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm">Total Products</span>
            <span className="text-sm font-medium">442</span>
          </div>
          <div className="flex space-x-1">
            <div className="h-2 bg-cyan-500 rounded-full flex-grow"></div>
            <div className="h-2 bg-yellow-500 rounded-full w-1/4"></div>
            <div className="h-2 bg-red-500 rounded-full w-1/12"></div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
            <div>
              <div className="font-medium mb-1">Available</div>
              <div className="text-gray-500">312 items</div>
            </div>
            <div>
              <div className="font-medium mb-1">Low Stock</div>
              <div className="text-gray-500">89 items</div>
            </div>
            <div>
              <div className="font-medium mb-1">Out of Stock</div>
              <div className="text-gray-500">41 items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockAvailability;