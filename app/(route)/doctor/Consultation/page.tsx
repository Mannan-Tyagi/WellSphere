"use client";
import React, { useState, useEffect } from 'react';
import { ConsultationPage } from '@/modules/doctor-pages/consultation/ConsultationPage';

export default function Page() {
  return (
    <div className="p-6">
      <ConsultationPage />
    </div>
  );
}