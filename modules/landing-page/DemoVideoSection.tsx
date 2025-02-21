"use client";

import React from "react";
import { Play, ChevronRight } from "lucide-react";

interface DemoVideoSectionProps {
  onDemoClick: () => void;
}

function DemoVideoSection({ onDemoClick }: DemoVideoSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-900 aspect-video rounded-2xl overflow-hidden relative group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition">
                <Play className="w-8 h-8 text-blue-600 ml-1" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              See WellSphere in Action
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Watch how WellSphere transforms healthcare delivery through
              innovative technology and seamless integration.
            </p>
            <button
              onClick={onDemoClick}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg flex items-center"
            >
              Schedule Demo
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoVideoSection;