
// import React, { useEffect, useState } from "react";
// import search from "../../../assets/client images/client-home/referal part/search.png";
// import sortIcon from "../../../assets/client images/client-home/referal part/sort.png";
// import johnone from "../../../assets/client images/client-home/referal part/johnone.png";
// import tick from "../../../assets/client images/client-home/referal part/tick.png";
// import yellowstar from "../../../assets/client images/client-home/referal part/yellowstar.png";
// import { getAuthToken } from "../../../utils/auth";
// import { searchServicesAndArtisans } from "../../../api/search.api";
// import { useLocation } from "react-router-dom";




// const Technican = () => {
//   const [sortBy, setSortBy] = useState("Newest");
//   const [page, setPage] = useState(1);
//   const perPage = 4;

//   const [technicians, setTechnicians] = useState([]);
// const [loading, setLoading] = useState(true);

// const locationState = useLocation();
// const selectedCategory = locationState.state?.category;
// const selectedLocation = locationState.state?.location;



// const sorted = [...technicians].sort((a, b) =>
//   sortBy === "Newest"
//     ? new Date(b.date) - new Date(a.date)
//     : new Date(a.date) - new Date(b.date)
// );


//   const totalPages = Math.ceil(sorted.length / perPage);
//   const current = sorted.slice((page - 1) * perPage, page * perPage);

//   const [searchTerm, setSearchTerm] = useState("");
// const [searching, setSearching] = useState(false);

// const handleSearch = async () => {
//   const q = searchTerm.trim();
//   if (!q) return;

//   try {
//     setSearching(true);
//     setLoading(true);
//     setPage(1);

//     const data = await searchServicesAndArtisans({
//       keyword: q,
//     });

//     if (!data?.success) {
//       throw new Error(data?.message || "Search failed");
//     }

//     const artisansFromSearch =
//       data?.data?.artisans?.data || [];

//     const mapped = artisansFromSearch.map((item) => ({
//       id: item.id || item._id,
//       name:
//         item.fullName ||
//         item.businessName ||
//         "Unnamed Artisan",
//       img: item.profilePicture || johnone,
//       date: item.createdAt || new Date().toISOString(),
//       specialty:
//         item.skills?.join(", ") ||
//         item.skillSet?.join(", ") ||
//         item.category ||
//         "Technician",
//       rating: item.rating || 0,
//       reviews: item.reviewsCount || 0,
//     }));

//     setTechnicians(mapped);
//   } catch (err) {
//     console.error("Search error:", err?.message);
//     setTechnicians([]);
//   } finally {
//     setLoading(false);
//     setSearching(false);
//   }
// };

// useEffect(() => {
//   const fetchMatchedArtisans = async () => {
//     try {
//       setLoading(true);

//       const token = getAuthToken();

//       const res = await fetch(
//         "https://dev-user-api.fixserv.co/api/category/artisans/search",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({
//             categories: [selectedCategory],
//             location: selectedLocation,
//             page: 1,
//             limit: 20,
//           }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to fetch artisans");
//       }

//       const mapped = (data?.artisans || []).map((artisan) => ({
//         id: artisan.id,
//         name: artisan.fullName || artisan.businessName,
//         img: artisan.profilePicture || johnone,
//         date: new Date().toISOString(),
//         specialty: artisan.categories?.join(", ") || "Technician",
//         rating: artisan.rating || 0,
//         reviews: 0,
//       }));

//       setTechnicians(mapped);
//     } catch (err) {
//       console.error("Fetch error:", err.message);
//       setTechnicians([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (selectedCategory && selectedLocation) {
//     fetchMatchedArtisans();
//   } else {
//     setLoading(false);
//   }
// }, [selectedCategory, selectedLocation]);



//   return (
//     <div className="max-w-6xl mx-auto p-6">

//       {/* Title */}
//       <div className="text-center mb-10">
//   <h2 className="text-2xl font-semibold">We Found Technicians for You</h2>
//   <p className="text-sm text-gray-500 mt-1">
//     Based on your device and issue, here are verified technicians available to help.
//   </p>
// </div>


//       {/* Search + Sort */}

// <div className="flex items-center justify-center gap-6 mb-10">

//   {/* Search Box */}
//   <div className="flex w-[520px] h-[42px] border border-blue-300 rounded-lg overflow-hidden bg-white">

//     <div className="flex items-center px-3">
//       <img src={search} className="w-4 opacity-60" />
//     </div>

// <input
//   value={searchTerm}
//   onChange={(e) => setSearchTerm(e.target.value)}
//   onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//   className="flex-1 text-sm px-2 outline-none placeholder:text-gray-400"
//   placeholder="Search Technician name, skill or location"
// />


// <button
//   onClick={handleSearch}
//   disabled={searching}
//   className="bg-[#3E83C4] text-white text-sm px-6 font-medium disabled:opacity-60"
// >
//   {searching ? "Searching..." : "Search"}
// </button>

//   </div>

//   {/* Sort Button */}
//   <button
//     onClick={() => setSortBy(sortBy === "Newest" ? "Oldest" : "Newest")}
//     className="flex items-center gap-2 h-[42px] border border-gray-300 px-4 rounded-lg text-sm text-gray-700 bg-white"
//   >
//     <img src={sortIcon} className="w-4 opacity-70" />
//     <span>Sort by</span>
//     <span className="font-medium">{sortBy}</span>
//     <span className="text-gray-400 text-xs mt-[1px]">▾</span>
//   </button>

// </div>


// {/* Cards */}
// {/* Loading */}
// {loading && (
//   <p className="text-center text-sm text-gray-500 mb-6">
//     Loading technicians...
//   </p>
// )}

// {/* Empty state */}
// {!loading && technicians.length === 0 && (
//   <p className="text-center text-sm text-gray-500 mb-6">
//     No technicians found.
//   </p>
// )}

// {/* Cards */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// {current.map((tech) => (
//   <div
//     key={tech.id}
//     className="border border-blue-100 rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm"
//   >

// <div className="relative">
//   <img
//     src={tech.img}
//     className="w-24 h-24 rounded-xl object-cover"
//   />

//   {/* <span className="absolute -top-2 left-2 bg-[#5B61D1] text-white text-[10px] px-2 py-[2px] rounded-full shadow-sm"> */}
//     <span className="absolute -top-2 right-2 bg-[#5B61D1] text-white text-[10px] px-3 py-[2px] rounded-full shadow-sm">

//     Early User
//   </span>
// </div>

//      <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-sm">{tech.name}</p>
//           <img src={tick} className="w-4" />
//         </div>

//         <p className="text-xs text-gray-500">{tech.specialty}</p>

//         <div className="flex items-center gap-1 text-xs mt-1">
//           <img src={yellowstar} className="w-3" />
//           <span>{tech.rating}</span>
//           <span className="text-gray-400">({tech.reviews} reviews)</span>
//         </div>


//         <button className="mt-3 w-full bg-[#3E83C4] text-white py-2 text-xs rounded-md hover:bg-blue-600 transition">

//           View Profile
//         </button>
//       </div>
//     </div>
//   ))}
// </div>

// {/* Pagination + Next Same Row */}
// <div className="flex items-center justify-center gap-4 mt-10">
//   <div className="flex gap-3">
//     {[...Array(totalPages)].map((_, i) => (
//       <button
//         key={i}
//         onClick={() => setPage(i + 1)}
//         className={`w-8 h-8 rounded-md text-sm ${
//           page === i + 1
//             ? "bg-blue-500 text-white"
//             : "border hover:bg-gray-100"
//         }`}
//       >
//         {i + 1}
//       </button>
//     ))}
//   </div>

//   {/* NEXT button beside pagination */}
//   <button
//     disabled={page >= totalPages}
//     onClick={() => page < totalPages && setPage(page + 1)}
//     className="flex items-center gap-2 border px-6 py-2 rounded-md hover:bg-gray-100 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
//   >
//     Next →
//   </button>
// </div>

//     </div>
//   );
// };

// export default Technican;


// new try
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import search from "../../../assets/client images/client-home/referal part/search.png";
import sortIcon from "../../../assets/client images/client-home/referal part/sort.png";
import johnone from "../../../assets/client images/client-home/referal part/johnone.png";
import tick from "../../../assets/client images/client-home/referal part/tick.png";
import yellowstar from "../../../assets/client images/client-home/referal part/yellowstar.png";

import { searchServicesAndArtisans } from "../../../api/search.api";

const normalizeArtisan = (item) => {
  return {
    id: item?.id || item?._id,
    name: item?.fullName || item?.businessName || item?.name || "Unnamed Artisan",
    img: item?.profilePicture || item?.avatar || item?.image || johnone,
    date: item?.createdAt || item?.updatedAt || new Date().toISOString(),
    specialty:
      (Array.isArray(item?.skills) && item.skills.join(", ")) ||
      (Array.isArray(item?.skillSet) && item.skillSet.join(", ")) ||
      item?.category ||
      item?.specialty ||
      "Technician",
    rating: item?.rating ?? 0,
    reviews: item?.reviewsCount ?? item?.reviews ?? 0,

    // keep raw for later "View Profile"
    raw: item,
  };
};

const Technican = () => {
  const location = useLocation();

  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  // ✅ Load matched artisans passed from RequestRepair confirm endpoint
  useEffect(() => {
    const state = location.state || {};
    const artisans = state?.artisans || [];

    // if confirm response has different key, we still try to recover
    const rawConfirm = state?.rawConfirm;
    const fallbackArtisans =
      rawConfirm?.data?.artisans ||
      rawConfirm?.data?.matchedArtisans ||
      rawConfirm?.artisans ||
      rawConfirm?.matchedArtisans ||
      [];

    const finalList = (Array.isArray(artisans) && artisans.length > 0)
      ? artisans
      : (Array.isArray(fallbackArtisans) ? fallbackArtisans : []);

    if (finalList.length > 0) {
      setTechnicians(finalList.map(normalizeArtisan));
    } else {
      setTechnicians([]);
    }

    setLoading(false);
    setPage(1);
  }, [location.state]);

  const sorted = useMemo(() => {
    const arr = [...technicians];
    arr.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortBy === "Newest" ? db - da : da - db;
    });
    return arr;
  }, [technicians, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const current = sorted.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleSearch = async () => {
    const q = searchTerm.trim();
    if (!q) return;

    try {
      setSearching(true);
      setLoading(true);
      setPage(1);

      // Search endpoint (your existing API)
      const data = await searchServicesAndArtisans({
        keyword: q,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Search failed");
      }

      const artisansFromSearch = data?.data?.artisans?.data || data?.data?.artisans || [];

      const mapped = (Array.isArray(artisansFromSearch) ? artisansFromSearch : []).map(
        normalizeArtisan
      );

      setTechnicians(mapped);
    } catch (err) {
      console.error("Search error:", err?.message);
      setTechnicians([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white py-14 mt-4">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold">We Found Technicians for You</h2>
        <p className="text-sm text-gray-500 mt-1">
          Based on your device and issue, here are verified technicians available to help.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center justify-center gap-6 mb-10">
        {/* Search Box */}
        <div className="flex w-[520px] h-[42px] border border-blue-300 rounded-lg overflow-hidden bg-white">
          <div className="flex items-center px-3">
            <img src={search} className="w-4 opacity-60" alt="" />
          </div>

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 text-sm px-2 outline-none placeholder:text-gray-400"
            placeholder="Search technician name, skill or location"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            className="bg-[#3E83C4] text-white text-sm px-6 font-medium disabled:opacity-60"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Sort Button */}
        <button
          type="button"
          onClick={() => setSortBy(sortBy === "Newest" ? "Oldest" : "Newest")}
          className="flex items-center gap-2 h-[42px] border border-gray-300 px-4 rounded-lg text-sm text-gray-700 bg-white"
        >
          <img src={sortIcon} className="w-4 opacity-70" alt="" />
          <span>Sort by</span>
          <span className="font-medium">{sortBy}</span>
          <span className="text-gray-400 text-xs mt-[1px]">▾</span>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-sm text-gray-500 mb-6">
          Loading technicians...
        </p>
      )}

      {/* Empty state */}
      {!loading && technicians.length === 0 && (
        <p className="text-center text-sm text-gray-500 mb-6">
          No matched technicians found for this request.
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {current.map((tech) => (
          <div
            key={tech.id}
            className="border border-blue-100 rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={tech.img}
                className="w-24 h-24 rounded-xl object-cover"
                alt={tech.name}
              />

              <span className="absolute -top-2 right-2 bg-[#5B61D1] text-white text-[10px] px-3 py-[2px] rounded-full shadow-sm">
                Verified
              </span>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{tech.name}</p>
                <img src={tick} className="w-4" alt="" />
              </div>

              <p className="text-xs text-gray-500">{tech.specialty}</p>

              <div className="flex items-center gap-1 text-xs mt-1">
                <img src={yellowstar} className="w-3" alt="" />
                <span>{tech.rating}</span>
                <span className="text-gray-400">({tech.reviews} reviews)</span>
              </div>

              <button
                type="button"
                className="mt-3 w-full bg-[#3E83C4] text-white py-2 text-xs rounded-md hover:bg-blue-600 transition"
                onClick={() => {
                  // later: navigate to artisan profile page
                  console.log("Selected artisan:", tech.raw);
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && technicians.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="flex gap-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-md text-sm ${
                  page === i + 1 ? "bg-blue-500 text-white" : "border hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => page < totalPages && setPage(page + 1)}
            className="flex items-center gap-2 border px-6 py-2 rounded-md hover:bg-gray-100 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Technican;