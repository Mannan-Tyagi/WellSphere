"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  MessageCircle,
  ClipboardList,
  FileText,
  User,
  Settings,
  HeartPulse,
  CreditCard,
  ChevronLeft,
  LogOut,
  HelpCircle,
  Home,
  Menu,
  X,
  Pill,
  Stethoscope,
  ActivitySquare
} from 'lucide-react';

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

// Doctor navigation items
const doctorNavigation: NavSection[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" }
    ],
  },
  {
    title: "CLINIC",
    items: [
      { icon: Calendar, label: "Calendar", href: "/doctor/calendar" },
      { icon: Users, label: "Patients", href: "/doctor/patients" },
      { icon: MessageCircle, label: "Messaging", href: "/doctor/messaging" },
      { icon: ClipboardList, label: "Consultation", href: "/doctor/consultation" },
      { icon: Stethoscope, label: "Appointments", href: "/doctor/appointments" },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { icon: ActivitySquare, label: "Analytics", href: "/doctor/analytics" },
      { icon: FileText, label: "Reports", href: "/doctor/reports" },
      { icon: Settings, label: "Settings", href: "/doctor/settings" },
    ]
  },
  {
    items: [
      { icon: HelpCircle, label: "Help & Support", href: "/doctor/support" },
      { icon: LogOut, label: "Sign Out", href: "/auth/signout" },
    ],
  }
];

// Patient navigation items
const patientNavigation: NavSection[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/patient/dashboard" }
    ],
  },
  {
    title: "HEALTH",
    items: [
      { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
      { icon: FileText, label: "Records", href: "/patient/records" },
      { icon: Pill, label: "Medications", href: "/patient/medications" },
      { icon: HeartPulse, label: "Vital Tracking", href: "/patient/vitals" },
      { icon: MessageCircle, label: "Messages", href: "/patient/messages" },
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

type EnhancedSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EnhancedSidebar = ({ isOpen, onClose }: EnhancedSidebarProps) => {
  const { userType } = useNavigation();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const [hoverLabel, setHoverLabel] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  // Get the correct navigation based on user type
  const navigation = userType === 'doctor' ? doctorNavigation : patientNavigation;

  // Update badge counts for messages in navigation items
  useEffect(() => {
    // Find message navigation items and update badge count
    if (unreadCount > 0) {
      const navSections = [...navigation];
      navSections.forEach(section => {
        section.items.forEach(item => {
          if (item.label === "Messages" || item.label === "Messaging") {
            item.badge = unreadCount;
          }
        });
      });
    }
  }, [unreadCount, navigation]);

  const NavItemComponent = ({ icon: Icon, label, href, badge }: NavItem) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    
    return (
      <Link
        href={href}
        className={`flex items-center p-3 mx-2 rounded-lg transition-colors relative group
          ${isActive ? "bg-[#E6F2F3] text-[#006D77]" : "hover:bg-gray-50 text-gray-600"}
          ${collapsed ? "justify-center" : "justify-start"}`}
        onMouseEnter={() => collapsed && setHoverLabel(label)}
        onMouseLeave={() => collapsed && setHoverLabel("")}
      >
        <div className="relative flex items-center">
          <Icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"}`} />
          {collapsed && hoverLabel === label && (
            <div
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 
              bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50
              before:absolute before:-left-1 before:top-1/2 before:-translate-y-1/2 
              before:w-2 before:h-2 before:bg-gray-800 before:rotate-45"
            >
              {label}
            </div>
          )}
        </div>

        {!collapsed && <span className="text-sm">{label}</span>}
        {badge && badge > 0 && (
          <span
            className={`${
              collapsed ? "absolute top-1 right-1" : "ml-auto"
            } bg-red-500 text-white text-xs px-2 py-0.5 rounded-full`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r z-50 transition-all duration-300 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} 
          ${collapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${collapsed ? "justify-center w-full" : "space-x-2"}`}>
              <div className="bg-[#006D77] text-white w-8 h-8 rounded-lg flex items-center justify-center">
                W
              </div>
              {!collapsed && (
                <div>
                  <p className="font-semibold">WellSphere</p>
                  <p className="text-xs text-gray-500">
                    {userType === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
                  </p>
                </div>
              )}
            </div>

            {/* Collapse button (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1 hover:bg-gray-100 rounded-full hidden lg:block ${
                collapsed ? "absolute -right-3 top-5 bg-white border z-50" : ""
              }`}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!collapsed && "rotate-180"}`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto">
          {navigation.map((section, index) => (
            <div key={index} className="mb-4">
              {section.title && !collapsed && (
                <h3 className="px-4 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItemComponent key={item.label} {...item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default EnhancedSidebar;
