import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { mockPatients } from './mockData/patients';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  photo?: string;
}

interface PatientSearchComboboxProps {
  selectedPatientId?: string;
  onPatientSelect: (patient: Patient) => void;
  initialPatientName?: string;
}

export const PatientSearchCombobox: React.FC<PatientSearchComboboxProps> = ({
  selectedPatientId = '',
  onPatientSelect,
  initialPatientName = ''
}) => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [query, setQuery] = useState(initialPatientName);
  
  // Find the initially selected patient
  useEffect(() => {
    if (selectedPatientId) {
      const patient = patients.find(p => p.id === selectedPatientId);
      if (patient) {
        setSelectedPatient(patient);
        setQuery(patient.name);
      }
    } else if (initialPatientName) {
      setQuery(initialPatientName);
    }
  }, [selectedPatientId, patients, initialPatientName]);
  
  const filteredPatients = query === ''
    ? patients
    : patients.filter((patient) => {
        return patient.name.toLowerCase().includes(query.toLowerCase());
      });
      
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient);
  };

  return (
    <div className="relative">
      <Combobox value={selectedPatient} onChange={handleSelectPatient}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-md border border-slate-300 text-left focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-slate-900 focus:ring-0"
              displayValue={(patient: Patient | null) => patient?.name || query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for a patient"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            {filteredPatients.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <Combobox.Option
                  key={patient.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-slate-900'
                    }`
                  }
                  value={patient}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {patient.name} ({patient.age}, {patient.gender})
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
};