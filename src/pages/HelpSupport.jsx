import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "How do I know the technicians are reliable?",
    answer:
      "All technicians go through verification and background checks. You can also view ratings and reviews.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We are currently strongest in Lagos and expanding across Nigeria.",
  },
  {
    question: "How long do repairs take?",
    answer:
      "Simple repairs take a few hours to 1–2 days depending on the issue.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "Yes, cancellations are free up to 2 hours before the scheduled time.",
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();

  const openWhatsApp = () => {
    const phoneNumber = "2347084274918"; // replace with your real number
    const message = encodeURIComponent(
      "Hello Fixserv, I need help with a repair."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="w-full bg-white">

      {/* HERO */}
      <section className="text-center py-16 px-6 bg-gray-50">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-[#3E83C4]"
        >
          How can we help you?
        </motion.h1>

        <p className="mt-4 text-gray-500 max-w-xl mx-auto">
          Find answers or contact support quickly.
        </p>

        {/* SEARCH */}
        <div className="mt-8 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search for help..."
            className="w-full border border-gray-300 rounded-lg px-5 py-3 focus:ring-2 focus:ring-[#3E83C4] outline-none"
          />
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="grid sm:grid-cols-2 gap-6">

          {/* CONTACT / REPORT */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/contactUs")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer"
          >
            <h3 className="font-semibold text-lg">
              Contact Support / Report Issue
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Reach out to us for help or complaints
            </p>
          </motion.div>

          {/* TRACK */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/sign-up")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer"
          >
            <h3 className="font-semibold text-lg">Track Repair</h3>
            <p className="text-sm text-gray-500 mt-2">
              View the status of your current job
            </p>
          </motion.div>

        </div>
      </section>

      <section className="py-20 px-6">
  <div className="max-w-6xl mx-auto">

    <h2 className="text-3xl font-semibold text-[#3E83C4] mb-10 text-center">
      How Fixserv Works
    </h2>

    <div className="grid md:grid-cols-2 gap-8">

      {/* Customers */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-xl mb-4">For Customers</h3>
        <ul className="space-y-3 text-gray-600">
          <li>• Describe your repair need</li>
          <li>• Get matched with technicians</li>
          <li>• Compare profiles and reviews</li>
          <li>• Book and track progress</li>
          <li>• Pay securely</li>
        </ul>
      </div>

      {/* Technicians */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-xl mb-4">
          For Technicians
        </h3>
        <p className="text-gray-600">
          Join our network, receive job requests, grow your business,
          and get paid reliably.
        </p>
      </div>

    </div>
  </div>
</section>

      {/* FAQ */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">

          <h2 className="text-2xl text-[#3E83C4] md:text-3xl font-semibold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="bg-gray-50 p-5 rounded-lg"
              >
                <summary className="cursor-pointer font-medium">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold text-[#3E83C4]">
          Still need help?
        </h2>

        <p className="text-gray-500 mt-3">
          Our support team is ready to assist you.
        </p>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
  {[
    { icon: "📧", text: "fixserv8@gmail.com" },
    { icon: "📞", text: "+234 808 289 5378" },
    // { icon: "💬", text: "Live chat available" },
  ].map((item, i) => (
    <div
      key={i}
      className="flex items-center gap-2 bg-white border px-5 py-2 rounded-full shadow-sm text-gray-700"
    >
      <span>{item.icon}</span>
      <span>{item.text}</span>
    </div>
  ))}
</div>

        <button 
          onClick={() => navigate("/contactUs")}
          className="mt-8 bg-[#3E83C4] text-white px-8 py-3 rounded-md hover:bg-blue-600 transition cursor-pointer"
        >
          Contact Support
        </button>
      </section>

      {/* FLOATING BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">

  <button
    onClick={openWhatsApp}
    className="flex items-center gap-2 bg-green-500 text-white cursor-pointer px-5 py-3 rounded-full shadow-lg hover:bg-green-600 transition"
  >
    💬 WhatsApp
  </button>

  {/* <button
    onClick={() => navigate("/contactUs")}
    className="flex items-center gap-2 bg-[#3E83C4] text-white px-5 py-3 cursor-pointer rounded-full shadow-lg hover:bg-blue-600 transition"
  >
    💬 Chat
  </button> */}

</div>

    </div>
  );
};

export default HelpSupport;