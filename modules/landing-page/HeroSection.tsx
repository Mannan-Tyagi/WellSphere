"use client";

import React from "react";
import { LogIn } from "lucide-react";

interface HeroSectionProps {
  onDemoClick: () => void;
  onLoginClick: () => void;
}

function HeroSection({ onDemoClick, onLoginClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="w-48">
            <img
              src="https://raw.githubusercontent.com/your-repo/wellsphere-logo.png"
              alt="WellSphere Logo"
              className="h-12 object-contain"
            />
          </div>
          <button
            onClick={onLoginClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition flex items-center space-x-2 shadow-md"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
              Revolutionizing
              <span className="text-blue-600"> Mobile Healthcare</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect doctors, patients, and hospitals seamlessly through our
              innovative healthcare platform. Experience the future of medical
              care management.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={onDemoClick}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Book a Demo
              </button>
              <button
                onClick={onLoginClick}
                className="px-8 py-4 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition border border-gray-200"
              >
                Login
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                alt="Healthcare Professional"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;