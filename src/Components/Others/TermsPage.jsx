// import React, { useState } from "react";

const TermsPage = () => {
//   const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white p-14">
      {/* Content */}
      <h1 className="text-xl font-semibold mb-4 mt-10">Terms of Service</h1>
      <div className="px-4 py-6 text-md text-gray-800">
        {/* Tabs */}
        {/* <div className="flex gap-4 mb-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("terms")}
            className={`pb-2 font-medium ${activeTab === "terms" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          >
            Terms
          </button> */}
          {/* <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-2 font-medium ${activeTab === "privacy" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
          >
            Privacy Policy
          </button> */}
        {/* </div> */}

        {/* Text Content */}
      <div className="space-y-4 text-sm text-gray-800">
         <p>
            <h3 className="font-semibold text-base mb-1">1. Introduction</h3>
           Welcome to Fixserv. These Terms and Conditions outline the rules and regulations for using our platform. By accessing or using Fixserv, you agree to comply with and be bound by these terms.
         </p>

         <p>
            <h3 className="font-semibold text-base mb-1">2. Eligibility</h3>
           To use Fixserv, you must be at least 18 years old or have parental/guardian consent. You are responsible for ensuring that your account information is accurate and kept up-to-date.
         </p>

         <p>
            <h3 className="font-semibold text-base mb-1">3. Use of the Platform</h3>
           Fixserv connects clients with skilled artisans and service providers. You agree not to use the platform for unlawful, harmful, or misleading purposes. We reserve the right to suspend or terminate your account for any violations.
         </p>

         <p>
            <h3 className="font-semibold text-base mb-1">4. Payments and Bookings</h3>
           Payments must be made through the authorized channels provided by Fixserv. Service fees may apply and will be disclosed beforehand. Bookings are subject to availability and may be rescheduled if necessary.
         </p>

         <p>
            <h3 className="font-semibold text-base mb-1">5. Reviews and Ratings</h3>
           Users can leave reviews after completing a service. All feedback must be honest and respectful, based on actual experience.
         </p>

         <h3 className="font-semibold text-base mb-1">6. User Responsibilities</h3>
         <ol className="list-decimal list-inside space-y-1">
           <li>Keep your login information secure. You are responsible for all activity under your account.</li>
           <li>Fixserv is not liable for any loss or damage caused by service providers or clients.</li>
           <li>All content on Fixserv (logos, text, designs) is owned by Fixserv and cannot be reused without permission.</li>
         </ol>

         <p>
            <h3 className="font-semibold text-base mb-1">7. Updates to Terms</h3>
           By continuing to use Fixserv, you accept any updates we make to these Terms and Conditions. Please review them periodically for changes.
         </p>
      </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4">
          <button className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100">
            Not right now...
          </button>
          <button className="px-4 py-2 bg-[#779BE7] text-white text-sm rounded hover:bg-blue-600">
            I agree with terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
