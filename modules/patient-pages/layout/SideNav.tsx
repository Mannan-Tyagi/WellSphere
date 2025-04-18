import React from "react";
import { Home, Calendar, FileText } from "lucide-react"; // Ensure FileText is imported
import { NavLink } from "react-router-dom";

const SideNav = () => {
  const navigationLinks = [
    {
      name: "Home",
      href: "/patient/home",
      icon: Home,
      activeIcon: Home,
    },
    {
      name: "Appointments",
      href: "/patient/appointments",
      icon: Calendar,
      activeIcon: Calendar,
    },
    {
      name: "Medical Records",
      href: "/patient/records",
      icon: FileText,
      activeIcon: FileText,
    },
  ];

  return (
    <nav className="sidenav">
      <ul>
        {navigationLinks.map((link) => (
          <li key={link.name}>
            <NavLink to={link.href} activeClassName="active">
              <link.icon className="icon" />
              <span>{link.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNav;