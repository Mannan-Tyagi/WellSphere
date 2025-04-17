"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
  User,
  Users,
  Pill,
  HeartPulse,
  CreditCard,
  HelpCircle,
  LogOut
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/patient/dashboard" }
    ],
  },
  {
    title: "HEALTH",
    items: [
      { icon: Calendar, label: "Appointments", href: "/patient/appointments", badge: 2 },
      { icon: FileText, label: "Medical Records", href: "/patient/records" },
      { icon: Pill, label: "Medications", href: "/patient/medications", badge: 1 },
      { icon: HeartPulse, label: "Vital Tracking", href: "/patient/vitals" },
      { icon: MessageCircle, label: "Messages", href: "/patient/messages", badge: 3 },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      { icon: User, label: "Profile", href: "/patient/profile" },
      { icon: Users, label: "Family Members", href: "/patient/family" },
      { icon: CreditCard, label: "Billing", href: "/patient/billing" },
      { icon: Settings, label: "Settings", href: "/patient/settings" },
    ],
  },
  {
    items: [
      { icon: HelpCircle, label: "Help & Support", href: "/patient/support" },
      { icon: LogOut, label: "Sign Out", href: "/auth/signout" },
    ],
  },
];

const PatientSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <Link href="/patient/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-[#006D77] rounded-md flex items-center justify-center text-white font-bold">
              W
            </div>
            <span className="ml-2 text-lg font-medium">WellSphere</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/patient/dashboard" className="w-8 h-8 mx-auto bg-[#006D77] rounded-md flex items-center justify-center text-white font-bold">
            W
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
        >
          <ChevronLeft className={`h-5 w-5 transition-all duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="py-4 overflow-y-auto h-[calc(100vh-65px)]">
        {navigation.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {section.title && !collapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md ${
                      pathname === item.href
                        ? "bg-[#F0F9FA] text-[#006D77]"
                        : "text-gray-700 hover:bg-gray-100"
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  >
                    <item.icon className={`h-5 w-5 ${pathname === item.href ? 'text-[#006D77]' : 'text-gray-500'}`} />
                    {!collapsed && <span className="ml-3">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto bg-[#006D77] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute top-0 right-0 bg-[#006D77] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default PatientSidebar;
