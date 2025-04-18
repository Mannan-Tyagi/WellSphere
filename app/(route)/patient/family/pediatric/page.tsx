"use client";

import React from 'react';
import PediatricTracker from '@/modules/patient-pages/family/PediatricTracker';

// Mock data for pediatric tracking
const mockChildData = {
  id: 1,
  name: 'Emma Cooper',
  age: 12,
  ageMonths: 144,
  birthDate: '2013-01-15',
  gender: 'female',
  avatar: '/avatars/emma.png',
  primaryPediatrician: 'Dr. Sarah Johnson',
  lastCheckup: '2025-02-10',
  nextCheckup: '2025-05-10'
};

const mockImmunizationData = {
  completed: [
    { name: 'DTaP', doses: 5, lastDose: '2019-01-15', nextDue: null, status: 'completed' },
    { name: 'IPV (Polio)', doses: 4, lastDose: '2019-01-15', nextDue: null, status: 'completed' },
    { name: 'MMR', doses: 2, lastDose: '2019-01-15', nextDue: null, status: 'completed' },
    { name: 'Varicella', doses: 2, lastDose: '2019-01-15', nextDue: null, status: 'completed' },
    { name: 'Hepatitis B', doses: 3, lastDose: '2013-07-15', nextDue: null, status: 'completed' },
    { name: 'Hepatitis A', doses: 2, lastDose: '2015-07-15', nextDue: null, status: 'completed' }
  ],
  upcoming: [
    { name: 'Tdap', doses: 0, lastDose: null, nextDue: '2025-07-15', status: 'due', recommendedAge: '11-12 years' },
    { name: 'Meningococcal', doses: 0, lastDose: null, nextDue: '2025-07-15', status: 'due', recommendedAge: '11-12 years' },
    { name: 'HPV', doses: 0, lastDose: null, nextDue: '2025-07-15', status: 'due', recommendedAge: '11-12 years' }
  ]
};

const mockDevelopmentalMilestones = [
  { age: 'Birth', milestones: ['Reflexes present', 'Responds to sounds'], completed: true },
  { age: '2 months', milestones: ['Smiles at people', 'Can hold head up'], completed: true },
  { age: '6 months', milestones: ['Rolls over', 'Begins to sit without support'], completed: true },
  { age: '1 year', milestones: ['First steps', 'Says first word'], completed: true },
  { age: '18 months', milestones: ['Walks well', 'Says several words'], completed: true },
  { age: '2 years', milestones: ['Speaks in sentences', 'Follows simple instructions'], completed: true },
  { age: '3 years', milestones: ['Climbs well', 'Uses pronouns correctly'], completed: true },
  { age: '4 years', milestones: ['Tells stories', 'Understands counting'], completed: true },
  { age: '5 years', milestones: ['Speaks clearly', 'Can print some letters'], completed: true },
  { age: '6-8 years', milestones: ['Reads simple books', 'Understands time concepts'], completed: true },
  { age: '9-11 years', milestones: ['More logical thinking', 'Understands different viewpoints'], completed: true },
  { age: '12 years', milestones: ['Abstract thinking begins', 'Developing body image'], completed: false }
];

export default function PediatricTrackerPage() {
  return (
    <PediatricTracker 
      childData={mockChildData} 
      immunizationData={mockImmunizationData} 
      developmentalMilestones={mockDevelopmentalMilestones} 
    />
  );
}
