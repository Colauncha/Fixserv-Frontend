// src/components/Testimonials.jsx
import React from 'react';
import Image from '../assets/uploads/bg-image.png'


const testimonials = [
  {
    name: "Maxwell Davies",
    text: "Fixserv’s service is mind blowing, my gadget was fixed well and it was done on time",
    image: " ", 
  },
  {
    name: "Shaw Combs",
    text: "Fixserv helped me to fix my gadget and I had no complains after",
    image: " ",
  },
  {
    name: "Aramide Balogun",
    text: "Fixserv is a very reliable company, my laptop was well fixed",
    image: " ",
  },
];

const Testimonials = () => {
  return (
    <div className="bg-cover bg-center py-16 text-white">
      <div className="relative w-full h-[450px]">
        <img
          src={Image}
          alt="bg-Image"
          className="w-full h-full bg-cover"
        />
  
      <div className="absolute inset-0 flex px-15 py-20">
        <h2 className="text-5xl text-white">
          CLIENTS TESTIMONY
        </h2>
      </div>
     </div>

      <div className="flex justify-center gap-20 flex-wrap max-w-5xl mx-auto">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="bg-[#A1B7F2] text-[#ECF1FC] items-center justify-items-center rounded-xl p-6 w-68 h-80 "
          >
            <div className="flex items-center gap-4 mb-10">
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full bg-[#081f5b]"
              />
              <h4 className="font-semibold">{t.name}</h4>
            </div>
            <p className="text-md justify-items-center ">{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
