import React, { useState } from "react";
import overlayHeroImage from "../assets/home/overlay home image.png";
import heroImage from "../assets/home/home image.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/pagination";

import Image1 from "../assets/home/1st image.png";
import Image2 from "../assets/home/2nd image.png";
import Image3 from "../assets/home/3rd image.png";

import Image4 from "../assets/home/image 4.png";
import overlay from "../assets/home/image 4 overlay.png";
import mark from "../assets/home/mark.png";
import search from "../assets/home/search.png";
import location from "../assets/home/location.png";
import star from "../assets/home/star.png";

import yellowStar from "../assets/home/yellowstar.png";
import adigun from "../assets/home/adigun.png";
import uche from "../assets/home/uche.png";
import bolu from "../assets/home/bolu.png";
import quote from "../assets/home/quote.png";

const steps = [
  {
    step: "Step 1",
    title: "Tell Us What You Need",
    description:
      "Describe your gadget issue or service request in simple steps.",
    image: Image1,
  },
  {
    step: "Step 2",
    title: "Get Matched Instantly",
    description:
      "We connect you with verified professionals near your location.",
    image: Image2,
  },
  {
    step: "Step 3",
    title: "Get It Fixed",
    description:
      "Your issue gets resolved quickly and reliably by skilled experts.",
    image: Image3,
  },
];

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();

  const getImageStack = () => [
    steps[activeIndex],
    steps[(activeIndex + 1) % steps.length],
    steps[(activeIndex + 2) % steps.length],
  ];

  return (
    <div className="w-full">
  {/* HERO - This section already takes full width */}
  <section className="relative w-full h-[90vh] flex items-center justify-center mt-4">
    <img src={heroImage} alt="Hero background" className="absolute inset-0 w-full h-full object-cover" />
    <img src={overlayHeroImage} alt="Hero overlay" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 " />
    <div className="relative z-10 text-center w-full px-8">
      <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight">
        Nigeria&apos;s most trusted repair <br /> network.
      </h1>
      <p className="mt-6 text-xl md:text-2xl text-white max-w-4xl mx-auto">
        Connecting skilled professionals with clients for fast, reliable service.
      </p>
      <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
        <button
      onClick={() => navigate("sign-up")}
      className="bg-[#3E83C4] hover:bg-blue-600 text-white px-7 py-3 rounded-md font-medium transition cursor-pointer"
    >
      Find A Professional
    </button>
        <button 
        onClick={() => navigate("artisan-signup")}
        className="border-2 border-[#3E83C4] text-white hover:bg-[#3E83C4] px-7 py-3 rounded-md font-medium transition flex items-center gap-2 cursor-pointer">
          Join as an Artisan
        </button>
      </div>
    </div>
  </section>

  {/* HOW IT WORKS - Made fully width */}
  <section className="py-20 bg-white overflow-hidden w-full">
    {/* Header - Full width container with centered content */}
    <div className="w-full text-center mb-12 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
        How It Works
      </h2>
      <p className="mt-4 text-gray-500 text-lg max-w-5xl mx-auto">
        Getting the right help shouldn&apos;t be stressful. With Fixserv, finding trusted repairers and skilled workers is quick, transparent, and reliable. Here&apos;s how it works:
      </p>
    </div>

    {/* Main Content - Full width container */}
    <div className="w-full px-2">
      {/* <div className="max-w-7xl mx-auto px-2 md:px-6"></div> */}
        {/* <div className="grid md:grid-cols-2 items-center w-full"> */}
          <div className="grid md:grid-cols-2 gap-4 items-center justify-center">

          {/* LEFT — IMAGE STACK */}
  <div className="relative h-[420px] flex items-center justify-center">

  {getImageStack().map((item, i) => (
    <img
      key={i}
      src={item.image}
      alt=""
      className={`
        absolute rounded-2xl shadow-xl transition-all duration-500 ease-in-out
        ${i === 0 ? "z-30 scale-100 translate-x-0" : ""}
        ${i === 1 ? "z-20 scale-[0.95] translate-x-10 opacity-90" : ""}
        ${i === 2 ? "z-10 scale-[0.9] translate-x-20 opacity-80" : ""}
      `}
      style={{
        width: "440px",
      }}
    />
  ))}
</div>


          {/* RIGHT — TEXT (Swiper-controlled) */}
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: ".how-it-works-pagination",
            }}
            loop
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full"
          >
            {steps.map((item, index) => (
           
                  <SwiperSlide key={index}>
  <div className="flex flex-col justify-center h-full">

                  <p className="text-black font-semibold mb-2">
                    {item.step}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-semibold text-black">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[#535353] max-w-md">
                    {item.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Centered Pagination */}
        <div className="how-it-works-pagination mt-8 flex justify-center w-full" />
      </div>
  </section>

  {/* WHY CHOOSE FIXSERV - Made fully width */}
<section className="py-24 bg-white w-full">
  <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
    <div className="grid md:grid-cols-2 gap-12 items-center w-full">
      {/* Text Content */}
      <div className="w-full">
        <h2 className="text-3xl md:text-4xl font-semibold text-black">
          Why Choose Fixserv
        </h2>

        <p className="mt-4 text-[#535353] max-w-lg">
          We want to help our users to get the easiest access to reliable,
          high-quality and transparent services anytime, any day!
        </p>

        {/* List */}
        <ul className="mt-8 space-y-4">
          <li className="flex items-start gap-3">
            <img src={mark} alt="" className="w-5 h-5 mt-1" />
            <span className="text-black">
              Verified and trusted professionals only
            </span>
          </li>

          <li className="flex items-start gap-3">
            <img src={search} alt="" className="w-5 h-5 mt-1" />
            <span className="text-black">
              Transparent process, no hidden steps or surprises
            </span>
          </li>

          <li className="flex items-start gap-3">
            <img src={location} alt="" className="w-5 h-5 mt-1" />
            <span className="text-black">
              Nationwide access wherever you are in Nigeria
            </span>
          </li>

          <li className="flex items-start gap-3">
            <img src={star} alt="" className="w-5 h-5 mt-1" />
            <span className="text-black">
              Ratings and reviews for confidence
            </span>
          </li>
        </ul>

        {/* Button */}
        <button 
        onClick={() => navigate("/sign-up")}
        className="mt-10 bg-[#3E83C4] hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium transition cursor-pointer">
          Sign Up With Us
        </button>
      </div>

      {/* Image */}
      <div className="relative flex justify-center md:justify-end w-full">
        <img
          src={Image4}
          alt=""
          className="w-full max-w-[520px] h-auto object-cover"
          // className="w-full max-w-[510px] h-auto object-cover"
        />

        <img
          src={overlay}
          alt=""
          className="absolute -bottom-12 -left-0.5 w-[310px] h-auto object-cover"
          // className="absolute -bottom-11 -left-12 md:-left-17 w-[280px] md:w-[300px] h-auto object-cover"
        />
      </div>
    </div>
  </div>
</section>

  {/* Banner */}
  <section className="relative w-full flex items-center justify-center mt-4 mb-8 py-14">
    <div className="absolute inset-0 bg-[#346DA3]" />
    <div className="relative z-10 text-center w-full px-6">
      <h5 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight">
        Get More Customers, Build Your Reputation.
      </h5>
      <p className="mt-6 text-sm md:text-lg text-blue-100 max-w-4xl mx-auto">
         No more relying only on word of mouth. Grow your income, showcase your skills, and build your reputation online with every job you complete.
      </p>
      <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
        <button onClick={() => navigate("artisan-signup")} className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-7 py-3 rounded-md font-medium transition cursor-pointer">
          Begin Your Journey
        </button>
       
      </div>
    </div>
  </section>

  <section className="py-20 bg-white">
  {/* HEADER */}
  <div className="text-center mb-14">
    <p className="text-lg text-[#3E83C4] font-medium mb-4">
      Testimonial
    </p>

    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      What People Are Saying
    </h2>

    <p className="mt-2 text-gray-500 max-w-xl mx-auto text-sm">
      Real stories from our users and professionals who trust Fixserv every day.
    </p>
  </div>

  {/* TESTIMONIAL CARDS */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-14">

      {/* CARD 1 */}
      <div className="bg-[#3E83C4] rounded-xl p-7 text-white border border-white/10">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={yellowStar} alt="star" className="w-4 h-4" />
          ))}
        </div>

        {/* Text */}
        <p className="text-lg leading-relaxed mb-8">
          “I used to struggle finding someone reliable to fix my laptop.
          With Fixserv, I was matched with a technician in less than 10 minutes,
          and the repair was perfect. This platform saves me so much stress.”
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={adigun} alt="Adigun" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-lg font-semibold">Adigun Funmilayo</p>
              <p className="text-sm text-blue-200">Customer</p>
            </div>
          </div>

          <img src={quote} alt="quote" className="w-10 opacity-40 mt-2" />
        </div>
      </div>

      {/* CARD 2 */}
      <div className="bg-[#3E83C4] rounded-xl p-7 text-white border border-white/10">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={yellowStar} alt="star" className="w-4 h-4" />
          ))}
        </div>

        <p className="text-lg leading-relaxed mb-14">
          “Before Fixserv, I only got jobs through word of mouth.
          Now, I get steady customers every week. It’s helping me
          grow my business and build a reputation online.”
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={uche} alt="Uche" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-lg font-semibold">Uche Kings</p>
              <p className="text-sm text-blue-200">Artisan</p>
            </div>
          </div>

          <img src={quote} alt="quote" className="w-10 opacity-40 mt-2" />
        </div>
      </div>

      {/* CARD 3 */}
      <div className="bg-[#3E83C4] rounded-xl p-7 text-white border border-white/10">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <img key={i} src={yellowStar} alt="star" className="w-4 h-4" />
          ))}
        </div>

        <p className="text-lg leading-relaxed mb-14">
          “Fixserv has changed the way I find work.
          Before, I relied only on word of mouth.
          Now, customers come directly to me,
          and my reputation grows with every review.”
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={bolu} alt="Bolu" className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-lg font-semibold">Bolu Adebayo</p>
              <p className="text-sm text-blue-200">Artisan</p>
            </div>
          </div>

          <img src={quote} alt="quote" className="w-10 opacity-40 mt-2" />
        </div>
      </div>

    </div>
  </div>
</section>


</div>
  );
};

export default Home;