import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[435px] bg-[#D8E3FC] -z-1" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto pt-16 px-6 pb-16">
        <h2 className="text-3xl font-bold text-center mb-2">Get In Touch</h2>
        <p className="text-center text-gray-600 mb-8">
          Contact us if you need any assistance and guidance with Fixserv, our team will always be on standby to assist you.
        </p>

        <div className="rounded-3xl shadow-xl min-h-[550px] flex flex-col md:flex-row p-6 md:p-10 gap-10 bg-white">
          {/* Left: Contact Info */}
          <div className="bg-[#779BE7] text-white shadow-2xl rounded-2xl p-6 flex flex-col gap-4 md:w-[35%]">
            <h3 className="text-lg font-semibold mt-4">Contact Information</h3>
            <p className="text-xs">
              Contact any of the following means<br />of communication
            </p>
            <div className="h-4" />
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 mt-1 fill-white"  />
             <div className="flex flex-col text-sm">
               <span>+234 9876543213</span>
               <span>+234 8059770443</span>
             </div>
           </div>

        <div className="h-4" />
       <div className="flex items-center gap-3">
         <Mail className="w-5 h-5 text-white" />
          <span>fixserv@gmail.com</span>
       </div>

      <div className="h-4" /> 
     <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-white" />
       <span>Lagos, Nigeria</span>
     </div>
        </div>

          {/* Right: Form */}
          <form className="flex flex-col gap-4 md:w-1/2 bg-white mt-15">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Your Email</label>
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent"
                />
              </div>
            </div>
            {/* Below white bg */}
            <div>
              <label className="text-sm text-gray-600">Your Subject</label>
              <input
                type="text"
                placeholder="Subject"
                className="border-b border-gray-400 w-full focus:outline-none py-1 bg-transparent"
              />
            </div>
            <div>
              <label className="text-sm text-[#7c9be2]">Message</label>
              <textarea
                rows="4"
                placeholder="Write your message here"
                className="border-b border-[#7c9be2] w-full focus:outline-none py-1 resize-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-[#779BE7] hover:bg-[#779BE5dd] hover:shadow-gray-300 transition-all duration-300 text-white px-4 py-2 rounded-lg h-10 w-40 shadow-xl"
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
