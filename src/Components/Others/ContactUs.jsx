import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[435px] bg-[#D8E3FC] -z-1" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto pt-16 px-6 pb-16">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-shadow-xs text-shadow-[#a7bff4] text-gray-500">
          Get In Touch
        </h2>
        <p className="text-center text-shadow-xs text-shadow-[#a7bff4] text-gray-500 mb-8">
          Contact us if you need any assistance and guidance with Fixserv, our
          team will always be on standby to assist you.
        </p>

        <div className="rounded-4xl shadow-xl min-h-[550px] flex flex-col md:flex-row p-6 md:p-10 gap-10 bg-white">
          {/* Left: Contact Info */}
          <div className="bg-[#779BE7] text-white shadow-2xl rounded-3xl p-6 flex flex-col gap-4 md:w-[35%]">
            <h3 className="text-2xl text-shadow-lg font-semibold mt-4">
              Contact Information
            </h3>
            <p className="text-xs">
              Contact any of the following means
              <br />
              of communication
            </p>
            <div className="h-4" />
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1 fill-white" />
              <div className="flex flex-col text-sm">
                <span>+234 7084274918</span>
                <span>+234 8059770443</span>
              </div>
            </div>

            <div className="h-4" />
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-white" />
              <span>info@fixserv.co</span>
            </div>

            <div className="h-4" />
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-white" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>

          {/* Right: Form */}
          <form className="relative flex flex-col gap-4 md:w-1/2 bg-white mt-15 mb-10 md:mb-0">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-[#7c9be2]">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent placeholder:text-gray-300 placeholder:text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-[#7c9be2]">Your Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent placeholder:text-gray-300 placeholder:text-sm"
                />
              </div>
            </div>
            {/* Below white bg */}
            <div>
              <label className="text-sm text-[#7c9be2]">Your Subject</label>
              <input
                type="text"
                placeholder="Subject"
                className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent placeholder:text-gray-300 placeholder:text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-[#7c9be2]">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here"
                className="border-b border-[#7c9be2] w-full focus:outline-none py-1 resize-none bg-transparent placeholder:text-gray-300 placeholder:text-sm"
              />
            </div>
            <button
              type="submit"
              className="absolute right-0 -bottom-12 md:bottom-16 bg-[#779BE7] hover:bg-[#779BE5dd] hover:shadow-gray-300 transition-all duration-300 text-white px-4 py-2 rounded-lg h-10 w-40 shadow-xl"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
