"use client";

import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  UserCog,
  CreditCard,
  TrendingUp,
  ShoppingCart,
  Package,
  Syringe,
  FileText,
  HeadphonesIcon,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

function Sidebar({
  isSidebarOpen,
  isMobileMenuOpen,
  toggleSidebar,
  toggleMobileMenu,
}: SidebarProps) {
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg transition-all duration-300 fixed h-full z-20 md:relative ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b flex items-center justify-between">
        {isSidebarOpen ? (
          <h1 className="text-xl font-semibold text-blue-600">🏥 WellSphere</h1>
        ) : (
          <h1 className="text-xl font-semibold text-blue-600">🏥</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="hidden md:block text-gray-500 hover:text-gray-800"
        >
          <ChevronLeft
            className={`w-5 h-5 transform transition-transform ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Hospital Info */}
      {isSidebarOpen && (
        <div className="p-4 border-b">
          <h2 className="text-sm font-medium">City General Hospital</h2>
          <p className="text-xs text-gray-500">123 Medical Center Dr</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {isSidebarOpen && (
            <div className="text-xs font-semibold text-gray-400 mb-2">CLINIC</div>
          )}
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-blue-50 text-blue-600"
          >
            <LayoutDashboard className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Dashboard</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Appointments</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Users className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Patients</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Stethoscope className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Treatments</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <UserCog className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Staff List</span>}
          </a>

          {isSidebarOpen && (
            <div className="text-xs font-semibold text-gray-400 mt-6 mb-2">FINANCE</div>
          )}
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <CreditCard className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Accounts</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <TrendingUp className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Sales</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <ShoppingCart className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Purchases</span>}
          </a>

          {isSidebarOpen && (
            <div className="text-xs font-semibold text-gray-400 mt-6 mb-2">INVENTORY</div>
          )}
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Package className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Medical Supplies</span>}
          </a>
          <a
            href="#"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Syringe className="w-4 h-4 min-w-[16px]" />
            {isSidebarOpen && <span className="ml-3">Equipment</span>}
          </a>

          <div className="mt-6 space-y-1">
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <FileText className="w-4 h-4 min-w-[16px]" />
              {isSidebarOpen && <span className="ml-3">Report</span>}
            </a>
            <a
              href="#"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50"
            >
              <HeadphonesIcon className="w-4 h-4 min-w-[16px]" />
              {isSidebarOpen && <span className="ml-3">Support</span>}
            </a>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;