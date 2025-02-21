"use client";

import React from "react";
import { Star } from "lucide-react";

function TestimonialsSection() {
  const doctors = [
    {
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiologist",
      rating: 5,
      review:
        "WellSphere has revolutionized my practice. The smart scheduling and patient management features are exceptional.",
      imageId: 1550000000000,
    },
    {
      name: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      rating: 4.5,
      review:
        "The digital health records system has made patient care so much more efficient and accurate.",
      imageId: 1550000000001,
    },
    {
      name: "Dr. Amit Patel",
      specialty: "Neurologist",
      rating: 5,
      review:
        "Outstanding platform for managing patient care. The integrated analytics help me make better decisions.",
      imageId: 1550000000002,
    },
    {
      name: "Dr. Meera Reddy",
      specialty: "Family Physician",
      rating: 4.5,
      review:
        "The telemedicine features are fantastic. My patients love the easy access to care.",
      imageId: 1550000000003,
    },
  ];

  const hospitals = [
    {
      name: "Apollo Hospitals",
      type: "Multi-Specialty Hospital",
      review:
        "WellSphere has significantly improved our operational efficiency and patient care quality.",
    },
    {
      name: "Fortis Healthcare",
      type: "Healthcare Network",
      review:
        "The analytics and resource management tools have transformed our operations.",
    },
    {
      name: "Max Healthcare",
      type: "Super-Specialty Hospital",
      review:
        "Outstanding platform for managing complex healthcare operations seamlessly.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
          What Our Users Say
        </h2>

        {/* Doctor Reviews */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Healthcare Professionals</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => {
                    const starFill = j < Math.floor(doctor.rating);
                    const halfStar =
                      j === Math.floor(doctor.rating) &&
                      doctor.rating % 1 !== 0;
                    return (
                      <Star
                        key={j}
                        className={
                          starFill
                            ? "w-5 h-5 text-yellow-400"
                            : halfStar
                            ? "w-5 h-5 text-yellow-400"
                            : "w-5 h-5 text-gray-300"
                        }
                        fill="currentColor"
                      />
                    );
                  })}
                </div>
                <p className="text-gray-600 mb-4">{doctor.review}</p>
                <div className="flex items-center">
                  <img
                    src={`https://images.unsplash.com/photo-${doctor.imageId}?auto=format&fit=crop&q=80&w=100&h=100`}
                    alt="Doctor"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Reviews */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8">Partner Hospitals</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {hospitals.map((hospital, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="mb-4">{hospital.review}</p>
                <div>
                  <p className="font-semibold">{hospital.name}</p>
                  <p className="text-sm text-blue-200">{hospital.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Hospitals Slider */}
        <div className="overflow-hidden">
          <div className="flex animate-scroll">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-none w-48 mx-4">
                <img
                  src={`https://images.unsplash.com/photo-${
                    1560000000000 + i
                  }?auto=format&fit=crop&q=80&w=200&h=100`}
                  alt="Hospital Partner"
                  className="w-full h-24 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;