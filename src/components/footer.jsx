import React from "react";
import fb from "../assets/footer logo/facebook.png";
import insta from "../assets/footer logo/insta.png";
import linkedin from "../assets/footer logo/likedin.png";
import twitter from "../assets/footer logo/twitter.png";
import logo from "../assets/footer logo/footer logo.png";

import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-[#3E83C4] text-white pt-16 pb-6 mt-20">

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-16 md:px-24 grid grid-cols-1 md:grid-cols-[1fr_0.4fr_0.5fr_1.3fr] gap-48">

        {/* Brand Column */}
        <div>
          <img src={logo} alt="Fixserv" className="h-12 mb-4" />
          <p className="text-sm leading-relaxed mb-6">
            Connecting you with verified technicians for fast, reliable service
          </p>

          <p className="text-lg font-semibold mb-3">Follow us</p>
          <div className="flex items-center gap-4">
            <img src={fb} className="w-7 cursor-pointer hover:opacity-80" />
            <img src={insta} className="w-7 cursor-pointer hover:opacity-80" />
            <img src={linkedin} className="w-7 cursor-pointer hover:opacity-80" />
            <img src={twitter} className="w-7 cursor-pointer hover:opacity-80" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-5 text-sm">
            <li onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80">Home</li>
            <li onClick={() => navigate("/about")} className="cursor-pointer hover:opacity-80">About Us</li>
            <li onClick={() => navigate("/contactUs")} className="cursor-pointer hover:opacity-80">Contact Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-6">Resources</h4>
          <ul className="space-y-5 text-sm">
            <li className="cursor-pointer hover:opacity-80">Help & Support</li>
            <li className="cursor-pointer hover:opacity-80">Terms & Conditions</li>
            <li className="cursor-pointer hover:opacity-80">Privacy Policy</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-semibold mb-3">Newsletter Sign-Up</h4>
          <p className="text-sm mb-4">
            Stay updated on new listings, tips, and housing deals.
          </p>
          <div className="flex w-full max-w-sm bg-white rounded-sm overflow-hidden">

            <input
              type="email"
              placeholder="example@gmail.com"
              className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none"
            />

            <button className="bg-[#346DA3] px-4 text-xs font-medium text-white hover:bg-[#2667a2] transition cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
<div className="max-w-8xl mx-auto px-16 md:px-24 mt-14">
  <div className="w-full border-t border-[#7CB2E4]"></div>
</div>


      {/* Bottom */}
      <p className="text-center text-sm mt-6">
        © 2025 Fixserv. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
