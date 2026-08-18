import React, { useState } from "react";
import fb from "../assets/footer logo/facebook.png";
import insta from "../assets/footer logo/insta.png";
import linkedin from "../assets/footer logo/likedin.png";
import twitter from "../assets/footer logo/twitter.png";
import logo from "../assets/footer logo/footer logo.png";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setMessage("");

    // Validate name
    if (!fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    // Validate email
    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://user-api.fixserv.co/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            fullName: fullName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message || "Successfully subscribed to the Fixserv newsletter!"
        );

        setEmail("");
        setFullName("");
      } else {
        setMessage(data.message || "Unable to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="w-full bg-[#3E83C4] text-white pt-12 sm:pt-14 lg:pt-16 pb-8 mt-16">
      <div
        className="max-w-8xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-x-8 sm:gap-x-10 lg:gap-x-14 xl:gap-x-20
        gap-y-10"
      >
        {/* Company */}
        <div className="min-w-0">
          <img src={logo} alt="Fixserv" className="h-12 mb-4" />

          <p className="text-sm leading-relaxed mb-6">
            Connecting you with verified technicians for fast, reliable service
          </p>

          <p className="text-lg font-semibold mb-3">Follow us</p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/fix_serv?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={insta}
                alt="Instagram"
                className="w-7 cursor-pointer hover:opacity-80 transition"
              />
            </a>

            <a
              href="https://www.linkedin.com/company/fixserv/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={linkedin}
                alt="LinkedIn"
                className="w-7 cursor-pointer hover:opacity-80 transition"
              />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="min-w-0 lg:pl-10 xl:pl-16">
          <h4 className="font-semibold mb-6 whitespace-nowrap">
            Quick Links
          </h4>

          <ul className="space-y-5 text-sm whitespace-nowrap">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:opacity-80"
            >
              Home
            </li>

            <li
              onClick={() => navigate("/about")}
              className="cursor-pointer hover:opacity-80"
            >
              About Us
            </li>

            <li
              onClick={() => navigate("/contactUs")}
              className="cursor-pointer hover:opacity-80"
            >
              Contact Us
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="min-w-0">
          <h4 className="font-semibold mb-6 whitespace-nowrap">
            Resources
          </h4>

          <ul className="space-y-5 text-sm whitespace-nowrap">
            <li
              onClick={() => navigate("/helpsupport")}
              className="cursor-pointer hover:opacity-80"
            >
              Help & Support
            </li>

            <li
              onClick={() => navigate("/terms")}
              className="cursor-pointer hover:opacity-80"
            >
              Terms & Conditions
            </li>

            <li
              onClick={() => navigate("/privacy")}
              className="cursor-pointer hover:opacity-80"
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Newsletter Sign-Up</h4>

          <p className="text-sm mb-4">
            Stay updated on new listings, tips, and housing deals.
          </p>

          <div className="w-full space-y-2">
            {/* Full Name */}
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-700 bg-white rounded-md outline-none"
            />

            {/* Email + Subscribe */}
            <div className="flex w-full bg-white rounded-md overflow-hidden shadow-sm">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubscribe();
                  }
                }}
                className="flex-1 min-w-0 px-4 py-2.5 text-sm text-gray-700 outline-none"
              />

              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="shrink-0 bg-[#346DA3] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2667a2] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  message.toLowerCase().includes("successfully") ||
                  message.toLowerCase().includes("thanks")
                    ? "text-green-300"
                    : "text-red-300"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-8xl mx-auto px-6 sm:px-10 md:px-24 mt-10 sm:mt-12 lg:mt-14">
        <div className="w-full border-t border-[#7CB2E4]"></div>
      </div>

      {/* Bottom */}
      <p className="text-center text-sm mt-6">
        © 2024 - {new Date().getFullYear()} Fixserv. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;