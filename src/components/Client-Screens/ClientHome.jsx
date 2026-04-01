import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import WelcomeBonus from "./WelcomeBonus";
import ReferEarn from "./ReferEarn";

import bgImage from "../../assets/client images/client-home/clientbg.png";
import bgOverlay from "../../assets/client images/client-home/bgoverlay.png";
import johnOne from "../../assets/client images/client-home/Johnone.png";
import starIcon from "../../assets/client images/client-home/star.png";
import mark from "../../assets/client images/client-home/mark.png";

import catImageOne from "../../assets/client images/client-home/catjoneone.png";
import catImageTwo from "../../assets/client images/client-home/catjohntwo.png";
import catImageThree from "../../assets/client images/client-home/catjohnthree.png";
import catImageFour from "../../assets/client images/client-home/catjohnfour.png";

import bannerBg from "../../assets/client images/client-home/banner.png";
import bannerOverlay from "../../assets/client images/client-home/banner overlay.png";

import { getAllCategories, getArtisansByCategory } from "../../api/category.api";
import { searchServicesAndArtisans } from "../../api/search.api";

const ClientHome = () => {
  const navigate = useNavigate();

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
  const [showReferEarn, setShowReferEarn] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const searchSectionRef = useRef(null);
  const marqueeSectionRef = useRef(null);
  const marqueeOneRef = useRef(null);
  const marqueeTwoRef = useRef(null);

  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [animatedCount, setAnimatedCount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [hoveredTopArtisan, setHoveredTopArtisan] = useState(null);
  const [hoveredNewArtisan, setHoveredNewArtisan] = useState(null);
  const [categories, setCategories] = useState([]);

  const previousCountRef = useRef(0);
  const lastSearchedRef = useRef("");

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const softCardHover = {
    y: -8,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  };

  const buttonTap = {
    scale: 0.97,
  };

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

  useEffect(() => {
    fetchArtisans();

    const interval = setInterval(fetchArtisans, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
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

  const handleSearch = async (forcedQuery) => {
    const q = (forcedQuery ?? searchQuery).trim();

    if (!q) {
      setIsSearching(false);
      setSearchResults([]);
      setSearchError("");
      return;
    }

    if (lastSearchedRef.current === q) return;
    lastSearchedRef.current = q;

    setSearchLoading(true);
    setSearchError("");
    setIsSearching(true);

    try {
      let artisansFromSearch = [];

      if (q.length >= 2) {
        const data = await searchServicesAndArtisans({ keyword: q });

        if (data?.success) {
          artisansFromSearch = data?.data?.artisans?.data || [];
        } else {
          throw new Error(data?.message || "Search failed");
        }
      }

      if (!artisansFromSearch.length) {
        const keyword = q.toLowerCase();

        artisansFromSearch = (apiArtisans || []).filter((a) => {
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
      }

      setSearchResults(artisansFromSearch);
      setSearchError("");
    } catch (err) {
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

      if (localFiltered.length === 0) {
        setSearchError("No artisans found.");
      } else {
        setSearchError("");
      }
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
    if (!debouncedQuery) return;

    if (debouncedQuery.length < 2) {
      lastSearchedRef.current = "";
      return;
    }

    handleSearch(debouncedQuery);
  }, [debouncedQuery, apiArtisans]);

  useEffect(() => {
    if (isSearching && !searchLoading && searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isSearching, searchLoading]);

  const userId = user?.id || user?._id;
  const ONBOARDING_KEY = userId ? `fixserv_onboarding_step_${userId}` : null;

  useEffect(() => {
    if (!userId || !ONBOARDING_KEY) return;

    const step = localStorage.getItem(ONBOARDING_KEY);

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
      const resolvedUserId = user?.id || user?._id;
      const token = localStorage.getItem("fixserv_token");
      if (!resolvedUserId || !token) return;

      try {
        const res = await fetch(
          `https://dev-wallet-api.fixserv.co/api/wallet/referral/info/${resolvedUserId}`,
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
    location:
      artisan.location || artisan.city || artisan.state || "Unknown location",
    rating: artisan.rating || 0,
    skills: artisan.skills || artisan.skillSet || [],
    image: artisan.profilePicture || artisan.profileImage || johnOne,
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
    location:
      artisan.location || artisan.city || artisan.state || "Unknown location",
    rating: artisan.rating || 0,
    skills: artisan.skills || artisan.skillSet || [],
    image: artisan.profilePicture || artisan.profileImage || johnOne,
    available: true,
  }));

  const mappedSearchResults = (searchResults || []).map((artisan) => ({
    id: artisan.id || artisan._id,
    name: artisan.fullName || artisan.businessName || "Unnamed Artisan",
    location:
      artisan.location || artisan.city || artisan.state || "Unknown location",
    rating: artisan.rating || 0,
    skills: artisan.skills || artisan.skillSet || [],
    image: artisan.profilePicture || artisan.profileImage || johnOne,
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

  const enableManualScroll = (ref, speed = 0.35) => {
    if (!ref.current) return;

    const el = ref.current;

    requestAnimationFrame(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        el.scrollLeft = maxScroll / 2;
      }
    });

    let isPointerDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let velocity = 0;
    let momentumId = null;
    let autoScrollId = null;
    let lastX = 0;
    let lastTime = 0;
    let isHovered = false;

    const stopMomentum = () => {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    };

    const getMaxScroll = () => {
      return Math.max(0, el.scrollWidth - el.clientWidth);
    };

    const normalizeInfiniteScroll = () => {
      const maxScroll = getMaxScroll();
      if (maxScroll <= 0) return;

      const half = maxScroll / 2;

      if (el.scrollLeft >= half * 1.5) {
        el.scrollLeft -= half;
      } else if (el.scrollLeft <= half * 0.5) {
        el.scrollLeft += half;
      }
    };

    const runMomentum = () => {
      stopMomentum();

      const step = () => {
        if (Math.abs(velocity) < 0.1) {
          velocity = 0;
          return;
        }

        el.scrollLeft -= velocity;
        normalizeInfiniteScroll();

        velocity *= 0.95;
        momentumId = requestAnimationFrame(step);
      };

      momentumId = requestAnimationFrame(step);
    };

    const autoScroll = () => {
      if (isPointerDown || isHovered) {
        autoScrollId = requestAnimationFrame(autoScroll);
        return;
      }

      el.scrollLeft += speed;
      normalizeInfiniteScroll();
      autoScrollId = requestAnimationFrame(autoScroll);
    };

    const pointerDown = (clientX) => {
      isPointerDown = true;
      stopMomentum();
      startX = clientX;
      startScrollLeft = el.scrollLeft;
      lastX = clientX;
      lastTime = Date.now();
      velocity = 0;
      el.style.cursor = "grabbing";
      el.style.scrollBehavior = "auto";
    };

    const pointerMove = (clientX) => {
      if (!isPointerDown) return;

      const walk = clientX - startX;
      el.scrollLeft = startScrollLeft - walk;

      const now = Date.now();
      const dx = clientX - lastX;
      const dt = now - lastTime || 1;

      velocity = (dx / dt) * 12;

      lastX = clientX;
      lastTime = now;

      normalizeInfiniteScroll();
    };

    const pointerUp = () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      el.style.cursor = "grab";
      runMomentum();
    };

    const onMouseDown = (e) => pointerDown(e.pageX - el.offsetLeft);

    const onMouseMove = (e) => {
      if (!isPointerDown) return;
      e.preventDefault();
      pointerMove(e.pageX - el.offsetLeft);
    };

    const onTouchStart = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      pointerDown(touch.pageX - el.offsetLeft);
    };

    const onTouchMove = (e) => {
      const touch = e.touches?.[0];
      if (!touch) return;
      pointerMove(touch.pageX - el.offsetLeft);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
      } else {
        el.scrollLeft += e.deltaX;
      }
      normalizeInfiniteScroll();
    };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
      pointerUp();
    };

    el.style.cursor = "grab";

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", pointerUp);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", pointerUp);
    el.addEventListener("wheel", onWheel, { passive: true });

    autoScrollId = requestAnimationFrame(autoScroll);

    return () => {
      stopMomentum();
      if (autoScrollId) cancelAnimationFrame(autoScrollId);

      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", pointerUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", pointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  };

  useEffect(() => {
    const cleanupOne = enableManualScroll(marqueeOneRef, 0.35);
    const cleanupTwo = enableManualScroll(marqueeTwoRef, 0.32);

    return () => {
      cleanupOne && cleanupOne();
      cleanupTwo && cleanupTwo();
    };
  }, [mappedApiArtisans.length, mappedNewArtisans.length]);

  return (
    <div className="w-full overflow-x-hidden">
      <motion.section
        className="relative w-full h-[420px] flex items-center justify-center mt-4 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.img
          src={bgImage}
          alt="Client background"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.img
          src={bgOverlay}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
        />

        <motion.div
          className="relative z-10 w-full max-w-4xl px-6 text-center text-white"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl font-semibold mb-3"
          >
            Hi {firstName || "there"}, What are you fixing today?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base text-[#D9D9D9] mb-8"
          >
            Connect with skilled and trusted professionals in minutes.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={(e) => {
              e.preventDefault();
              lastSearchedRef.current = "";
              handleSearch(searchQuery);
            }}
            className="flex w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg"
          >
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
                    lastSearchedRef.current = "";
                    setIsSearching(false);
                    setSearchResults([]);
                    setSearchError("");
                  }
                }}
                className="w-full py-3 text-sm text-black focus:outline-none"
              />
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={buttonTap}
              type="submit"
              disabled={searchLoading}
              className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-8 text-sm font-medium transition disabled:opacity-60 cursor-pointer"
            >
              {searchLoading ? "Searching..." : "Search"}
            </motion.button>
          </motion.form>

          {searchError && (
            <p className="text-sm text-yellow-200 mt-3">{searchError}</p>
          )}
        </motion.div>
      </motion.section>

      <AnimatePresence>
        {isSearching && (
          <motion.section
            ref={searchSectionRef}
            className="w-full py-14"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
                      <div className="w-full h-60 bg-gray-200 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              )}

              {!searchLoading && mappedSearchResults.length === 0 && (
                <p className="text-sm text-gray-500">
                  No artisans found for “{searchQuery}”
                </p>
              )}

              {!searchLoading && mappedSearchResults.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  {mappedSearchResults.map((artisan) => (
                    <motion.div
                      key={artisan.id}
                      variants={fadeUp}
                      whileHover={softCardHover}
                      className="bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm"
                    >
                      <div className="relative">
                        <img
                          src={artisan.image}
                          alt={artisan.name}
                          className="w-full h-60 object-cover object-top rounded-lg"
                          onDragStart={(e) => e.preventDefault()}
                          onError={(e) => {
                            e.currentTarget.src = johnOne;
                          }}
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
                          <img
                            src={starIcon}
                            alt="star"
                            className="w-4 h-4"
                          />
                          <span className="font-medium text-black">
                            {artisan.rating}
                          </span>
                        </div>

                        <div className="flex gap-2 mb-4 flex-wrap">
                          {artisan.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="text-xs text-[#3E83C4] bg-[#C1DAF3] px-2 py-1 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ y: -2, scale: 1.01 }}
                          whileTap={buttonTap}
                          onClick={() =>
                            navigate(`/client/artisan-profile/${artisan.id}`)
                          }
                          className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition"
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.section
        ref={marqueeSectionRef}
        className="w-full py-14 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <motion.h2
            className="text-lg font-semibold text-black mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            Top Artisans near you
          </motion.h2>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

            <div
              ref={marqueeOneRef}
              className="relative w-full overflow-x-auto overflow-y-hidden cursor-grab select-none [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              <div className="flex min-w-[200%] gap-8">
                {[...Array(2)].map((_, loopIndex) => (
                  <React.Fragment key={loopIndex}>
                    {loadingArtisans ? (
                      <div className="flex gap-8">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm animate-pulse"
                          >
                            <div className="w-full h-60 bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="flex gap-2 mb-4">
                              <div className="h-6 w-16 bg-gray-200 rounded-md" />
                              <div className="h-6 w-16 bg-gray-200 rounded-md" />
                            </div>
                            <div className="h-10 bg-gray-200 rounded-md" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      mappedApiArtisans.slice(0, 6).map((artisan) => (
                        <motion.div
                          key={`${loopIndex}-${artisan.id}`}
                          onMouseEnter={() => setHoveredTopArtisan(artisan.id)}
                          onMouseLeave={() => setHoveredTopArtisan(null)}
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.25 }}
                          className={`min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            hoveredTopArtisan &&
                            hoveredTopArtisan !== artisan.id
                              ? "opacity-30 grayscale"
                              : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={artisan.image}
                              alt={artisan.name}
                              className="w-full h-60 object-cover rounded-lg"
                              onDragStart={(e) => e.preventDefault()}
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
                                <img
                                  src={mark}
                                  alt="verified"
                                  className="w-4 h-4"
                                />
                              </div>

                              <span className="text-xs text-[#43A047] bg-[#C9E8CA] px-2 py-0.5 rounded-full">
                                Available
                              </span>
                            </div>

                            <p className="text-sm text-[#535353] mb-2">
                              {artisan.location}
                            </p>

                            <div className="flex items-center gap-1 text-sm mb-3">
                              <img
                                src={starIcon}
                                alt="star"
                                className="w-4 h-4"
                              />
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

                            <motion.button
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={buttonTap}
                              onClick={() =>
                                navigate(`/client/artisan-profile/${artisan.id}`)
                              }
                              className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition"
                            >
                              View Profile
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-14 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <motion.h2
            className="text-lg font-semibold text-black mb-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            New on Fixserv
          </motion.h2>

          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

            <div
              ref={marqueeTwoRef}
              className="relative w-full overflow-x-auto overflow-y-hidden cursor-grab select-none [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              <div className="flex min-w-[200%] gap-8">
                {[...Array(2)].map((_, loopIndex) => (
                  <React.Fragment key={loopIndex}>
                    {loadingArtisans ? (
                      <div className="flex gap-8">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm animate-pulse"
                          >
                            <div className="w-full h-60 bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="flex gap-2 mb-4">
                              <div className="h-6 w-16 bg-gray-200 rounded-md" />
                              <div className="h-6 w-16 bg-gray-200 rounded-md" />
                            </div>
                            <div className="h-10 bg-gray-200 rounded-md" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      mappedNewArtisans.map((artisan) => (
                        <motion.div
                          key={`${loopIndex}-${artisan.id}`}
                          onMouseEnter={() => setHoveredNewArtisan(artisan.id)}
                          onMouseLeave={() => setHoveredNewArtisan(null)}
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.25 }}
                          className={`min-w-[320px] bg-white border border-[#3E83C4] rounded-xl p-4 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg ${
                            hoveredNewArtisan &&
                            hoveredNewArtisan !== artisan.id
                              ? "opacity-30 grayscale"
                              : ""
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={artisan.image}
                              alt={artisan.name}
                              className="w-full h-60 object-cover rounded-lg"
                              onDragStart={(e) => e.preventDefault()}
                              onError={(e) => {
                                e.currentTarget.src = johnOne;
                              }}
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
                                <img
                                  src={mark}
                                  alt="verified"
                                  className="w-4 h-4"
                                />
                              </div>

                              <span className="text-xs text-[#43A047] bg-[#C9E8CA] px-2 py-0.5 rounded-full">
                                Available
                              </span>
                            </div>

                            <p className="text-sm text-[#535353] mb-2">
                              {artisan.location}
                            </p>

                            <div className="flex items-center gap-1 text-sm mb-3">
                              <img
                                src={starIcon}
                                alt="star"
                                className="w-4 h-4"
                              />
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

                            <motion.button
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={buttonTap}
                              onClick={() =>
                                navigate(`/client/artisan-profile/${artisan.id}`)
                              }
                              className="w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white text-sm py-2 rounded-md transition"
                            >
                              View Profile
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-14 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <p className="text-sm font-medium text-black mb-3">By Category:</p>

          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ y: -2 }}
                whileTap={buttonTap}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  activeCategory === cat
                    ? "bg-[#3E83C4] text-white"
                    : "bg-[#B3B3B3] text-[#656565] hover:bg-gray-400"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="relative w-full mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {loadingCategoryArtisans && (
                <p className="text-sm text-gray-500">
                  Loading category artisans...
                </p>
              )}

              {!loadingCategoryArtisans &&
                activeCategory &&
                filteredArtisans.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No artisans found for {activeCategory}.
                  </p>
                )}

              {paginatedCategoryArtisans.map((artisan) => (
                <motion.div
                  key={artisan.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
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

                    <div className="flex items-center justify-between mt-6 text-sm text-black">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{artisan.rating}</span>
                        <span className="whitespace-nowrap">
                          ({artisan.reviews} reviews)
                        </span>
                      </div>

                      {artisan.available && (
                        <span className="bg-[#C9E8CA] text-[#43A047] px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap">
                          Available
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={buttonTap}
                      onClick={() =>
                        navigate(`/client/artisan-profile/${artisan.id}`)
                      }
                      className="mt-2 w-full bg-[#3E83C4] hover:bg-[#2d75b8] text-white py-2 rounded-md text-sm font-medium transition cursor-pointer"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {!loadingCategoryArtisans &&
            filteredArtisans.length > CATEGORY_PAGE_SIZE && (
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

                {Array.from(
                  { length: totalCategoryPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <motion.button
                    key={page}
                    whileHover={{ y: -2 }}
                    whileTap={buttonTap}
                    onClick={() => setCategoryPage(page)}
                    className={`w-10 h-10 rounded-md text-sm font-medium transition ${
                      categoryPage === page
                        ? "bg-[#3E83C4] text-white"
                        : "bg-[#EAF4FF] text-[#3E83C4] hover:bg-[#d7ebff] cursor-pointer"
                    }`}
                  >
                    {page}
                  </motion.button>
                ))}

                <button
                  onClick={() =>
                    setCategoryPage((prev) =>
                      Math.min(prev + 1, totalCategoryPages)
                    )
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
      </motion.section>

      <motion.section
        className="relative w-full flex items-center justify-center mt-4 mb-8 py-14 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
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
            <motion.button
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={buttonTap}
              onClick={() => setShowChatModal(true)}
              className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-7 py-3 rounded-md font-medium transition cursor-pointer"
            >
              Chat With Us
            </motion.button>
          </div>
        </div>
      </motion.section>

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

      <AnimatePresence>
        {showChatModal && (
          <motion.div
            onClick={() => setShowChatModal(false)}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-8 w-[100%] max-w-md text-center shadow-xl"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-13 h-13 border-4 border-[#3E83C4] border-t-transparent rounded-full animate-spin" />
              </div>

              <h2 className="text-2xl font-semibold text-black mb-2">
                Chat! ...Coming Soon 💬
              </h2>

              <p className="text-sm text-gray-500 mb-6">
                We're currently working on our chat feature to give you the best
                experience. Please try again shortly.
              </p>

              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={buttonTap}
                onClick={() => setShowChatModal(false)}
                className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-6 py-2 rounded-md text-lg cursor-pointer"
              >
                Please try again Later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientHome;