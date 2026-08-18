import React, { useState, useEffect } from "react";
import exportImg from "../../assets/Admin Images/export.png";
import newImg from "../../assets/Admin Images/new.png";
import escalated from "../../assets/Admin Images/escalated.png";
import eye from "../../assets/Admin Images/preview.png";
// import { useState } from "react";

const Disputes = () => {

  const [showResolveModal, setShowResolveModal] = useState(false);

const [selectedDispute, setSelectedDispute] = useState(null);

const [resolutionData, setResolutionData] = useState({
  resolution: "REFUND_CLIENT",
  note: "",
});

const [disputes, setDisputes] = useState([]);

const [resolveLoading, setResolveLoading] = useState(false);

const newCount = disputes.filter(
  (d) => d.status === "New"
).length;

const reviewCount = disputes.filter(
  (d) => d.status === "In Review"
).length;

const escalatedCount = disputes.filter(
  (d) => d.status === "Escalated"
).length;

const resolvedCount = disputes.filter(
  (d) => d.status === "Resolved"
).length;


const handleResolveDispute = async () => {

  try {

    setResolveLoading(true);

    const token = getAuthToken();

    const BASE_URL = 'https://order-api.fixserv.co'

    const response = await fetch(
      `${BASE_URL}/api/orders/${selectedDispute.orderId}/resolve-dispute`,
      {
        method: "PATCH",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          resolution: resolutionData.resolution,
          note: resolutionData.note,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      alert("Dispute resolved successfully");

      setShowResolveModal(false);

      setResolutionData({
        resolution: "REFUND_CLIENT",
        note: "",
      });

    } else {

      alert(data.message || "Failed to resolve dispute");
    }

  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  } finally {

    setResolveLoading(false);
  }
};

const fetchDisputes = async () => {

  try {

    const BASE_URL = 'https://order-api.fixserv.co'

    const token = getAuthToken();

    const response = await fetch(
      `${BASE_URL}/api/orders/dashboard/disputes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log("DISPUTES:", data);

    setDisputes(data?.data?.disputes || []);

  } catch (error) {

    console.log(error);
  }
};

useEffect(() => {
  fetchDisputes();
}, []);

  return (
    <>
    {showResolveModal && (

  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">

<div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">

  {/* HEADER */}
  <div className="px-6 py-5 border-b">
    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-xl font-semibold">
          Resolve Dispute
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {selectedDispute?.id}
        </p>
      </div>

      <button
        onClick={() => setShowResolveModal(false)}
        className="text-2xl text-gray-500"
      >
        ×
      </button>

    </div>
  </div>


  {/* BODY */}
  <div className="p-6 space-y-5">

    {/* Resolution */}
    <div>
      <label className="text-sm text-gray-600 block mb-2">
        Resolution
      </label>

      <select
        value={resolutionData.resolution}
        onChange={(e) =>
          setResolutionData({
            ...resolutionData,
            resolution: e.target.value,
          })
        }
        className="w-full border border-gray-300 rounded-lg px-4 py-3"
      >
        <option value="REFUND_CLIENT">
          Refund Client
        </option>

        <option value="RELEASE_PAYMENT">
          Release Payment
        </option>

        <option value="PARTIAL_REFUND">
          Partial Refund
        </option>
      </select>
    </div>


    {/* Note */}
    <div>
      <label className="text-sm text-gray-600 block mb-2">
        Admin Note
      </label>

      <textarea
        rows={5}
        value={resolutionData.note}
        onChange={(e) =>
          setResolutionData({
            ...resolutionData,
            note: e.target.value,
          })
        }
        placeholder="Explain the resolution..."
        className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
      />

    </div>

  </div>


  {/* FOOTER */}
  <div className="px-6 py-4 border-t flex flex-col sm:flex-row justify-end gap-3">

    <button
      onClick={() => setShowResolveModal(false)}
      className="w-full sm:w-auto border border-gray-300 px-5 py-2 rounded-lg"
    >
      Cancel
    </button>


    <button
      onClick={handleResolveDispute}
      disabled={resolveLoading}
      className="w-full sm:w-auto bg-[#3E83C4] text-white px-5 py-2 rounded-lg disabled:opacity-50"
    >
      {resolveLoading
        ? "Resolving..."
        : "Resolve Dispute"}
    </button>

  </div>


</div>

  </div>
)}
    <div className="w-full bg-white">
      <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-black">
                Resolve Disputes
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and resolve customer disputes
              </p>
            </div>

            {/* <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-sm">
              <img src={exportImg} className="w-4 h-4" />
              Export
            </button> */}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {[
  { label: "New", value: newCount },
  { label: "In Review", value: reviewCount },
  { label: "Escalated", value: escalatedCount },
  { label: "Resolved (7d)", value: resolvedCount },
].map((item, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500">{item.label}</p>
                <h2 className="text-xl font-semibold text-black mt-1">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              placeholder="Search by transaction ID, client, or artisan..."
              className="border border-blue-300 focus:border-blue-500 outline-none px-4 py-2 rounded-lg text-sm w-full sm:max-w-md"
            />

            {/* <select className="border border-gray-300 px-4 py-2 text-sm rounded-md bg-white">
              <option>All Statuses</option>
            </select> */}
          </div>

          {/* Table */}
         <div className="border border-gray-200 rounded-xl overflow-hidden">
  <div className="overflow-x-auto">
    <div className="min-w-[1200px]">

            {/* Header Row */}
            <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 text-xs text-gray-500 font-medium border-b">
              <div className="col-span-1">Dispute ID</div>
              <div className="col-span-1">Transaction ID</div>
              <div className="col-span-1">Client</div>
              <div className="col-span-1">Artisan</div>
              <div className="col-span-3">Issue</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">SLA</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            {disputes.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 px-5 py-4 border-b text-sm items-center hover:bg-[#3E83C4]/5 transition-colors duration-200"
              >
                <div className="col-span-1">{row.disputeId || row.id}</div>
                <div className="col-span-1">{row.transactionId || row.orderId}</div>
                <div className="col-span-1">{row.clientName || row.client?.fullName || "N/A"}</div>
                <div className="col-span-1">{row.artisanName || row.artisan?.fullName || "N/A"}</div>

                <div className="col-span-3">{row.issue}</div>

                <div className="col-span-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    row.priority === "High"
                      ? "bg-red-100 text-red-600"
                      : row.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {row.priority}
                  </span>
                </div>

                <div className="col-span-1">
                  {row.status === "New" && (
                    <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md flex items-center gap-1 w-fit">
                      <img src={newImg} className="w-3 h-3" />
                      New
                    </span>
                  )}

                  {row.status === "In Review" && (
                    <span className="px-2 py-1 text-xs border border-gray-300 rounded-md">
                      In Review
                    </span>
                  )}

                  {row.status === "Resolved" && (
                    <span className="px-2 py-1 text-xs bg-gray-200 rounded-md">
                      Resolved
                    </span>
                  )}
                </div>

                <div className="col-span-1 text-xs text-gray-500">
                 {row.sla || "N/A"}
                </div>

                <div className="col-span-2 flex justify-end items-center gap-2">
                  <button className="
flex items-center justify-center gap-1
h-9 min-w-[92px]
text-xs
border border-gray-300
rounded-lg
hover:bg-gray-50
transition
">
                    <img src={eye} className="w-3 h-3" />
                    Review
                  </button>

                  {row.status !== "Resolved" && (
                    <button
  onClick={() => {
    setSelectedDispute(row);
    setShowResolveModal(true);
  }}
  className="
flex items-center justify-center gap-1
h-9 min-w-[100px]
text-xs
border border-red-200
text-red-600
rounded-lg
hover:bg-red-50
transition
"
>
  <img src={escalated} className="w-3 h-3" />
  Resolve
</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>

        </div>
      </section>
    </div>
    </>
  );
};

export default Disputes;
