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
              className={`
                group
                flex items-center justify-start
                shadow-md
                relative w-[90%] h-44
                overflow-hidden
                transition-all duration-300
                hover:shadow-lg hover:scale-[1.2]
                hover:-translate-x-12
                bg-white
                border-l-10 border-[#D9D9D9] hover:border-[#6A5FAD]
                rounded-sm
              `}
            >
              {/* Card content */}
              <div className="flex w-full h-full p-4 items-center justify-start gap-4">
                {/* Profile Image */}
                <div className="relative z-10">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                </div>

                {/* Text */}
                <div className="relative w-full">
                  {/* Decorative Quote */}
                  <span
                    className={`
                      absolute -top-4 right-4
                      text-5xl font-bold opacity-10
                      transition-all duration-300
                      text-[#D9D9D9]"
                      group-hover:text-[#6A5FAD]
                      group-hover:opacity-60
                    `}
                  >
                    &ldquo;
                  </span>
                  <p className="text-gray-900 font-bold text-base">{client.name}</p>
                  <p className="text-gray-600 text-sm mt-1 leading-snug">{client.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
