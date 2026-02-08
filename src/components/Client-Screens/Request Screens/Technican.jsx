// import React, { useState } from "react";
// import search from "../../../assets/client images/client-home/referal part/search.png";
// import sortIcon from "../../../assets/client images/client-home/referal part/sort.png";
// import johnone from "../../../assets/client images/client-home/referal part/johnone.png";
// import johntwo from "../../../assets/client images/client-home/referal part/johntwo.png";
// import johnthree from "../../../assets/client images/client-home/referal part/johnthree.png";
// import johnfour from "../../../assets/client images/client-home/referal part/johnfour.png";
// import johnfive from "../../../assets/client images/client-home/referal part/johnfive.png";
// import johnsix from "../../../assets/client images/client-home/referal part/johnsix.png";
// import tick from "../../../assets/client images/client-home/referal part/tick.png";
// import yellowstar from "../../../assets/client images/client-home/referal part/yellowstar.png";

// // const techniciansData = [
// //   { id: 1, name: "John Adewale", img: johnone, date: "2025-07-01" },
// //   { id: 2, name: "John Adewale", img: johntwo, date: "2025-07-02" },
// //   { id: 3, name: "John Adewale", img: johnthree, date: "2025-07-03" },
// //   { id: 4, name: "John Adewale", img: johnfour, date: "2025-07-04" },
// //   { id: 5, name: "John Adewale", img: johnfive, date: "2025-07-05" },
// //   { id: 6, name: "John Adewale", img: johnsix, date: "2025-07-06" },
// // ];

// const techniciansData = GET /api/admin/getAll?role=ARTISAN;


// const Technican = () => {
//   const [sortBy, setSortBy] = useState("Newest");
//   const [page, setPage] = useState(1);
//   const perPage = 4;

//   const sorted = [...techniciansData].sort((a, b) =>
//     sortBy === "Newest"
//       ? new Date(b.date) - new Date(a.date)
//       : new Date(a.date) - new Date(b.date)
//   );

//   const totalPages = Math.ceil(sorted.length / perPage);
//   const current = sorted.slice((page - 1) * perPage, page * perPage);

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
// {/* <div className="flex items-center justify-between mb-8 gap-4">
//   <div className="flex items-center border rounded-md overflow-hidden w-full max-w-lg">
//     <div className="px-3">
//       <img src={search} className="w-4" />
//     </div>
//     <input
//       className="flex-1 py-2 px-2 text-sm outline-none"
//       placeholder="Search Technician name and Specialty"
//     />
//     <button className="bg-[#3E83C4] text-white px-6 py-2 text-sm">
//       Search
//     </button>
//   </div>

  
//   <button
//   onClick={() => setSortBy(sortBy === "Newest" ? "Oldest" : "Newest")}
//   className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm text-gray-700 bg-white"
// >
//   <img src={sortIcon} className="w-4" />
//   <span>Sort by</span>
//   <span className="font-medium">{sortBy}</span>
//   <span className="ml-1 text-gray-400 text-xs">▾</span>
// </button>

// </div> */}
// <div className="flex items-center justify-center gap-6 mb-10">

//   {/* Search Box */}
//   <div className="flex w-[520px] h-[42px] border border-blue-300 rounded-lg overflow-hidden bg-white">

//     <div className="flex items-center px-3">
//       <img src={search} className="w-4 opacity-60" />
//     </div>

//     <input
//       className="flex-1 text-sm px-2 outline-none placeholder:text-gray-400"
//       placeholder="Search Technician name and Specialty"
//     />

//     <button className="bg-[#3E83C4] text-white text-sm px-6 font-medium">
//       Search
//     </button>
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
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//   {current.map((tech) => (

//         <div className="border border-blue-100 rounded-xl p-4 flex gap-4 items-center bg-white shadow-sm">



      
     
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



//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <p className="font-semibold text-sm">John Adewale</p>
//           <img src={tick} className="w-4" />
//         </div>

//         <p className="text-xs text-gray-500">Electronics Technicians</p>

//         <div className="flex items-center gap-1 text-xs mt-1">
//           <img src={yellowstar} className="w-3" />
//           <span>4.7</span>
//           <span className="text-gray-400">(89 reviews)</span>
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





import React, { useEffect, useState } from "react";
import search from "../../../assets/client images/client-home/referal part/search.png";
import sortIcon from "../../../assets/client images/client-home/referal part/sort.png";
import johnone from "../../../assets/client images/client-home/referal part/johnone.png";
import tick from "../../../assets/client images/client-home/referal part/tick.png";
import yellowstar from "../../../assets/client images/client-home/referal part/yellowstar.png";
import { getAuthToken } from "../../../utils/auth";



const Technican = () => {
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const [technicians, setTechnicians] = useState([]);
const [loading, setLoading] = useState(true);


const sorted = [...technicians].sort((a, b) =>
  sortBy === "Newest"
    ? new Date(b.date) - new Date(a.date)
    : new Date(a.date) - new Date(b.date)
);


  const totalPages = Math.ceil(sorted.length / perPage);
  const current = sorted.slice((page - 1) * perPage, page * perPage);

  const [searchTerm, setSearchTerm] = useState("");
const [searching, setSearching] = useState(false);

const handleSearch = async () => {
  if (!searchTerm.trim()) return;

  try {
    setSearching(true);
    setLoading(true);
    setPage(1); // reset pagination

    const token = getAuthToken();

    const params = new URLSearchParams({
      keyword: searchTerm,
      isAvailableNow: "true",
    });

    const res = await fetch(
      `https://search-and-discovery.onrender.com/api/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Search failed");
    }

    // Normalize search response
    const mapped = (data?.data || []).map((item) => ({
      id: item.id || item._id,
      name: item.fullName || item.businessName || "Unnamed Artisan",
      img: item.profilePicture || johnone,
      date: item.createdAt || new Date().toISOString(),
      specialty:
        item.skillSet?.join(", ") ||
        item.category ||
        "Technician",
      rating: item.rating || 0,
      reviews: item.reviewsCount || 0,
    }));

    setTechnicians(mapped);
  } catch (err) {
    console.error("Search error:", err.message);
    setTechnicians([]);
  } finally {
    setLoading(false);
    setSearching(false);
  }
};


  useEffect(() => {
  const fetchArtisans = async () => {
    try {
      const token = getAuthToken();

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

      // normalize response
      const mapped = (data?.data || []).map((artisan) => ({
        id: artisan.id || artisan._id,
        name: artisan.fullName || "Unnamed Artisan",
        img: artisan.profilePicture || johnone, // fallback image
        date: artisan.createdAt || new Date().toISOString(),
        specialty: artisan.specialty || "Technician",
        rating: artisan.rating || 4.5,
        reviews: artisan.reviewsCount || 0,
      }));

      setTechnicians(mapped);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchArtisans();
}, []);


  return (
    <div className="max-w-6xl mx-auto p-6">

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
      <img src={search} className="w-4 opacity-60" />
    </div>

<input
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
  className="flex-1 text-sm px-2 outline-none placeholder:text-gray-400"
  placeholder="Search Technician name, skill or location"
/>


<button
  onClick={handleSearch}
  disabled={searching}
  className="bg-[#3E83C4] text-white text-sm px-6 font-medium disabled:opacity-60"
>
  {searching ? "Searching..." : "Search"}
</button>

  </div>

  {/* Sort Button */}
  <button
    onClick={() => setSortBy(sortBy === "Newest" ? "Oldest" : "Newest")}
    className="flex items-center gap-2 h-[42px] border border-gray-300 px-4 rounded-lg text-sm text-gray-700 bg-white"
  >
    <img src={sortIcon} className="w-4 opacity-70" />
    <span>Sort by</span>
    <span className="font-medium">{sortBy}</span>
    <span className="text-gray-400 text-xs mt-[1px]">▾</span>
  </button>

</div>


{/* Cards */}
{/* Loading */}
{loading && (
  <p className="text-center text-sm text-gray-500 mb-6">
    Loading technicians...
  </p>
)}

{/* Empty state */}
{!loading && technicians.length === 0 && (
  <p className="text-center text-sm text-gray-500 mb-6">
    No technicians found.
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
  />

  {/* <span className="absolute -top-2 left-2 bg-[#5B61D1] text-white text-[10px] px-2 py-[2px] rounded-full shadow-sm"> */}
    <span className="absolute -top-2 right-2 bg-[#5B61D1] text-white text-[10px] px-3 py-[2px] rounded-full shadow-sm">

    Early User
  </span>
</div>

     <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm">{tech.name}</p>
          <img src={tick} className="w-4" />
        </div>

        <p className="text-xs text-gray-500">{tech.specialty}</p>

        <div className="flex items-center gap-1 text-xs mt-1">
          <img src={yellowstar} className="w-3" />
          <span>{tech.rating}</span>
          <span className="text-gray-400">({tech.reviews} reviews)</span>
        </div>


        <button className="mt-3 w-full bg-[#3E83C4] text-white py-2 text-xs rounded-md hover:bg-blue-600 transition">

          View Profile
        </button>
      </div>
    </div>
  ))}
</div>

{/* Pagination + Next Same Row */}
<div className="flex items-center justify-center gap-4 mt-10">
  <div className="flex gap-3">
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setPage(i + 1)}
        className={`w-8 h-8 rounded-md text-sm ${
          page === i + 1
            ? "bg-blue-500 text-white"
            : "border hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>

  {/* NEXT button beside pagination */}
  <button
    disabled={page >= totalPages}
    onClick={() => page < totalPages && setPage(page + 1)}
    className="flex items-center gap-2 border px-6 py-2 rounded-md hover:bg-gray-100 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Next →
  </button>
</div>

    </div>
  );
};

export default Technican;
