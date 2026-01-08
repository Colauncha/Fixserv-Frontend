import React from "react";
import phone from "../assets/contact/phone.png";
import email from "../assets/contact/mail.png";
import location from "../assets/contact/location.png";
import fb from "../assets/contact/fb.png";
import insta from "../assets/contact/insta.png";
import linkedin from "../assets/contact/linkedin.png";
import twitter from "../assets/contact/x.png";

const Contact = () => {
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

        {/* CONTENT */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">

          {/* LEFT — FORM */}
          <div className="lg:col-span-2">
  <h3 className="text-lg font-semibold text-black mb-6">
    Get in Touch with Us
  </h3>

  <form className="space-y-8">
    <input
      type="text"
      placeholder="Your Name"
      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
    />

    <div className="grid sm:grid-cols-2 gap-4">
      <input
        type="email"
        placeholder="Your Email"
        className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
      />
      <input
        type="text"
        placeholder="Your Phone"
        className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
      />
    </div>

    <input
      type="text"
      placeholder="Subject"
      className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
    />

    <textarea
      rows="5"
      placeholder="Your Message"
      className="w-full border border-[#9BAAB9] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3E83C4] resize-none"
    ></textarea>

    <div className="flex justify-center mt-4">
      <button
        type="submit"
        className="bg-[#3E83C4] hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition cursor-pointer"
      >
        Send Message
      </button>
    </div>
  </form>
</div>

          {/* RIGHT — INFO */}
          <div className="space-y-6">

            {/* OFFICE INFO */}
            <div className="border border-[#a5bed4] rounded-lg p-6">
  <h4 className="font-semibold text-black mb-4">
    Office Info
  </h4>

  <div className="space-y-4">

    {/* Phone */}
    <div className="flex items-start gap-3 border border-[#9fbbd4] rounded-md p-3">
      <img src={phone} alt="phone" className="w-5 h-5 mt-1" />
      <div>
        <p className="text-xs text-[#656565]">Phone</p>
        <p className="text-sm font-medium text-[#535353]">
          +234 708 4274 918
        </p>
      </div>
    </div>

    {/* Mail */}
    <div className="flex items-start gap-3 border border-[#9fbbd4] rounded-md p-3">
      <img src={email} alt="email" className="w-5 h-5 mt-1" />
      <div>
        <p className="text-xs text-[#656565]">Mail</p>
        <p className="text-sm font-medium text-[#535353]">
          info@fixserv.co
        </p>
      </div>
    </div>

    {/* Location */}
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

              <div className="flex gap-4">
                {[fb, insta, linkedin, twitter].map((icon, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-blue-50 transition cursor-pointer"
                  >
                    <img src={icon} alt="social" className="w-5 h-5" />
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
