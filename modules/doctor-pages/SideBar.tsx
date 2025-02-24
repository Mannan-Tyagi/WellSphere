"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  CreditCard,
  FileText,
  HeadphonesIcon,
  LayoutDashboard,
  Microscope,
  Package,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  UserCog,
  Users,
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
      { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" }
    ],
  },
  {
    title: "CLINIC",
    items: [
      { icon: Calendar, label: "Reservations", href: "/doctor/calendar", badge: 3 },
      { icon: Users, label: "Patients", href: "/doctor/patients" },
      { icon: Stethoscope, label: "Treatments", href: "/doctor/treatments" },
      { icon: UserCog, label: "Staff List", href: "/doctor/staff" },
    ],
  },
  {
    title: "FINANCE",
    items: [
      { icon: CreditCard, label: "Accounts", href: "/doctor/accounts" },
      { icon: TrendingUp, label: "Sales", href: "/doctor/sales" },
      { icon: ShoppingCart, label: "Purchases", href: "/doctor/purchases" },
      { icon: CreditCard, label: "Payment Method", href: "/doctor/payment-method" },
    ],
  },
  {
    title: "PHYSICALASSET",
    items: [
      { icon: Package, label: "Stocks", href: "/doctor/stocks", badge: 5 },
      { icon: Microscope, label: "Peripherals", href: "/doctor/peripherals" },
    ],
  },
  {
    items: [
      { icon: FileText, label: "Report", href: "/doctor/report" },
      { icon: HeadphonesIcon, label: "Customer Support", href: "/doctor/support" },
    ],
  },
];

function Sidebar({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hoverLabel, setHoverLabel] = useState("");
  const pathname = usePathname();

  const NavItemComponent = ({ icon: Icon, label, href, badge }: NavItem) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center p-3 mx-2 rounded-lg transition-colors relative group
          ${isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"}
          ${isOpen ? "justify-start" : "justify-center"}`}
        onMouseEnter={() => !isOpen && setHoverLabel(label)}
        onMouseLeave={() => !isOpen && setHoverLabel("")}
      >
        <div className="relative flex items-center">
          <Icon className={`w-5 h-5 ${isOpen ? "mr-3" : ""}`} />
          {!isOpen && hoverLabel === label && (
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

        {isOpen && <span className="text-sm">{label}</span>}
        {badge && (
          <span
            className={`${
              isOpen ? "ml-auto" : "absolute top-1 right-1"
            } bg-red-500 text-white text-xs px-2 rounded-full`}
          >
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`h-screen bg-white border-r ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300 relative z-50`}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isOpen ? "space-x-2" : "justify-center w-full"}`}>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center">
              Z
            </div>
            {isOpen && (
              <div>
                <p className="font-semibold">Zendenta</p>
                <p className="text-xs text-gray-500">Avicena Clinic</p>
                <p className="text-xs text-gray-500">BAS Euclid Avenue,CA</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 hover:bg-gray-100 rounded-full ${
              isOpen ? "" : "absolute -right-3 top-5 bg-white border z-50"
            }`}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!isOpen && "rotate-180"}`} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="py-4 overflow-y-auto">
        {navigation.map((section, index) => (
          <div key={index} className="mb-4">
            {section.title && isOpen && (
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
    </div>
  );
}

export default Sidebar;
