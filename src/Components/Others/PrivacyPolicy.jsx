import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 to-blue-0 text-black p-10">
      <div className="max-w-full mx-auto mt-10">
        <h2 className="text-3xl font-bold mb-9 text-blue-700 cursor-pointer">Privacy <span className="text-purple-700">Policy</span></h2>
        {/* <div className="flex gap-4 mb-6 border-b pb-2 text-gray-600">
          <span className="cursor-pointer hover:text-black">Terms</span>
          <span className="font-semibold text-black border-b-2 border-black cursor-pointer">
            Privacy Policy
          </span>
        </div> */}

        <h3 className="text-xl flex justify-center font-semibold mb-8">Welcome to our privacy policy!</h3>
        <p className="mb-4">
          At FixServ, we value your privacy. This policy explains how we collect, use, and protect your personal information.
        </p>
        <p className="mb-4">
          We collect your personal data only when necessary and for legitimate purposes, such as account registration and customer support. We never sell your data.
        </p>
        
        <h3 className="text-xl font-semibold mt-10 mb-4">1. Informations We Collect</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Create an account (name, email, phone number, password)</li>
          <li>Book or offer a service (location, device details, payment info)</li>
          <li>Contact support or engage with the platform</li>
        </ul>

        <h3 className="text-xl font-semibold mt-10 mb-4">2. How We Use Your Information</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Provide and improve our services</li>
          <li>Match clients with verified artisans</li>
          <li>Process secure payments through escrow</li>
          <li>Send service updates, reminders, and promotional content</li>
        </ul>
        <p className="mb-6">
          We never sell your information to third parties.
        </p>

        <h3 className="text-xl font-semibold mt-10 mb-4">3. Sharing Information</h3>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Verified artisans (if you're a client)</li>
          <li>Clients (if you're an artisan)</li>
          <li>Payment processors (for secure transactions)</li>
          <li>Legal authorities if required by law</li>
        </ul>

        <h3 className="text-xl font-semibold mt-10 mb-4">4. Data Security</h3>
        <p className="mb-6">
          We protect your data using SSL encryption, secure password hashing, and role-based access control. Your privacy is a top priority.
        </p>

        <h3 className="text-xl font-semibold mt-10 mb-4">5. Your Rights</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Update or delete your profile</li>
          <li>Request a copy of your data</li>
          <li>Opt-out of promotional emails at any time</li>
        </ul>
        <p className="mb-6">
          To make any privacy requests, email us at:{" "}
          <a href="mailto:support@fixserv.com" className="text-blue-600 underline">
            support@fixserv.com
          </a>
        </p>

        <h3 className="text-xl font-semibold mt-10 mb-4">6. Changes to This Policy</h3>
        <p>
          We may update this policy occasionally. Changes will be posted here with a new "Effective Date."
        </p>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
