import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeBonus from "./WelcomeBonus";

// Images
import bgImage from "../../assets/client images/client-home/clientbg.png";
import bgOverlay from "../../assets/client images/client-home/bgoverlay.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import johnTwo from "../../assets/client images/client-home/johntwo.png";
import johnThree from "../../assets/client images/client-home/Johnthree.png";
import starIcon from "../../assets/client images/client-home/star.png";
import mark from "../../assets/client images/client-home/mark.png";

// Category Images
import catImageOne from "../../assets/client images/client-home/catjoneone.png";
import catImageTwo from "../../assets/client images/client-home/catjohntwo.png";
import catImageThree from "../../assets/client images/client-home/catjohnthree.png";
import catImageFour from "../../assets/client images/client-home/catjohnfour.png";
import catImageFive from "../../assets/client images/client-home/catjohnfive.png";
import catImageSix from "../../assets/client images/client-home/catjohnsix.png";

// Banner
import bannerBg from "../../assets/client images/client-home/banner.png";
import bannerOverlay from "../../assets/client images/client-home/banner overlay.png";

import { searchServicesAndArtisans } from "../../api/search.api";



// const SEARCH_BASE_URL = "/search";

const ClientHome = () => {

  /* =========================
     INITIALIZATION SECTION
  ========================== */

  const navigate = useNavigate();

const storedUser = localStorage.getItem("fixserv_user");
const user = storedUser ? JSON.parse(storedUser) : null;


  const firstName = user?.fullName?.split(" ")[0];

  const categories = ["Phone", "Tablet", "Laptop", "Home Appliances"];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [categoryArtisans, setCategoryArtisans] = useState([]);
  const [loadingCategoryArtisans, setLoadingCategoryArtisans] = useState(false);

  const [activeCategory, setActiveCategory] = useState("Phone");

  const [apiArtisans, setApiArtisans] = useState([]);
  const [loadingArtisans, setLoadingArtisans] = useState(false);

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);

  const searchSectionRef = useRef(null);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [animatedCount, setAnimatedCount] = useState(0);

  /* =========================
     HELPER FUNCTIONS
  ========================== */

  const getCategorySlug = (cat) => {
    const map = {
      Phone: "phone",
      Tablet: "tablet",
      Laptop: "laptop repairs",
      "Home Appliances": "home appliances",
    };
    return map[cat] || cat.toLowerCase();
  };

  const getCategoryImage = (cat) => {
    const map = {
      Phone: catImageOne,
      Tablet: catImageTwo,
      Laptop: catImageThree,
      "Home Appliances": catImageFour,
    };
    return map[cat] || catImageOne;
  };



  useEffect(() => {
    const shouldShow = localStorage.getItem("showWelcomeBonus");

    if (shouldShow === "true") {
      setShowWelcomeBonus(true);
      localStorage.removeItem("showWelcomeBonus");
    }
  }, []);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoadingArtisans(true);

        const token = localStorage.getItem("fixserv_token");

        const res = await fetch(
          "https://dev-user-api.fixserv.co/api/admin/getAll?role=ARTISAN",
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

  useEffect(() => {
    const fetchCategoryArtisans = async () => {
      try {
        setLoadingCategoryArtisans(true);

        const token = localStorage.getItem("fixserv_token");
        const categorySlug = getCategorySlug(activeCategory);

        const res = await fetch(
          `/api/category/artisans/category/${encodeURIComponent(categorySlug)}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data?.message || "Failed to fetch category artisans");
        }

        setCategoryArtisans(data.artisans || []);
      } catch (err) {
        console.error("Error fetching category artisans:", err);
        setCategoryArtisans([]);
      } finally {
        setLoadingCategoryArtisans(false);
      }
    };

    fetchCategoryArtisans();
  }, [activeCategory]);

  /* =========================
     SEARCH LOGIC
  ========================== */

const handleSearch = async () => {
  const q = searchQuery.trim();
  if (!q) return;

  setSearchLoading(true);
  setSearchError("");
  setIsSearching(true);

  try {
    const data = await searchServicesAndArtisans({
  keyword: q,
});

    if (!data?.success) {
      throw new Error(data?.message || "Search failed");
    }

    const artisansFromSearch = data?.data?.artisans?.data || [];
    setSearchResults(artisansFromSearch);

    // ✅ If API worked, don't show any fallback message
    setSearchError("");
  } catch (err) {
    console.error("SEARCH ERROR:", err?.response?.data || err?.message);

    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.errors?.[0]?.message?.message || // (in case error is nested)
      err?.response?.data?.errors?.[0] ||
      err?.message;

    // ✅ fallback to local filtering
    const keyword = q.toLowerCase();
    const localFiltered = (apiArtisans || []).filter((a) => {
      const fullName = (a.fullName || "").toLowerCase();
      const businessName = (a.businessName || "").toLowerCase();
      const location = (a.location || a.city || a.state || "").toLowerCase();
      const skillsArr = Array.isArray(a.skills)
        ? a.skills
        : Array.isArray(a.skillSet)
        ? a.skillSet
        : [];
      const skillsText = skillsArr.join(" ").toLowerCase();

      return (
        fullName.includes(keyword) ||
        businessName.includes(keyword) ||
        location.includes(keyword) ||
        skillsText.includes(keyword)
      );
    });

    setSearchResults(localFiltered);

    // ✅ IMPORTANT: show the warning ONLY if fallback also returns nothing
    if (localFiltered.length === 0) {
      setSearchError(apiMsg || "Search service is temporarily unavailable. Try again.");
    } else {
      setSearchError(""); // no scary message if we can show local results
    }
  } finally {
    setSearchLoading(false);
  }
};

useEffect(() => {
  if (isSearching && !searchLoading && searchSectionRef.current) {
    searchSectionRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [isSearching, searchLoading]);


useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery.trim());
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);

useEffect(() => {
  if (debouncedQuery) {
    handleSearch();
  }
}, [debouncedQuery]);

const previousCountRef = useRef(0);


  /* =========================
     DERIVED DATA
  ========================== */

// Always map original artisans for "Top Artisans"
const mappedApiArtisans = (apiArtisans || []).map((artisan) => ({
  id: artisan.id || artisan._id,
  name:
    artisan.fullName ||
    artisan.businessName ||
    "Unnamed Artisan",
  location:
    artisan.location ||
    artisan.city ||
    artisan.state ||
    "Unknown location",
  rating: artisan.rating || 0,
  skills: artisan.skills || artisan.skillSet || [],
  image: johnOne,
  available: true,
}));

// Separate mapping for search results
const mappedSearchResults = (searchResults || []).map((artisan) => ({
  id: artisan.id || artisan._id,
  name:
    artisan.fullName ||
    artisan.businessName ||
    "Unnamed Artisan",
  location:
    artisan.location ||
    artisan.city ||
    artisan.state ||
    "Unknown location",
  rating: artisan.rating || 0,
  skills: artisan.skills || artisan.skillSet || [],
  image: johnOne,
  available: true,
}));


  const filteredArtisans = (categoryArtisans || []).map(
    (artisan, index) => ({
      id: artisan.id || artisan._id || `${index}`,
      name:
        artisan.fullName ||
        artisan.businessName ||
        "Unnamed Artisan",
      category: activeCategory,
      image:
        artisan.profilePicture ||
        getCategoryImage(activeCategory),
      rating: artisan.rating || 0,
      reviews: artisan.reviews || 0,
      available: true,
    })
  );

  useEffect(() => {
  const end = mappedSearchResults.length;

  if (previousCountRef.current === end) return;

  previousCountRef.current = end;

  let start = 0;

  if (end === 0) {
    setAnimatedCount(0);
    return;
  }

  const duration = 400;
  const incrementTime = 20;
  const step = Math.ceil(end / (duration / incrementTime));

  const counter = setInterval(() => {
    start += step;
    if (start >= end) {
      start = end;
      clearInterval(counter);
    }
    setAnimatedCount(start);
  }, incrementTime);

  return () => clearInterval(counter);
}, [mappedSearchResults.length]);


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
onChange={(e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (!value.trim()) {
    setIsSearching(false);
    setSearchResults([]);
    setSearchError("");
  }
}}


      className="w-full py-3 text-sm text-black focus:outline-none"
    />
  </div>

  {/* Button */}
  <button
    type="submit"
    disabled={searchLoading}
    className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-8 text-sm font-medium transition disabled:opacity-60 cursor-pointer"
  >
    {searchLoading ? "Searching..." : "Search"}
  </button>
</form>

{searchError && (
  <p className="text-sm text-yellow-200 mt-3">
    {searchError}
  </p>
)}

        </div>
      </section>

    
{/* SEARCH RESULTS SECTION */}
{isSearching && (
  <section
  ref={searchSectionRef}
  className="w-full py-14 transition-opacity duration-500 ease-in-out opacity-100 animate-fadeIn"
>

    <div className="max-w-7xl mx-auto px-2 md:px-6">

      <div className="flex items-center justify-between mb-6">
  <h2 className="text-lg font-semibold text-black">
    Your Search Results
  </h2>

  {!searchLoading && (
    <span className="text-sm text-gray-500">
      {animatedCount} result{animatedCount !== 1 ? "s" : ""} found
    </span>
  )}
</div>

      {searchLoading && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
      >
        <div className="w-full h-60 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    ))}
  </div>
)}


      {!searchLoading && mappedSearchResults.length === 0 && (
        <p className="text-sm text-gray-500">
          No artisans found for “{searchQuery}”
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mappedSearchResults.map((artisan) => (
          <div
            key={artisan.id}
            className="bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
          >
            <div className="relative">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-full h-60 object-cover rounded-lg"
              />
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
                onClick={() =>
                  navigate(`/client/artisan-profile/${artisan.id}`)
                }
                className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

<section className="w-full py-14 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
    {/* Title */}
    <h2 className="text-lg font-semibold text-black mb-6">
      Top Artisans near you
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

{loadingCategoryArtisans && (
  <p className="text-sm text-gray-500">Loading category artisans...</p>
)}
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