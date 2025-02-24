"use client";

import Sidebar from "@/modules/doctor-pages/SideBar";
import TopNavBar from "@/modules/doctor-pages/TopNavBar";

import React, { ReactNode,useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
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
        <div>
          
          {/* Child routes (e.g. /doctor/dashboard, /doctor/calendar, etc.) will render here */}
          <div className="flex-1 overflow-y-auto bg-gray-50 z-10">{children}</div>
        </div>
      </main>
    </div>
  );
}