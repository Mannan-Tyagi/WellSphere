"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/modules/doctor-pages/SideBar";
import TopNavBar from "@/modules/doctor-pages/TopNavBar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleSidebar={toggleSidebar}
          toggleMobileMenu={toggleMobileMenu}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <TopNavBar toggleMobileMenu={toggleMobileMenu} />

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Good morning, Dr. Johnson!</h1>
            <p className="text-gray-500">Here's what's happening with your hospital today.</p>
          </div>

          {/* Child routes (e.g. /doctor/dashboard, /doctor/calendar, etc.) will render here */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">{children}</div>
        </div>
      </main>
    </div>
  );
}