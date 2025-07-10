import React from "react";

const testimonials = [
  {
    name: "Adigun Funmilayo",
    text: "Fixserv is a very reliable company, my laptop was well fixed",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Ogunde Joseph",
    text: "Fixserv helped me to fix my gadget and I had no complains after",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Samuel Ikechukwu",
    text: "Fixserv’s service is mind blowing, my gadget was fixed well and it was done on time",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[#ECF1FC63] py-2 px-6 md:px-20">
      <div className="flex flex-col md:flex-row gap-10 items-center p-12">
        {/* Left Side */}
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold text-[#000000D1] mb-6 leading-snug">
            What our clients <br /> think about Fixserv
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-xl font-light leading-relaxed">
            Fixserv has been a great platform that has done a <br />
            good job in connecting people with <br />
            various artisans all over Nigeria.
          </p>
        </div>


        <div className="md:w-1/2 flex flex-col gap-12">
  {testimonials.map((client, index) => (
    <div
      key={index}
      className={`flex items-start shadow-md relative w-[85%] h-40 overflow-hidden ${
        index === 1 ? "-translate-x-30" : ""
      }`}
    >
      {/* Colored Left Edge - changes per index */}
      <div
        className={`w-4 h-full ${
          index === 1 ? "bg-[#6A5FAD]" : "bg-[#D9D9D9]"
        }`}
      ></div>

      {/* Card content */}
      <div className="flex bg-white w-full h-full p-4 items-start gap-4">
        {/* Profile Image overlapping the colored strip */}
        <div className="relative z-10 rounded-lg flex gap-4 items-start">
          <img
            src={client.image}
            alt={client.name}
            className="w-18 h-18 rounded-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="relative">
          {/* Decorative Quote Mark */}
          <span
            className={`absolute -top-2 right-10 text-5xl font-bold opacity-90 ${
              index === 1 ? "text-[#6A5FAD]" : "text-[#D9D9D9]"
            }`}
          >
            &ldquo;
          </span>
          <p className="text-gray-800 font-semibold">{client.name}</p>
          <p className="text-gray-600 text-sm mt-1">{client.text}</p>
        </div>
        
      </div>
    </div>
  ))}
</div>


        {/* Right Side */}
        {/* <div className="md:w-1/2 flex flex-col gap-12">
          {testimonials.map((client, index) => (
            <div
              key={index}
              className={`flex items-start bg-white rounded-lg shadow-md p-4 relative w-[85%] h-40  ${
                index === 1 ? "-translate-x-30" : ""
              } transition-transform duration-300`}
            >
              {/* Vertical gradient line */}
              {/* <div className="w-4 h-full bg-gradient-to-b from-[#D9D9D9] via-[#6A5FAD] to-[#D9D9D9] mr-4 rounded"></div>

              {/* Image and Text inside white card */}
              {/* <div className="flex gap-4 items-start">
                <img
                  src={client.image}
                  alt={client.name}
                  className="w-18 h-18 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{client.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{client.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>  */} 


      </div>
    </section>
  );
};

export default TestimonialsSection;
