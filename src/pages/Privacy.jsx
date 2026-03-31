import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "We collect personal information such as your name, phone number, email, location data, device information, and service request details.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your data helps us connect you with technicians, process bookings, improve services, and ensure platform security.",
  },
  {
    title: "3. Sharing of Information",
    content:
      "We may share your data with technicians and trusted partners like payment providers. We do not sell your data.",
  },
  {
    title: "4. Data Security",
    content:
      "We use appropriate measures to protect your data from unauthorized access or misuse.",
  },
  {
    title: "5. Data Retention",
    content:
      "We keep your data only as long as necessary to provide our services or meet legal obligations.",
  },
  {
    title: "6. Your Rights",
    content:
      "You can access, update, or request deletion of your personal data by contacting us.",
  },
  {
    title: "7. Cookies & Tracking",
    content:
      "We use cookies to improve experience, analyze usage, and remember preferences.",
  },
  {
    title: "8. Third-Party Services",
    content:
      "We may use third-party tools such as payment processors or analytics services.",
  },
  {
    title: "9. Changes to Policy",
    content:
      "We may update this policy anytime. Continued use means acceptance.",
  },
];

const Privacy = () => {
  return (
    <div className="w-full bg-white">

      {/* HERO */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-[#3E83C4]"
        >
          Privacy Policy
        </motion.h1>

        <p className="mt-4 text-gray-500">
          Your privacy matters to us at Fixserv.
        </p>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">

          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="bg-gray-50 p-6 rounded-xl"
            >
              <h2 className="font-semibold text-lg text-[#3E83C4]">
                {section.title}
              </h2>

              <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* CONTACT */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <p className="text-gray-600">
          Questions about your data?
        </p>

        <p className="mt-2 font-medium text-[#3E83C4]">
          fixserv8@gmail.com
        </p>
      </section>

    </div>
  );
};

export default Privacy;