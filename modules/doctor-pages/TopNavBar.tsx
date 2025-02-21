"use client";

import React from "react";
import { Menu, Search, Plus, Clock, Bell, Settings } from "lucide-react";

interface TopNavBarProps {
  toggleMobileMenu: () => void;
}

function TopNavBar({ toggleMobileMenu }: TopNavBarProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 md:hidden rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hidden md:block">
            <Clock className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hidden md:block">
            <Settings className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 ml-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
              SJ
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-xs text-gray-500">Head Physician</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavBar;