"use client";

import DemoRequestForm from "@/modules/landing-page/DemoRequestForm";
import React, { useState } from "react";
import HeroSection from "@/modules/landing-page/HeroSection";
import FeaturesTimeline from "@/modules/landing-page/FeatureTimeline";
import TestimonialsSection from "@/modules/landing-page/TestimonialsSection";
import DemoVideoSection from "@/modules/landing-page/DemoVideoSection";
import Footer from "@/modules/landing-page/Footer";
import LoginModal from "@/modules/landing-page/LoginModal";


function LandingPage() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {showDemoForm && (
        <DemoRequestForm onClose={() => setShowDemoForm(false)} />
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <HeroSection
        onDemoClick={() => setShowDemoForm(true)}
        onLoginClick={() => setShowLoginModal(true)}
      />
      <FeaturesTimeline />
      <TestimonialsSection />
      <DemoVideoSection onDemoClick={() => setShowDemoForm(true)} />
      <Footer />
    </div>
  );
}

export default LandingPage;