import React from "react";
import { Stethoscope, Users, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, description, isRight }: { title: string, description: string, isRight: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group w-full" // Added w-full for mobile
    >
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 backdrop-blur-sm bg-opacity-80 transform hover:-translate-y-1">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const TimelineIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 shadow-xl"
    >
      <div className="scale-75 sm:scale-100">
        {children}
      </div>
    </motion.div>
  );
};

function FeaturesTimeline() {
  const features = [
    {
      icon: <Stethoscope className="w-8 h-8 text-white" />,
      cards: [
        {
          title: "Smart Patient Management",
          description: "AI-powered scheduling system that optimizes your daily appointments. Automatically handle cancellations, reschedules, and waiting lists. Reduce no-shows with intelligent reminders."
        },
        {
          title: "Digital Health Records",
          description: "Access and manage patient records securely from anywhere. Include detailed medical history, prescriptions, and test results. Collaborate with other healthcare providers in real-time."
        }
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      cards: [
        {
          title: "24/7 Care Access",
          description: "Round-the-clock access to healthcare professionals through secure messaging. Book appointments instantly and receive emergency care guidance. Access your complete medical history anytime."
        },
        {
          title: "Medication Management",
          description: "Smart medication reminders and refill tracking. Monitor side effects and receive personalized dosage alerts. Direct communication with pharmacies for prescriptions."
        }
      ]
    },
    {
      icon: <Building2 className="w-8 h-8 text-white" />,
      cards: [
        {
          title: "Resource Optimization",
          description: "Advanced analytics for optimal resource allocation. Track equipment usage, bed availability, and staff scheduling. Reduce waiting times and improve patient flow management."
        },
        {
          title: "Integrated Analytics",
          description: "Comprehensive reporting dashboard for hospital performance metrics. Monitor patient satisfaction, treatment outcomes, and operational efficiency. Data-driven insights for strategic planning."
        }
      ]
    }
  ];

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Streamline your healthcare practice with our innovative digital solutions
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600"
          />

          {features.map((feature, index) => (
            <div key={index} className="mb-16 sm:mb-24 last:mb-0 relative">
              <div className="flex items-center mb-8 sm:mb-12">
                <TimelineIcon>{feature.icon}</TimelineIcon>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                <div className="md:text-right">
                  <FeatureCard {...feature.cards[0]} isRight={false} />
                </div>
                <div className="hidden md:block"></div>
                <div className="hidden md:block"></div>
                <div>
                  <FeatureCard {...feature.cards[1]} isRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesTimeline;