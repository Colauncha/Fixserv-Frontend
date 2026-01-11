import { useState } from "react";

const jobsData = {
  "Job Requests": [
    {
      name: "Kunle Juwon",
      time: "Two months ago",
      status: "Booked",
      repair: "Refrigerator repair",
      location: "2 Fatai Doherty Close, Lagos",
      duration: "2 weeks",
      price: "50 thousand naira",
    },
    {
      name: "Ade Jaiye",
      time: "Three weeks ago",
      status: "Available",
      repair: "Iphone 13 pro",
      location: "Alausa road, Lagos",
      duration: "2 weeks",
      price: "130 thousand naira",
    },
  ],

  "Ongoing Jobs": [
    {
      name: "Bola Ahmed",
      time: "1 day ago",
      status: "In Progress",
      repair: "Washing Machine repair",
      location: "Yaba, Lagos",
      duration: "1 week",
      price: "70 thousand naira",
    },
  ],

  "Completed Jobs": [
    {
      name: "Sola Akin",
      time: "4 days ago",
      status: "Completed",
      repair: "Air conditioner servicing",
      location: "Ikeja, Lagos",
      duration: "3 days",
      price: "40 thousand naira",
    },
  ],

  "Pending Jobs": [
    {
      name: "Tunde Bello",
      time: "6 hours ago",
      status: "Pending",
      repair: "Microwave repair",
      location: "Surulere, Lagos",
      duration: "2 days",
      price: "20 thousand naira",
    },
  ],
};

const tabs = ["Job Requests", "Completed Jobs", "Ongoing Jobs", "Pending Jobs"];

const JobsBoard = () => {
  const [activeTab, setActiveTab] = useState("Job Requests");

  return (
    <div className="mt-10 border border-blue-200 rounded-xl p-6 bg-white">

      {/* Tabs */}
      <div className="flex gap-8 text-sm mb-6 border-b pb-2">
        {tabs.map(tab => (
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

      {/* Job Cards */}
      <div className="space-y-6">
        {jobsData[activeTab].map((job, i) => (
          <div key={i} className="border border-blue-200 rounded-xl p-5">

            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold">
                  {job.name[0]}
                </div>
                <p className="font-semibold">{job.name}</p>
                <span className="text-sm text-gray-400">{job.time}</span>
              </div>

              <span className={`text-sm font-medium ${
                job.status === "Available" ? "text-green-500" :
                job.status === "Completed" ? "text-blue-500" :
                job.status === "Pending" ? "text-yellow-500" :
                "text-gray-500"
              }`}>
                {job.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
              <div className="space-y-3">
                <p><span className="font-medium">Repair Type :</span> {job.repair}</p>
                <p><span className="font-medium">Location :</span> {job.location}</p>
              </div>

              <div className="space-y-3">
                <p><span className="font-medium">Duration :</span> {job.duration}</p>
                <p><span className="font-medium">Price :</span> {job.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsBoard;
