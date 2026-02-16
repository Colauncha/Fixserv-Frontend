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

    // <footer className="w-full bg-[#3E83C4] text-white pt-10 sm:pt-12 lg:pt-16 pb-6 mt-12 sm:mt-16 lg:mt-20">

      <footer className="w-full bg-[#3E83C4] text-white pt-12 sm:pt-14 lg:pt-16 pb-8 mt-16">



      {/* Main Content */}

{/* <div className="max-w-8xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
gap-6 md:gap-8 lg:gap-12"> */}

<div className="max-w-8xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
gap-x-8 sm:gap-x-10 lg:gap-x-14 xl:gap-x-20
gap-y-10">



        {/* Brand Column */}
        <div className="min-w-0">
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
        <div className="min-w-0 lg:pl-10 xl:pl-16">

          <h4 className="font-semibold mb-6 whitespace-nowrap">Quick Links</h4>
          <ul className="space-y-5 text-sm whitespace-nowrap">
            <li onClick={() => navigate("/")} className="cursor-pointer hover:opacity-80">Home</li>
            <li onClick={() => navigate("/about")} className="cursor-pointer hover:opacity-80">About Us</li>
            <li onClick={() => navigate("/contactUs")} className="cursor-pointer hover:opacity-80">Contact Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="min-w-0">
          <h4 className="font-semibold mb-6 whitespace-nowrap">Resources</h4>
          <ul className="space-y-5 text-sm whitespace-nowrap">
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
          <div className="w-full">
  <div className="flex w-full bg-white rounded-md overflow-hidden shadow-sm">
    <input
      type="email"
      placeholder="example@gmail.com"
      className="flex-1 min-w-0 px-4 py-2.5 text-sm text-gray-700 outline-none"
    />

    <button className="shrink-0 bg-[#346DA3] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2667a2] transition cursor-pointer">
      Subscribe
    </button>
  </div>
</div>

        </div>
      </div>

      {/* Divider */}
{/* <div className="max-w-8xl mx-auto px-16 md:px-24 mt-14"> */}
  <div className="max-w-8xl mx-auto px-6 sm:px-10 md:px-24 mt-10 sm:mt-12 lg:mt-14">

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
