import React, { useEffect, useState } from "react";
import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/adebayo.png";
import total from "../../assets/Artisan Images/total.png";
import totaljobs from "../../assets/Artisan Images/totaljobs.png";
import ongoing from "../../assets/Artisan Images/ongoing.png";
import completed from "../../assets/Artisan Images/completed.png";
import uncompleted from "../../assets/Artisan Images/uncompleted.png";
import scalearrow from "../../assets/Artisan Images/scalearrows.png";
import { getAuthUser, getAuthToken } from "../../utils/auth";

const Dashboard = () => {
  const artisan = getAuthUser();
  const [activeTab, setActiveTab] = useState("Job Requests");

  if (!artisan) {
    return null; // or loader / redirect
  }

  const [jobs, setJobs] = useState([]); 

//   useEffect(() => {
//   fetch("{{ARTISAN_JOBS_ENDPOINT}}", {
//     headers: {
//       Authorization: `Bearer ${getAuthToken()}`
//     }
//   })
//     .then(res => res.json())
//     .then(data => setJobs(data.jobs || []));
// }, []);

useEffect(() => {
  const run = async () => {
    try {
      const token = getAuthToken();

      const res = await fetch("/api/artisan/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("JOBS STATUS:", res.status);
      console.log("JOBS CONTENT-TYPE:", res.headers.get("content-type"));

      const contentType = res.headers.get("content-type") || "";

      // If backend didn't return JSON, log body for debugging
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.log("JOBS NOT JSON BODY (first 300):", text.slice(0, 300));
        throw new Error("Jobs endpoint did not return JSON");
      }

      const data = await res.json();
      console.log("JOBS JSON:", data);

      // adapt to your backend shape
      const jobsArray =
        data?.jobs ??
        data?.data?.jobs ??
        data?.data ??
        [];

      setJobs(Array.isArray(jobsArray) ? jobsArray : []);
    } catch (e) {
      console.log("JOBS FETCH ERROR =>", e);
    }
  };

  run();
}, []);



  return (
    <div className="w-full pr-4">

      {/* Header */}
      <div className="flex justify-between p-4 items-center">
        <div>
          <h1 className="text-2xl font-semibold text-black">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome {artisan.fullName}</p>
        </div>

        <div className="flex items-center gap-4">
          <img src={not} className="w-11 h-9 cursor-pointer" />
          <img src={artisan.profileImage || profile} className="w-9 h-9 rounded-full cursor-pointer" />
        </div>
      </div>
       {/* Divider */}
        <div className="border-t border-blue-100"></div>

      {/* Summary Cards Container */}
<div className="pl-6 mt-6">
  <div className="border border-blue-100 bg-[#F6F6F6] rounded-xl p-6">

  <div className="grid grid-cols-6 gap-5">

    {/* Total Amount */}
    <div className="col-span-2 bg-[#7FAEFA] text-white rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm opacity-90">Total Amount</p>
        <img src={total} className="w-8" />
      </div>
      <h2 className="text-2xl font-semibold">NGN {artisan.wallet?.balance || 0}</h2>
      <div className="flex items-center gap-1 mt-3 text-xs">
        <img src={scalearrow} className="w-4" />
        <span>+15% this week</span>
      </div>
    </div>

    {/* Total Jobs */}
    <div className="col-span-2 bg-[#BFD4EA] text-black rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-600">Total Jobs</p>
        <img src={totaljobs} className="w-8" />
      </div>
      <h2 className="text-2xl font-semibold">{artisan.stats?.totalJobs || 0}</h2>
      <div className="flex items-center gap-1 mt-3 text-xs text-gray-600">
        <img src={scalearrow} className="w-4" />
        <span>+12% this week</span>
      </div>
    </div>

    {/* Ongoing Jobs */}
    <div className="col-span-2 bg-[#D9A600] text-black rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm">Ongoing Jobs</p>
        <img src={ongoing} className="w-8" />
      </div>
      <h2 className="text-2xl font-semibold">{artisan.stats?.ongoingJobs || 0}</h2>
      <div className="flex items-center gap-1 mt-3 text-xs">
        <img src={scalearrow} className="w-4" />
        <span>+30% this week</span>
      </div>
    </div>

    {/* Completed Jobs */}
    <div className="col-span-2 bg-[#2E8B2E] text-white rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm opacity-90">Completed Jobs</p>
        <img src={completed} className="w-8" />
      </div>
      <h2 className="text-2xl font-semibold">{artisan.stats?.completedJobs || 0}</h2>
      <div className="flex items-center gap-1 mt-3 text-xs">
        <img src={scalearrow} className="w-4" />
        <span>+70% this week</span>
      </div>
    </div>

    {/* Uncompleted Jobs */}
    <div className="col-span-2 bg-[#E10600] text-white rounded-lg p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm opacity-90">Uncompleted Jobs</p>
        <img src={uncompleted} className="w-8" />
      </div>
      <h2 className="text-2xl font-semibold">{artisan.stats?.uncompletedJobs || 0}</h2>
      <div className="flex items-center gap-1 mt-3 text-xs">
        <img src={scalearrow} className="w-4" />
        <span>-20% this week</span>
      </div>
    </div>

  </div>
</div>

</div>

{/* Jobs Section */}
<div className="mt-10 mb-10 p-6 bg-white">


  <div className="flex justify-between items-center mb-6">
    <div className="flex gap-8 text-sm">
      {["Job Requests", "Completed Jobs", "Ongoing Jobs", "Pending Jobs"].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 transition ${
            activeTab === tab
              ? "text-[#3E83C4] border-b-2 border-[#3E83C4]"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    <button className="flex items-center gap-2 text-sm border px-4 py-2 rounded-md text-gray-600 hover:bg-gray-50">
      More
      <span className="text-lg">›</span>
    </button>
  </div>


  <div className="space-y-6 p-6 border border-blue-200 rounded-xl">


{jobs.map(job => (
  <div key={job.id} className="border border-blue-200 rounded-xl p-5">
    <div className="flex justify-between items-center pb-3 border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold">
          {job.clientName.charAt(0)}
        </div>
        <p className="font-semibold">{job.clientName}</p>
        <span className="text-sm text-gray-400">{job.createdAt}</span>
      </div>
      <span className="text-gray-500 text-sm">{job.status}</span>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
      <div>
        <p><b>Repair Type:</b> {job.service}</p>
        <p><b>Location:</b> {job.location}</p>
      </div>
      <div>
        <p><b>Duration:</b> {job.duration}</p>
        <p><b>Price:</b> NGN {job.price}</p>
      </div>
    </div>
  </div>
))}



    <div className="border border-blue-200 rounded-xl p-5">

      <div className="flex justify-between items-center pb-3 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold">
            A
          </div>
          <p className="font-semibold">Ade Jaiye</p>
          <span className="text-sm text-gray-400">Three weeks ago</span>
        </div>

        <span className="text-green-500 text-sm font-medium">Available</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">

        <div className="space-y-3">
          <p><span className="font-medium">Repair Type :</span> Iphone 13 pro</p>
          <p><span className="font-medium">Location :</span> Alausa road, Lagos</p>
        </div>

        <div className="space-y-3">
          <p><span className="font-medium">Duration :</span> 2 weeks</p>
          <p><span className="font-medium">Price :</span> 130 thousand naira</p>
        </div>

      </div>
    </div>

  </div>
</div>



    </div>
  );
};

export default Dashboard;
