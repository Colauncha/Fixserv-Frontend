import React, { useState } from "react";
import { motion } from "framer-motion";
import phone from "../assets/contact/phone.png";
import email from "../assets/contact/mail.png";
import location from "../assets/contact/location.png";
import fb from "../assets/contact/fb.png";
import insta from "../assets/contact/insta.png";
import linkedin from "../assets/contact/linkedin.png";
import twitter from "../assets/contact/x.png";

import emailjs from "emailjs-com";

const Contact = () => {

  const [preview, setPreview] = useState(null);

  const openWhatsApp = () => {
    window.open(
      "https://wa.me/2347084274918?text=Hello Fixserv, I need help",
      "_blank"
    );
  };

  const copyPhone = () => {
  navigator.clipboard.writeText("+2347084274918");
  alert("Phone number copied!");
};

const handleSubmit = (e) => {
  e.preventDefault();

  const form = e.target;

  emailjs
    .sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      form,
      "YOUR_PUBLIC_KEY"
    )
    .then(
      () => {
        alert("Message sent successfully!");
        form.reset();
      },
      (error) => {
        alert("Failed to send message, try again.");
        console.error(error);
      }
    );
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setPreview(URL.createObjectURL(file));
  }
};

const socialLinks = [
  {
    icon: fb,
    url: "https://facebook.com/yourpage",
  },
  {
    icon: insta,
    url: "https://instagram.com/yourpage",
  },
  {
    icon: linkedin,
    url: "https://linkedin.com/company/yourpage",
  },
  {
    icon: twitter,
    url: "https://twitter.com/yourpage",
  },
];

const openEmail = () => {
  const subject = "Support Request - Fixserv";
  const body = "Hello Fixserv, I need help with...";

  window.location.href = `mailto:fixserv8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-16">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-black">
            We’re here to answer all your questions.
          </h2>
          <p className="mt-4 text-[#656565] max-w-2xl mx-auto">
            Have a question, need support, or want to partner with us? We’re here to help.
          </p>
        </div>

        {/* QUICK HELP */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div 
            onClick={openWhatsApp}
            className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition"
          >
            <p className="font-medium text-black">💬 Live Chat</p>
            <p className="text-sm text-gray-500 mt-1">
              Get instant support
            </p>
          </div>

          {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="font-medium text-black">📞 Call Us</p>
            <p className="text-sm text-gray-500 mt-1">
              +234 708 427 4918
            </p>
          </div> */}

          <div 
  onClick={copyPhone}
  className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition"
>
  <p className="font-medium text-black">📞 Call Us</p>
  <p className="text-sm text-gray-500 mt-1">
    +234 708 427 4918
  </p>
</div>

          {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="font-medium text-black">📩 Send Message</p>
            <p className="text-sm text-gray-500 mt-1">
              We’ll respond quickly
            </p>
          </div> */}
          <div 
  onClick={openEmail}
  className="bg-gray-50 p-4 rounded-lg text-center cursor-pointer hover:shadow-md transition"
>
  <p className="font-medium text-black">📩 Send Message</p>
  <p className="text-sm text-gray-500 mt-1">
    We’ll respond quickly
  </p>
</div>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* LEFT — FORM */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-black mb-2">
              Get in Touch with Us
            </h3>

            <p className="text-sm text-gray-500 mb-6">
              ⏱ We usually respond within 1–2 hours during business hours.
            </p>

           <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4] outline-none"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4]"
                />
                <input
                  type="text"
                  placeholder="Your Phone"
                  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4]"
                />
              </div>

              {/* ISSUE TYPE */}
              <select className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4]">
                <option>Select Issue Type</option>
                <option>Repair Request Issue</option>
                <option>Payment Problem</option>
                <option>Complaint About Technician</option>
                <option>Account/Login Issue</option>
                <option>Other</option>
              </select>

              <input
                type="text"
                placeholder="Subject"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4]"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:ring-2 focus:ring-[#3E83C4] resize-none"
              ></textarea>

              {/* FILE UPLOAD */}
              <div>
                <input
  type="file"
  onChange={handleImageChange}
  className="w-full border border-[#9BAAB9] rounded-md px-4 py-3"
/>

{preview && (
  <img
    src={preview}
    alt="preview"
    className="mt-3 w-32 h-32 object-cover rounded-md border"
  />
)}

                <p className="text-xs text-gray-500 mt-1">
                  Upload images of the issue (optional)
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="bg-[#3E83C4] hover:bg-blue-700 text-white px-10 py-3 rounded-md font-medium transition shadow-md cursor-pointer"
                >
                  Send Message
                </button>
              </div>

              {/* WHATSAPP OPTION */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                Or chat with us instantly on{" "}
                <span
                  onClick={openWhatsApp}
                  className="text-green-600 font-medium cursor-pointer"
                >
                  WhatsApp
                </span>
              </p>

            </form>
          </motion.div>

          {/* RIGHT — INFO */}
          <div className="space-y-6">

            {/* OFFICE INFO */}
            <div className="border border-[#a5bed4] rounded-lg p-6">
              <h4 className="font-semibold text-black mb-4">
                Office Info
              </h4>

              <div className="space-y-4">

                <div className="flex items-start gap-3 border border-[#9fbbd4] rounded-md p-3">
                  <img src={phone} alt="phone" className="w-5 h-5 mt-1" />
                  <div>
                    <p className="text-xs text-[#656565]">Phone</p>
                    <p className="text-sm font-medium text-[#535353]">
                      +234 708 427 4918
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border border-[#9fbbd4] rounded-md p-3">
                  <img src={email} alt="email" className="w-5 h-5 mt-1" />
                  <div>
                    <p className="text-xs text-[#656565]">Mail</p>
                    <p className="text-sm font-medium text-[#535353]">
                      fixserv8@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border border-[#9fbbd4] rounded-md p-3">
                  <img src={location} alt="location" className="w-5 h-5 mt-1" />
                  <div>
                    <p className="text-xs text-[#656565]">Location</p>
                    <p className="text-sm font-medium text-[#535353]">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* SOCIAL MEDIA */}
            <div className="border border-[#9fbbd4] rounded-lg p-6">
              <h4 className="font-normal text-black mb-4">
                Social Media
              </h4>

              {/* <div className="flex gap-4">
                {[fb, insta, linkedin, twitter].map((icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-blue-50 transition cursor-pointer"
                  >
                    <img src={icon} alt="social" className="w-5 h-5" />
                  </div>
                ))}
              </div> */}
              <div className="flex gap-4">
  {socialLinks.map((item, index) => (
    <div
      key={index}
      onClick={() => window.open(item.url, "_blank")}
      className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-blue-50 transition cursor-pointer"
    >
      <img src={item.icon} alt="social" className="w-5 h-5" />
    </div>
  ))}
</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;