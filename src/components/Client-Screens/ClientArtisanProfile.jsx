import React, { useState, useEffect } from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import tick from "../../assets/client images/client-home/tick.png";
import share from "../../assets/client images/client-home/share.png";
import settingImage from "../../assets/client images/client-home/setting.png";
import battery from "../../assets/client images/client-home/battery.png";
import flashImage from "../../assets/client images/client-home/flash.png";
import cameraImage from "../../assets/client images/client-home/camera.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import johnTwo from "../../assets/client images/client-home/johntwo.png";  
import johnThree from "../../assets/client images/client-home/Johnthree.png";
import starIcon from "../../assets/client images/client-home/star.png";
// import mark from "../../assets/client images/client-home/mark.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";



const services = [
  {
    id: 1,
    title: "Screen Replacement",
    price: "₦12,000",
    icon: settingImage,
  },
  {
    id: 2,
    title: "Battery Replacement",
    price: "₦7,000",
    icon: battery,
  },
  {
    id: 3,
    title: "Charging port Fix",
    price: "₦5,000",
    icon: flashImage,
  },
  {
    id: 4,
    title: "Camera Repair",
    price: "₦8,000",
    icon: cameraImage,
  },
  {
    id: 5,
    title: "General Diagnostics",
    price: "₦3,500",
    icon: settingImage,
  },
];

const ClientArtisanProfile = () => {

  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
const [loadingArtisan, setLoadingArtisan] = useState(true);


  const [activeTab, setActiveTab] = useState("services");

  const [recommendedArtisans, setRecommendedArtisans] = useState([]);
const [loadingRecommendations, setLoadingRecommendations] = useState(false);

const { artisanId } = useParams();

useEffect(() => {
  const fetchArtisan = async () => {
    try {
      const token = localStorage.getItem("fixserv_token");

      const res = await fetch(
        `https://user-management-h4hg.onrender.com/api/admin/user/${artisanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to fetch artisan");
      }

      const artisanData = {
        ...json.data,
        id: json.data.id || json.data._id,
      };

      setArtisan(artisanData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingArtisan(false);
    }
  };

  fetchArtisan();
}, [artisanId]);

useEffect(() => {
  const fetchRecommendedArtisans = async () => {
    try {
      setLoadingRecommendations(true);

      const token = localStorage.getItem("fixserv_token");

      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/getAll?role=ARTISAN",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to fetch artisans");
      }

      setRecommendedArtisans(data.data || []);
    } catch (err) {
      console.error("Recommendation error:", err);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  fetchRecommendedArtisans();
}, []);

const mappedRecommendations = recommendedArtisans
.filter((a) => String(a._id || a.id) !== String(artisanId))
  .map((artisan) => ({
    id: artisan.id,
    name: artisan.fullName || "Unnamed Artisan",
    location: artisan.location || "Unknown location",
    rating: artisan.rating || 0,
    skills: artisan.skills || [],
    image: artisan.profileImage || johnOne
  }));

    if (loadingArtisan || !artisan) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading artisan profile...
      </div>
    );
  }


  return (
    <div className="w-full">
        <section className="w-full bg-[#3E83C4] py-14 mt-4 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
    <div className="flex flex-col md:flex-row items-center gap-8">

                  

          {/* LEFT – IMAGE */}
          <div className="relative">
            <img
              src={profileImage}
              alt="Artisan"
              className="w-70 h-70 rounded-xl object-cover"
            />

            {/* Badge */}
            <span className="absolute top-1 right-1 
  bg-[linear-gradient(90deg,#3E83C4,#9747FF,#1E3F5E)]
  text-white text-xs px-3 py-1 rounded-full
  shadow-md tracking-wide">
  Early User
</span>


          </div>

          {/* CENTER – DETAILS */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-4">
              
              <h2 className="text-2xl font-semibold">
                {artisan.fullName}
              </h2>
              <img src={tick} alt="verified" className="w-5 h-5" />
            </div>

            <p className="text-sm opacity-90 mt-1">
              Electronics Technicians
            </p>

            <div className="mt-3 space-y-1 text-sm opacity-90">
              <p>Experience: <span className="font-medium">5+ years</span></p>
              <p>Location: <span className="font-medium">{artisan.location}</span></p>
            </div>

            <button onClick={() => navigate(`/client/booking/${artisan.id}`, {state: { artisan }})} className="mt-5 bg-white text-[#3E83C4] px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-100 transition cursor-pointer">
              Request Appointment
            </button>
          </div>

          {/* RIGHT – STATS */}
          {/* <div className="text-white flex flex-col items-end gap-4"> */}
            <div className="text-white flex flex-col items-center md:items-end gap-4">


            {/* Share */}
            <button className="p-2 rounded-md transition cursor-pointer">
              <img src={share} alt="share" className="w-4 h-4" />
            </button>

            {/* Categories */}
            <div className="flex gap-2">
              {["Phone", "Tablet", "Laptop"].map((item) => (
                <span
                  key={item}
                  className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
  <span className="flex">
    <span className="text-yellow-400">★★★★</span>
    <span
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: "linear-gradient(to right, #F99F10, #D9D9D9)",
      }}
    >
      ★
    </span>
  </span>
  <span className="text-white">
  {artisan.rating || 0} ({artisan.reviews || 0} reviews)
</span>

  {/* <span className="text-white">4.7 (89 reviews)</span> */}
</div>


            {/* Repairs */}
            <div className="text-center mt-2 text-white">
              <p className="text-2xl font-semibold">20</p>
              <p className="text-xs opacity-90">Total Repairs</p>
            </div>

          </div>
        </div>
        </div>
      </section>

      <section className="w-full px-8 md:px-18 py-14 overflow-hidden">
<div className="max-w-7xl mx-auto px-2 md:px-6">
    {/* <section className="w-full py-14 overflow-hidden"> <div className="max-w-7xl mx-auto px-2 md:px-6"> */}
    {/* About Me Section */}
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-black mb-8">About Me</h2>
      <div className="bg-white">
        <p className="text-[#535353] leading-relaxed text-lg">
          I'm a phone and tablet repair technician with over 6 years of hands-on experience. From cracked screens to battery replacements and software fixes, I've successfully restored 700+ devices for clients across Lagos. My goal is simple: fast, reliable, and affordable repairs that keep you connected. I take pride in my attention to detail and always ensure every gadget leaves my hands in top condition.
        </p>
      </div>
    </div>


    {/* Business Hours Section */}
<div className="mt-16">
  <h2 className="text-3xl font-bold text-black mb-6">Business Hours</h2>

  <div className="space-y-3 text-sm text-[#535353]">
    {[
      { day: "Monday", open: "9:00 Am", close: "5:00 PM" },
      { day: "Tuesday", open: "9:00 Am", close: "5:00 PM" },
      { day: "Wednesday", open: "9:00 Am", close: "5:00 PM" },
      { day: "Thursday", open: "9:00 Am", close: "5:00 PM" },
      { day: "Friday", open: "9:00 Am", close: "5:00 PM" },
      { day: "Saturday", close: "Closed" },
      { day: "Sunday", close: "Closed" },
    ].map((item) => (
      <div key={item.day} className="flex items-center gap-6">
        {/* Day */}
        <span className="w-24 text-[#8B8B8B]">{item.day}:</span>

        {/* Time / Closed */}
        {item.close === "Closed" ? (
          <span className="text-[#8B8B8B]">Closed</span>
        ) : (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 bg-white">
              {item.open}
            </span>
            <span className="px-3 py-1 border border-gray-200 rounded-md text-xs text-gray-600 bg-white">
              {item.close}
            </span>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  </div>
</section>

{/* <section className="w-full px-6 md:px-20 py-12"> */}
<section className="w-full py-14 overflow-hidden"> 
  <div className="max-w-7xl mx-auto px-2 md:px-6">
{/* <section className="w-full px-24 md:px-53 py-14"> */}
      
      {/* TABS */}
      <div className="flex gap-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-3 text-sm font-medium transition
            ${
              activeTab === "services"
                ? "text-black border-b-2 border-[#3E83C4]"
                : "text-[#8B8B8B] hover:text-gray-600"
            }`}
        >
          My Services & Pricing
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-sm font-medium transition
            ${
              activeTab === "reviews"
                ? "text-black border-b-2 border-[#3E83C4]"
                : "text-[#8B8B8B] hover:text-gray-600"
            }`}
        >
          Reviews & Ratings
        </button>
      </div>

      {/* CONTENT */}
      <div className="mt-8">
        {activeTab === "services" && (
          <div className="grid md:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-[#3E83C4] rounded-xl p-6 text-center hover:shadow-md transition"
              >
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center">
                    <img
                      src={service.icon}
                      alt={service.title}
                      className="w-12 h-12"
                    />
                  </div>
                </div>

                <h3 className="font-medium text-sm text-[#3E83C4]">
                  {service.title}
                </h3>

                <p className="text-sm text-[#535353] mt-2">
                  Starting Price:{" "}
                  <span className="font-semibold text-black">
                    {service.price}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6">
            {/* Replace this with your actual Reviews component */}
            <div className="text-sm text-gray-600">
              ⭐ 4.7 average rating from 89 reviews
            </div>

            <div className="mt-4 space-y-4">
              <div className="border rounded-lg p-4">
                <p className="font-medium text-sm text-black">Great service!</p>
                <p className="text-xs text-[#535353] mt-1">
                  Fast and professional repair. Highly recommended.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="font-medium text-sm text-black">Very reliable</p>
                <p className="text-xs text-[#535353] mt-1">
                  Fixed my phone perfectly. Will come back again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </section>

   

        <section className="w-full py-14 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-6">
      {/* Title */}
        <h2 className="text-lg font-semibold text-black mb-6">
        You may also like
      </h2>
    
      {/* Marquee Wrapper */}
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max gap-8 marquee">
    
          {/* DUPLICATE CONTENT FOR SEAMLESS LOOP */}
          {loadingRecommendations ? (
  <p className="text-sm text-gray-500 px-4">
    Loading recommendations...
  </p>
) : (
  mappedRecommendations.slice(0, 6).map((artisan) => (
    <div
      key={artisan.id}
      className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={artisan.image}
          alt={artisan.name}
          className="w-full h-60 object-cover rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-black">
            {artisan.name}
          </h3>

          <span className="text-xs text-[#43A047] bg-[#C9E8CA] px-2 py-0.5 rounded-full">
            Available
          </span>
        </div>

        <p className="text-sm text-[#535353] mb-2">
          {artisan.location}
        </p>

        <div className="flex items-center gap-1 text-sm mb-3">
          <img src={starIcon} alt="star" className="w-4 h-4" />
          <span className="font-medium text-black">
            {artisan.rating}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {artisan.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-xs text-[#3E83C4] bg-[#C1DAF3] px-2 py-1 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>

        <button
          onClick={() =>
            navigate(`/client/artisan-profile/${artisan.id}`)
          }
          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  ))
)}

          
        </div>
      </div>
      </div>
    </section>


    </div>
  );
};

export default ClientArtisanProfile;
