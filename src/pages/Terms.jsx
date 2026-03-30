import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. About Fixserv",
    content:
      "Fixserv is a digital marketplace that connects customers with independent technicians. We do not directly provide repair services.",
  },
  {
    title: "2. Definitions",
    content:
      "“Platform” refers to Fixserv apps. “User” refers to anyone using the platform. “Technician” refers to independent service providers.",
  },
  {
    title: "3. Use of the Platform",
    content:
      "You agree to provide accurate information, use the platform lawfully, and not attempt to disrupt or misuse the system.",
  },
  {
    title: "4. User Responsibilities",
    content:
      "Users must communicate respectfully, provide correct job details, and honor scheduled bookings and payments.",
  },
  {
    title: "5. Technician Responsibilities",
    content:
      "Technicians must provide honest, professional services. Fixserv does not guarantee service quality.",
  },
  {
    title: "6. Payments & Cancellations",
    content:
      "Payments may be processed on or off the platform. Late cancellations may attract a fee.",
  },
  {
    title: "7. Disputes",
    content:
      "Users should report issues through Fixserv. We may assist in mediation but are not liable for outcomes.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "Fixserv is not responsible for damages, losses, or service outcomes.",
  },
  {
    title: "9. Account Suspension",
    content:
      "We may suspend accounts involved in fraud, abuse, or violations.",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may update these terms at any time. Continued use means acceptance.",
  },
  {
    title: "11. Governing Law",
    content:
      "These terms are governed by the laws of the Federal Republic of Nigeria.",
  },
];

const Terms = () => {
  return (
    <div className="w-full bg-white">

      {/* HERO */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-[#3E83C4]"
        >
          Terms & Conditions
        </motion.h1>

        <p className="mt-4 text-gray-500">
          Please read these terms carefully before using Fixserv.
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
          Questions about these terms?
        </p>

        <p className="mt-2 font-medium text-[#3E83C4]">
          fixserv8@gmail.com
        </p>
      </section>

    </div>
  );
};

export default Terms;