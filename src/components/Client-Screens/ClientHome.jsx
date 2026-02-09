import React, { useState } from 'react';
import { useEffect } from "react";
import WelcomeBonus from "./WelcomeBonus"; 

import bgImage from "../../assets/client images/client-home/clientbg.png";
import bgOverlay from "../../assets/client images/client-home/bgoverlay.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import johnTwo from "../../assets/client images/client-home/johntwo.png";  
import johnThree from "../../assets/client images/client-home/Johnthree.png";
import starIcon from "../../assets/client images/client-home/star.png";
import mark from "../../assets/client images/client-home/mark.png";

// catgeory imports
import catImageOne from "../../assets/client images/client-home/catjoneone.png";
import catImageTwo from "../../assets/client images/client-home/catjohntwo.png";
import catImageThree from "../../assets/client images/client-home/catjohnthree.png";
import catImageFour from "../../assets/client images/client-home/catjohnfour.png";
import catImageFive from "../../assets/client images/client-home/catjohnfive.png";
import catImageSix from "../../assets/client images/client-home/catjohnsix.png";

// baner import 
import bannerBg from "../../assets/client images/client-home/banner.png";
import bannerOverlay from "../../assets/client images/client-home/banner overlay.png";

import { useNavigate } from 'react-router-dom';




const ClientHome = () => {

const user = JSON.parse(localStorage.getItem("fixserv_user"));
const firstName = user?.fullName?.split(" ")[0];


const [searchQuery, setSearchQuery] = useState("");
const [searchLoading, setSearchLoading] = useState(false);
const [searchError, setSearchError] = useState("");



const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    setSearchLoading(true);
    setSearchError("");

    const res = await fetch(
      `https://search-and-discovery.onrender.com/api/search?keyword=${encodeURIComponent(
        searchQuery
      )}&isAvailableNow=true`
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error("Search failed");
    }


    const artisansFromSearch = data.data?.artisans?.data || [];

    setApiArtisans(artisansFromSearch);

  } catch (err) {
    setSearchError(err.message);
  } finally {
    setSearchLoading(false);
  }
};



  
  const navigate = useNavigate();

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

useEffect(() => {
  const shouldShow = localStorage.getItem("showWelcomeBonus");

  if (shouldShow === "true") {
    setShowWelcomeBonus(true);
    localStorage.removeItem("showWelcomeBonus"); 
  }
}, []);


  const categories = ["Phone", "Tablet", "Laptop", "Home Appliances"];

  const [activeCategory, setActiveCategory] = useState("Phone");

  const [apiArtisans, setApiArtisans] = useState([]);
const [loadingArtisans, setLoadingArtisans] = useState(false);

useEffect(() => {
  const fetchArtisans = async () => {
    try {
      setLoadingArtisans(true);

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
        throw new Error(data.message || "Failed to fetch artisans");
      }

      setApiArtisans(data.users || []);
    } catch (err) {
      console.error("Error fetching artisans:", err);
    } finally {
      setLoadingArtisans(false);
    }
  };

  fetchArtisans();
}, []);

const mappedApiArtisans = apiArtisans.map((artisan) => ({
  id: artisan.id || artisan._id,
  name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
  location: artisan.location || "Unknown location",
  rating: artisan.rating || 0,
  skills: artisan.skills || artisan.skillSet || [],
  image: johnOne,
  available: true,
}));




  const artisans = [
    {
      id: 1,
      name: "John Adewale",
      category: "Phone",
      image: catImageOne,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 2,
      name: "John Adewale",
      category: "Tablet",
      image: catImageTwo,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 3,
      name: "John Adewale",
      category: "Laptop",
      image: catImageThree,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 4,
      name: "John Adewale",
      category: "Home Appliances",
      image: catImageFour,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 5,
      name: "John Adewale",
      category: "Phone",
      image: catImageFive,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 6,
      name: "John Adewale",
      category: "Tablet",
      image: catImageSix,
      rating: 4.7,
      reviews: 89,
      available: true,
    },
    {
      id: 7,
      name: "John Adewale",
      category: "Laptop",   
      image: catImageSix,
      rating: 4.7,
      reviews: 89,  
      available: true,
    },
    {
      id: 8,
      name: "John Adewale",
      category: "Home Appliances",
      image: catImageFive,
      rating: 4.7,
      reviews: 89,
      available: true,
    }
  ];


  const filteredArtisans = artisans.filter(
    (artisan) => artisan.category === activeCategory
  );

  return (
   
    <div className="w-full">
      {/* HERO */}
      <section className="relative w-full h-[420px] flex items-center justify-center mt-4">
        
        {/* Background Image */}
        <img
          src={bgImage}
          alt="Client background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <img
          src={bgOverlay}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
          
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Hi Praise, What are you fixing today?
          </h1>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
  Hi {firstName}, What are you fixing today?
</h1>
<h1 className="text-3xl md:text-4xl font-semibold mb-3">
  Hi {firstName || "there"}, What are you fixing today?
</h1>



          {/* Subtitle */}
          <p className="text-sm md:text-base text-[#D9D9D9] mb-8">
            Connect with skilled and trusted professionals in minutes.
          </p>

{/* Search Bar */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleSearch();
  }}
  className="flex w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg"
>
  {/* Input */}
  <div className="flex items-center flex-1 px-4">
    <svg
      className="w-5 h-5 text-gray-400 mr-2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>

    <input
      type="text"
      placeholder="What do you need?"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full py-3 text-sm text-black focus:outline-none"
    />
  </div>

  {/* Button */}
  <button
    type="submit"
    disabled={searchLoading}
    className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-8 text-sm font-medium transition disabled:opacity-60"
  >
    {searchLoading ? "Searching..." : "Search"}
  </button>
</form>

        </div>
      </section>

    <section className="w-full py-14 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">

    {/* Title */}
    <h2 className="text-lg font-semibold text-black mb-6">
      Top Artisans near you
    </h2>

    {!loadingArtisans && !searchLoading && mappedApiArtisans.length === 0 && (
  <p className="text-sm text-gray-500">
    No artisans found for “{searchQuery}”
  </p>
)}


    {/* Marquee Wrapper */}
    <div className="relative w-full overflow-hidden">
      <div className="flex w-max gap-8 marquee">
  {[...Array(2)].map((_, loopIndex) => (
    <React.Fragment key={loopIndex}>
      {loadingArtisans ? (
        <p className="text-sm text-gray-500 px-4">
          Loading artisans...
        </p>
      ) : (
        mappedApiArtisans.slice(0, 6).map((artisan) => (
          <div
            key={`${loopIndex}-${artisan.id}`}
            className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
          >
            <div className="relative">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-full h-60 object-cover rounded-lg"
              />

              <span className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Early User
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-black">
                    {artisan.name}
                  </h3>
                  <img src={mark} alt="verified" className="w-4 h-4" />
                </div>

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
                // onClick={() => navigate("/client/artisan-profile")}
                onClick={() =>
    navigate(`/client/artisan-profile/${artisan.id}`)
  }
                className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))
      )}
    </React.Fragment>
  ))}
</div>

    </div>
  </div>
</section>



    <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
  {/* Title */}
    <h2 className="text-lg font-semibold text-black mb-6">
    New on Fixserv
  </h2>

  {/* Marquee Wrapper */}

<div className="relative w-full overflow-hidden">
  <div className="flex w-max gap-8 marquee">
    {[...Array(2)].map((_, loopIndex) => (
      <React.Fragment key={loopIndex}>
        {loadingArtisans ? (
          <p className="text-sm text-gray-500 px-4">
            Loading artisans...
          </p>
        ) : (
          mappedApiArtisans.slice(0, 6).map((artisan) => (
            <div
              key={`${loopIndex}-${artisan.id}`}
              className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
            >
          
            </div>
          ))
        )}
      </React.Fragment>
    ))}
  </div>
</div>
</div>



</section>


<section className="w-full py-14 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">

    {/* CATEGORY */}
    <p className="text-sm font-medium text-black mb-3">
      By Category:
    </p>

    <div className="flex gap-3 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition
            ${
              activeCategory === cat
                ? "bg-[#3E83C4] text-white"
                : "bg-[#B3B3B3] text-[#656565] hover:bg-gray-400"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* ARTISANS GRID */}
    <div className="relative w-full mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

        {filteredArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="border border-[#c9d9e8] rounded-xl p-4 flex gap-4 items-center"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-70 h-45 rounded-xl object-cover"
              />

              {/* EARLY USER BADGE */}
              <span className="absolute -top-0.5 -right-2 bg-[#6C63FF] text-white text-[10px] px-3 py-1 rounded-full">
                Early User
              </span>
            </div>

            {/* DETAILS */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {artisan.name}
                </h3>
                <span className="text-[#3E83C4] text-xs">✔</span>
              </div>

              <p className="text-lg text-[#535353] mt-2 mb-2">
                Electronics Technicians
              </p>

              <div className="flex items-center gap-1 mt-6 text-sm text-black">
                <span className="text-yellow-500">★</span>
                <span>{artisan.rating}</span>
                <span>({artisan.reviews} reviews)</span>

                {artisan.available && (
                  <span className="ml-6 bg-[#C9E8CA] text-[#43A047] px-2 py-0.5 rounded-full text-[10px]">
                    Available
                  </span>
                )}
              </div>

              <button onClick={() =>
    navigate(`/client/artisan-profile/${artisan.id}`)} className="mt-2 w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-2 rounded-md text-sm font-medium transition cursor-pointer">
                View Profile
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>

  </div>
</section>



<section className="relative w-full flex items-center justify-center mt-4 mb-8 py-14 overflow-hidden">
  

  <img
    src={bannerBg}
    alt="Banner background"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />


  <img
    src={bannerOverlay}
    alt="Banner overlay"
    className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
  />


  <div className="relative z-20 text-center w-full px-6">
    <h5 className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-tight">
      Need Help?
    </h5>

    <p className="mt-6 text-sm md:text-lg text-blue-100 max-w-4xl mx-auto">
      We're here to assist you anytime. Reach out to Fixserv Support.
    </p>

    <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
      <button className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-7 py-3 rounded-md font-medium transition cursor-pointer">
        Chat With Us
      </button>
    </div>
  </div>
</section>


{showWelcomeBonus && (
  <WelcomeBonus onClose={() => setShowWelcomeBonus(false)} />
)}

</div>



  )
}

export default ClientHome