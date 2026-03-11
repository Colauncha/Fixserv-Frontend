import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WelcomeBonus from "./WelcomeBonus";
import ReferEarn from "./ReferEarn"; 


import bgImage from "../../assets/client images/client-home/clientbg.png";
import bgOverlay from "../../assets/client images/client-home/bgoverlay.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import johnTwo from "../../assets/client images/client-home/johntwo.png";
import johnThree from "../../assets/client images/client-home/Johnthree.png";
import starIcon from "../../assets/client images/client-home/star.png";
import mark from "../../assets/client images/client-home/mark.png";


import catImageOne from "../../assets/client images/client-home/catjoneone.png";
import catImageTwo from "../../assets/client images/client-home/catjohntwo.png";
import catImageThree from "../../assets/client images/client-home/catjohnthree.png";
import catImageFour from "../../assets/client images/client-home/catjohnfour.png";
import catImageFive from "../../assets/client images/client-home/catjohnfive.png";
import catImageSix from "../../assets/client images/client-home/catjohnsix.png";

import bannerBg from "../../assets/client images/client-home/banner.png";
import bannerOverlay from "../../assets/client images/client-home/banner overlay.png";

import { getAllCategories, getArtisansByCategory } from "../../api/category.api";

import walletIcon from "../../assets/client images/client-home/wallet.png";
import coin from "../../assets/client images/client-home/Fixcoin.png"

import { searchServicesAndArtisans } from "../../api/search.api";

const ClientHome = () => {
  const navigate = useNavigate();

  /* =========================
     USER & STATE
  ========================== */

  const storedUser = localStorage.getItem("fixserv_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const firstName = user?.fullName?.split(" ")[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [categoryArtisans, setCategoryArtisans] = useState([]);
  const [loadingCategoryArtisans, setLoadingCategoryArtisans] = useState(false);

const [activeCategory, setActiveCategory] = useState("");

  const [categoryPage, setCategoryPage] = useState(1);
  const CATEGORY_PAGE_SIZE = 6;

  const [apiArtisans, setApiArtisans] = useState([]);
  const [loadingArtisans, setLoadingArtisans] = useState(false);

  const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
  const [showReferEarn, setShowReferEarn] = useState(false); // <-- State for referral modal

  const searchSectionRef = useRef(null);
  const marqueeSectionRef = useRef(null);

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [animatedCount, setAnimatedCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
const [hoveredTopArtisan, setHoveredTopArtisan] = useState(null);
const [hoveredNewArtisan, setHoveredNewArtisan] = useState(null);



  const previousCountRef = useRef(0);

  const [categories, setCategories] = useState([]);

  /* =========================
     HELPERS
  ========================== */

  const normalizeCategoryLabel = (value) => {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ");
  };

const getCategoryImage = (cat) => {
  const value = String(cat || "").trim().toUpperCase();

  const map = {
    PHONE: catImageOne,
    PHONES: catImageOne,
    TABLET: catImageTwo,
    TABLETS: catImageTwo,
    LAPTOP: catImageThree,
    "LAPTOP REPAIRS": catImageThree,
    "HOME APPLIANCES": catImageFour,
  };

  return map[value] || catImageOne;
};

  const fetchArtisans = async () => {
  const token = localStorage.getItem("fixserv_token");

  try {
    setLoadingArtisans(true);

    const res = await fetch(
      "https://dev-user-api.fixserv.co/api/admin/getAll?role=ARTISAN",
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to fetch artisans");

    setApiArtisans(data.users || []);
  } catch (err) {
    console.error("Error fetching artisans:", err);
  } finally {
    setLoadingArtisans(false);
  }
};

  /* =========================
     FETCH ARTISANS
  ========================== */
useEffect(() => {
  fetchArtisans();

  const interval = setInterval(fetchArtisans, 30000); // refresh every 30s
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      console.log("CATEGORIES FROM BACKEND =>", data);

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch categories");
      }

      const cleanedCategories = Array.from(
        new Set(
          (data?.categories || [])
            .map((item) => normalizeCategoryLabel(item))
            .filter(Boolean)
        )
      );

      setCategories(cleanedCategories);

      setActiveCategory((prev) => {
        if (prev && cleanedCategories.includes(prev)) return prev;
        return cleanedCategories[0] || "";
      });
    } catch (err) {
      console.error(
        "Error fetching categories:",
        err?.response?.data || err?.message
      );
      setCategories([]);
      setActiveCategory("");
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const fetchCategoryArtisans = async () => {
    try {
      if (!activeCategory) {
        setCategoryArtisans([]);
        return;
      }

      setLoadingCategoryArtisans(true);

      const data = await getArtisansByCategory({
        category: activeCategory,
        page: 1,
        limit: 10,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to fetch category artisans");
      }

      setCategoryArtisans(data?.artisans || []);
    } catch (err) {
      console.error(
        "Error fetching category artisans:",
        err?.response?.data || err?.message
      );
      setCategoryArtisans([]);
    } finally {
      setLoadingCategoryArtisans(false);
    }
  };

  fetchCategoryArtisans();
}, [activeCategory]);

  useEffect(() => {
    setCategoryPage(1);
  }, [activeCategory]);


  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    setSearchLoading(true);
    setSearchError("");
    setIsSearching(true);

    try {
      const data = await searchServicesAndArtisans({ keyword: q });
      if (!data?.success) throw new Error(data?.message || "Search failed");

      const artisansFromSearch = data?.data?.artisans?.data || [];
      setSearchResults(artisansFromSearch);
      setSearchError("");
    } catch (err) {
      console.error("SEARCH ERROR:", err?.response?.data || err?.message);

      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        err?.message;

      // fallback to local filtering
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
      if (localFiltered.length === 0) setSearchError(apiMsg || "Search service is temporarily unavailable. Try again.");
      else setSearchError("");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) handleSearch();
  }, [debouncedQuery]);

  useEffect(() => {
    if (isSearching && !searchLoading && searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isSearching, searchLoading]);


  const userId = user?.id || user?._id;

  const ONBOARDING_KEY = userId ? `fixserv_onboarding_step_${userId}` : null;


  useEffect(() => {
    if (!userId || !ONBOARDING_KEY) return;

    const step = localStorage.getItem(ONBOARDING_KEY);

    // First time this user is landing on ClientHome
    if (!step) {
      localStorage.setItem(ONBOARDING_KEY, "welcome");
      setShowWelcomeBonus(true);
      setShowReferEarn(false);
      return;
    }

    if (step === "welcome") {
      setShowWelcomeBonus(true);
      setShowReferEarn(false);
      return;
    }

    if (step === "refer") {
      setShowWelcomeBonus(false);
      setShowReferEarn(true);
      return;
    }

    setShowWelcomeBonus(false);
    setShowReferEarn(false);
  }, [userId, ONBOARDING_KEY]);

useEffect(() => {
  const fetchReferralCode = async () => {
    const userId = user?.id || user?._id;
    const token = localStorage.getItem("fixserv_token");
    if (!userId || !token) return;

    try {
      const res = await fetch(
        `https://dev-wallet-api.fixserv.co/api/wallet/referral/info/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data?.success) {
        setReferralCode(data?.data?.myReferralCode || "");
      } else {
        setReferralCode("");
      }
    } catch (err) {
      console.error("Failed to fetch referral code:", err);
      setReferralCode("");
    }
  };

  fetchReferralCode();
}, [user?.id, user?._id]);


const mappedApiArtisans = (apiArtisans || []).map((artisan) => ({
  id: artisan.id || artisan._id,
  name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
  location: artisan.location || artisan.city || artisan.state || "Unknown location",
  rating: artisan.rating || 0,
  skills: artisan.skills || artisan.skillSet || [],
  image:
    artisan.profilePicture ||
    artisan.profileImage ||
    johnOne, 
  available: true,
}));
  
  const getNewest = (list = [], count = 6) => {
  const sorted = [...list].sort((a, b) => {
    const aDate = new Date(a?.createdAt || a?.updatedAt || 0).getTime();
    const bDate = new Date(b?.createdAt || b?.updatedAt || 0).getTime();
    return bDate - aDate;
  });

  return sorted.slice(0, count);
};

const newestApiArtisans = getNewest(apiArtisans || [], 6);

const mappedNewArtisans = newestApiArtisans.map((artisan) => ({
  id: artisan.id || artisan._id,
  name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
  location: artisan.location || artisan.city || artisan.state || "Unknown location",
  rating: artisan.rating || 0,
  skills: artisan.skills || artisan.skillSet || [],
  image: artisan.profilePicture || artisan.profileImage || johnOne,
  available: true,
}));

  const mappedSearchResults = (searchResults || []).map((artisan) => ({
    id: artisan.id || artisan._id,
    name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
    location: artisan.location || artisan.city || artisan.state || "Unknown location",
    rating: artisan.rating || 0,
    skills: artisan.skills || artisan.skillSet || [],
    image: johnOne,
    available: true,
  }));

  const filteredArtisans = (categoryArtisans || []).map((artisan, index) => ({
    id: artisan.id || artisan._id || `${index}`,
    name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
    category: activeCategory,
    image: artisan.profilePicture || getCategoryImage(activeCategory),
    rating: artisan.rating || 0,
    reviews: artisan.reviews || 0,
    available: true,
  }));

    const totalCategoryPages = Math.max(
    1,
    Math.ceil(filteredArtisans.length / CATEGORY_PAGE_SIZE)
  );

  const paginatedCategoryArtisans = filteredArtisans.slice(
    (categoryPage - 1) * CATEGORY_PAGE_SIZE,
    categoryPage * CATEGORY_PAGE_SIZE
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

      <section className="relative w-full h-[420px] flex items-center justify-center mt-4">
        <img src={bgImage} alt="Client background" className="absolute inset-0 w-full h-full object-cover" />
        <img src={bgOverlay} alt="" className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 w-full max-w-4xl px-6 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Hi {firstName || "there"}, What are you fixing today?
          </h1>
          <p className="text-sm md:text-base text-[#D9D9D9] mb-8">
            Connect with skilled and trusted professionals in minutes.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <div className="flex items-center flex-1 px-4">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
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

            <button type="submit" disabled={searchLoading} className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-8 text-sm font-medium transition disabled:opacity-60 cursor-pointer">
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError && <p className="text-sm text-yellow-200 mt-3">{searchError}</p>}
        </div>
      </section>


      {isSearching && (
        <section ref={searchSectionRef} className="w-full py-14 transition-opacity duration-500 ease-in-out opacity-100 animate-fadeIn">
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


<section ref={marqueeSectionRef} className="w-full py-14 overflow-hidden">
  <div className="max-w-7xl mx-auto px-2 md:px-6">
    {/* Title */}
    <h2 className="text-lg font-semibold text-black mb-6">
      Top Artisans near you
    </h2>


    <div className="relative w-full overflow-hidden">
<div className="flex min-w-[200%] gap-8 marquee-one">


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
onMouseEnter={() => setHoveredTopArtisan(artisan.id)}
onMouseLeave={() => setHoveredTopArtisan(null)}
  className={`min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm transition-all duration-300 cursor-pointer ${
    hoveredTopArtisan && hoveredTopArtisan !== artisan.id
 ? "opacity-30 grayscale" : ""
  }`}
>

            <div className="relative">
              <img
  src={artisan.image}
  alt={artisan.name}
  className="w-full h-60 object-cover rounded-lg"
  onError={(e) => {
    e.currentTarget.src = johnOne;
  }}
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


    <div className="relative w-full overflow-hidden">
      <div className="flex min-w-[200%] gap-8 marquee-two">

        {[...Array(2)].map((_, loopIndex) => (
          <React.Fragment key={loopIndex}>
            {loadingArtisans ? (
              <p className="text-sm text-gray-500 px-4">
                Loading artisans...
              </p>
            ) : (
              mappedNewArtisans.map((artisan) => (
                <div
  key={`${loopIndex}-${artisan.id}`}
onMouseEnter={() => setHoveredNewArtisan(artisan.id)}
onMouseLeave={() => setHoveredNewArtisan(null)}
  className={`min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm transition-all duration-300 cursor-pointer ${
    hoveredNewArtisan && hoveredNewArtisan !== artisan.id
 ? "opacity-30 grayscale" : ""
  }`}
>

                  <div className="relative">
                    <img
                      src={artisan.image}
                      alt={artisan.name}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <span className="absolute top-3 right-3 bg-[#3E83C4] text-white text-xs px-2 py-1 rounded-full">
                      New
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

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {(artisan.skills || [])
                        .slice(0, 3)
                        .map((skill, i) => (
                          <span
                            key={`${skill}-${i}`}
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

    <div className="relative w-full mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

{loadingCategoryArtisans && (
  <p className="text-sm text-gray-500">Loading category artisans...</p>
)}

{!loadingCategoryArtisans && activeCategory && filteredArtisans.length === 0 && (
  <p className="text-sm text-gray-500">
    No artisans found for {activeCategory}.
  </p>
)}
                {paginatedCategoryArtisans.map((artisan) => (
          <div
            key={artisan.id}
            className="border border-[#c9d9e8] rounded-xl p-4 flex gap-4 items-center"
          >
           
            <div className="relative">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-70 h-45 rounded-xl object-cover"
              />

            
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
  {activeCategory || "Service Provider"}
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

      {!loadingCategoryArtisans && filteredArtisans.length > CATEGORY_PAGE_SIZE && (
        <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
          <button
            onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
            disabled={categoryPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
              categoryPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-[#3E83C4] border-[#3E83C4] hover:bg-[#3E83C4] hover:text-white cursor-pointer"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalCategoryPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCategoryPage(page)}
              className={`w-10 h-10 rounded-md text-sm font-medium transition ${
                categoryPage === page
                  ? "bg-[#3E83C4] text-white"
                  : "bg-[#EAF4FF] text-[#3E83C4] hover:bg-[#d7ebff] cursor-pointer"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCategoryPage((prev) => Math.min(prev + 1, totalCategoryPages))
            }
            disabled={categoryPage === totalCategoryPages}
            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
              categoryPage === totalCategoryPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-[#3E83C4] border-[#3E83C4] hover:bg-[#3E83C4] hover:text-white cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      )}  
  
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
      {/* <button onClick={() => navigate("/chat-with-us")} className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-7 py-3 rounded-md font-medium transition cursor-pointer">
        Chat With Us
      </button> */}
    </div>
  </div>
</section>

            {showWelcomeBonus && (
  <WelcomeBonus
    onClose={() => {

      setShowWelcomeBonus(false);
    }}
    onClaim={() => {
      if (ONBOARDING_KEY) localStorage.setItem(ONBOARDING_KEY, "refer");
      setShowWelcomeBonus(false);
      setShowReferEarn(true);
    }}
  />
)}

{showReferEarn && (
  <ReferEarn
    onClose={() => {
      if (ONBOARDING_KEY) localStorage.setItem(ONBOARDING_KEY, "done");
      setShowReferEarn(false);
    }}
    referralCode={referralCode}
  />
)}
      <div className="fixed bottom-4 right-4 z-[999999] bg-black text-white text-xs p-2 rounded">
  welcome:{String(showWelcomeBonus)} refer:{String(showReferEarn)}
</div>
    </div>
  );
};

export default ClientHome;
