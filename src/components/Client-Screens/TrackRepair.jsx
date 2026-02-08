// import React from "react"; 
// import checkIcon from "../../assets/client images/client-home/checck.png"; // Use your actual icon
// import circleIcon from "../../assets/client images/client-home/circle.png"; // Default circle

// const TrackRepair = () => {
//   const progressSteps = [
//     {
//       title: "Request Received",
//       desc: "Repair request has been accepted by technician",
//       date: "12th October, 2025",
//       time: "2:42 PM",
//       done: true,
//     },
//     {
//       title: "Device Drop-off",
//       desc: "Your device has been dropped off with the technician",
//       date: "12th October, 2025",
//       time: "2:42 PM",
//       done: true,
//     },
//     {
//       title: "Repair in Progress",
//       desc: "The technician has started on your repair",
//       date: null,
//       time: null,
//       done: false,
//     },
//     {
//       title: "Ready for pick-up",
//       desc: "Your device repair is completed and ready for pick-up",
//       date: null,
//       time: null,
//       done: false,
//     },
//     {
//       title: "Completed",
//       desc: "Repair service completed",
//       date: null,
//       time: null,
//       done: false,
//     },
//   ];

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <section className="w-full px-24 py-14">

//         {/* Back */}
//         <button className="text-sm text-blue-600 mb-10 flex items-center gap-1">
//           ← Back
//         </button>

//         {/* TOP INFO */}
//         <div className="text-center mb-14">
//           <h3 className="text-sm text-gray-800 font-medium">
//             Track Your Repair
//           </h3>
//           <p className="text-[13px] text-gray-400">
//             View your device status and repair progress in real time.
//           </p>

//           <h2 className="text-lg font-semibold mt-6">
//             Repair ID: #FX2341
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">
//             iPhone 12 Pro – Black
//           </p>

//           {/* Status Badge */}
//           <span className="inline-block bg-[#FFF6D6] text-[#987A2A] text-xs px-3 py-1 rounded-md mt-3">
//             In progress
//           </span>

//           <p className="text-xs text-gray-400 mt-4">
//             Last Updated: Today, 2:42 PM
//           </p>
//         </div>

//         {/* TIMELINE */}
//         <div className="relative pl-10">

//           {/* Vertical Line */}
//           <div className="absolute left-3 top-0 w-[2px] h-full bg-[#CFE2F5]"></div>

//           {progressSteps.map((step, index) => (
//             <div
//               key={index}
//               className="flex items-start gap-6 mb-10 relative"
//             >
//               {/* Status Icon */}
//               <img
//                 src={step.done ? checkIcon : circleIcon}
//                 className="w-6 h-6 z-10"
//                 alt=""
//               />

//               {/* Text */}
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-gray-800">
//                   {step.title}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {step.desc}
//                 </p>
//               </div>

//               {/* Date & Time */}
//               <div className="text-right text-xs text-gray-500 w-[140px]">
//                 {step.date && <p>{step.date}</p>}
//                 {step.time && <p>{step.time}</p>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* BUTTONS */}
//         <div className="text-center mt-20">
//           <button className="bg-[#3E83C4] text-white px-14 py-3 rounded-md text-sm font-medium">
//             Rate Service
//           </button>

//           <p className="mt-4 text-sm text-red-500 cursor-pointer">
//             Cancel Request
//           </p>
//         </div>

//       </section>
//     </div>
//   );
// };

// export default TrackRepair;



// import React, { useState } from "react";
// import { CheckCircle2, Circle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import failure from "../../assets/client images/client-home/cancel.png";
// import success from "../../assets/client images/client-home/success.png";



// const stepsData = [
//   "Request Received",
//   "Device Drop-off",
//   "Repair in Progress",
//   "Ready for Pick-up",
//   "Completed",
// ];

// const TrackRepair = () => {
//   const [completedStep, setCompletedStep] = useState(1);
//   const [timestamps, setTimestamps] = useState(
//     stepsData.map(() => null)
//   );

//   const formatDateTime = () => {
//     const now = new Date();
//     const date = now.toLocaleDateString(undefined, {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//     const time = now.toLocaleTimeString(undefined, {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//     return { date, time };
//   };

//   const updateProgress = (stepIndex) => {
//     setCompletedStep(stepIndex);

//     setTimestamps((prev) =>
//       prev.map((ts, i) =>
//         i <= stepIndex ? ts || formatDateTime() : null
//       )
//     );
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-white px-6 md:px-28 py-14">
//       <div className="flex items-center mb-6">
//   <button
//     onClick={() => navigate(-1)}
//     className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
//   >
//     <ArrowLeft size={18} />
//     <span className="text-sm font-medium">Back</span>
//   </button>
// </div>
//       {/* Header */}
//       <p className="text-center text-gray-500">Track Your Repair</p>
//       <h2 className="text-center font-bold text-lg mt-1">
//         Repair ID: #FX2341
//       </h2>
//       <p className="text-center text-sm text-gray-600">
//         iPhone 12 Pro – Black
//       </p>

//       {/* Status */}
//       <div className="text-center mt-2">
//         <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
//           In Progress
//         </span>
//       </div>

//       {/* Timeline */}
//      {/* Timeline */}
// <div className="mt-10">
//   {stepsData.map((step, index) => {
//     const isCompleted = index <= completedStep;
//     const timestamp = timestamps[index];

//     return (
//       <div
//         key={index}
//         onClick={() => updateProgress(index)}
//         className="flex items-start gap-6 mb-10 cursor-pointer"
//       >
//         {/* LEFT: Line & Icon */}
//         <div className="relative flex flex-col items-center">
//           <span className="z-10 bg-white">
//             {isCompleted ? (
//               <CheckCircle2 className="text-blue-600 w-6 h-6" />
//             ) : (
//               <Circle className="text-gray-400 w-6 h-6" />
//             )}
//           </span>

//           {index !== stepsData.length - 1 && (
//             <span className="w-px h-full bg-blue-300 absolute top-6" />
//           )}
//         </div>

//         {/* CENTER: Step Content */}
//         <div className="flex-1">
//           <p
//             className={`font-semibold ${
//               isCompleted ? "text-blue-700" : "text-gray-500"
//             }`}
//           >
//             {step}
//           </p>

//           <p className="text-sm text-gray-500">
//             {[
//               "Repair request accepted",
//               "Dropped off with technician",
//               "Technician working…",
//               "Repair done, awaiting pick-up",
//               "Service completed",
//             ][index]}
//           </p>
//         </div>

//         {/* RIGHT: Date & Time */}
//         <div className="w-28 text-xs text-gray-400 text-right leading-tight">
//           {timestamp && (
//             <>
//               <p>{timestamp.date}</p>
//               <p>{timestamp.time}</p>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   })}
// </div>



//       {/* Bottom Buttons */}
//       <div className="flex flex-col gap-3 items-center mt-10">
//         <button className="bg-blue-600 text-white px-6 py-2 rounded-lg w-40">
//           Rate Service
//         </button>
//         <button className="text-red-600 text-sm">
//           Cancel Request
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TrackRepair;


import React, { useState } from "react";
import { CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import failure from "../../assets/client images/client-home/cancel.png";
import success from "../../assets/client images/client-home/success.png";
import { useLocation } from "react-router-dom";

const stepsData = [
  "Request Received",
  "Device Drop-off",
  "Repair in Progress",
  "Ready for Pick-up",
  "Completed",
];

const TrackRepair = () => {
  const [completedStep, setCompletedStep] = useState(1);
  const [timestamps, setTimestamps] = useState(
    stepsData.map(() => null)
  );
  
  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
  // Cancel reason state
  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  // Rating state
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const formatDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const time = now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const updateProgress = (stepIndex) => {
    setCompletedStep(stepIndex);
    setTimestamps((prev) =>
      prev.map((ts, i) =>
        i <= stepIndex ? ts || formatDateTime() : null
      )
    );
  };

  const handleCancelReasonSelect = (reason) => {
    setCancelReason(reason);
  };

  const handleCancelRequest = () => {
    // Here you would typically make an API call to cancel the repair
    console.log("Cancelling repair with reason:", cancelReason);
    setShowCancelModal(false);
    setShowCancelSuccess(true);
    // Reset form
    setCancelReason("");
    setOtherReason("");
  };

  const handleRateService = () => {
    // Here you would typically handle the rating submission
    console.log("Rating submitted:", { rating, feedback });
    setShowRateModal(false);
    // Reset form
    setRating(0);
    setFeedback("");
    // Optionally show success message
  };

  const navigate = useNavigate();

  const location = useLocation();
const booking = location.state?.booking;
const artisan = location.state?.artisan;

if (!booking) {
  return (
    <div className="py-20 text-center text-gray-500">
      Repair details not found.
    </div>
  );
}

  return (
   <section className="w-full py-14 overflow-hidden bg-white relative">
  <div className="max-w-7xl mx-auto px-6 md:px-10">

      {/* Blur backdrop when any modal is open */}
      {(showCancelModal || showRateModal || showCancelSuccess) && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>
      )}

      {/* Cancel Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Cancel Repair Reason</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setOtherReason("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Cancel Repair Request?</h4>
              <p className="text-gray-600 text-sm mb-4">
                We're sorry to see you cancel this request. Please tell us why so we can improve your experience.
              </p>
              
              <p className="font-medium text-gray-700 mb-3">Why do you want to cancel?</p>
              
              <div className="space-y-2">
                {[
                  "Technician hasn't responded",
                  "Found another repair option",
                  "Took too long to get a quote",
                  "Decided not to fix the device",
                  "Issue was resolved elsewhere",
                  "Other (please specify)"
                ].map((reason) => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => handleCancelReasonSelect(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
              
              {cancelReason === "Other (please specify)" && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full mt-3 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              )}
            </div>
            
            <div className="border-t pt-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Cancel Request?</h4>
              <p className="text-gray-600 text-sm mb-4">
                Cancelling a repair in progress now results in partial charges depending on the technicians effort so far.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelRequest}
                  disabled={!cancelReason}
                  className={`flex-1 py-2 px-4 rounded-lg transition ${
                    cancelReason 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Yes, Cancel Booking
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                    setOtherReason("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rate Service Modal */}
      {showRateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Rate Our Service</h3>
              <button
                onClick={() => {
                  setShowRateModal(false);
                  setRating(0);
                  setFeedback("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">How would you rate your repair experience?</p>
              
              {/* Star Rating Component */}
              <div className="flex justify-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-transform hover:scale-110 ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                {rating === 0 && "Select your rating"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Additional feedback (optional)"
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
              />
              
              <button
                onClick={handleRateService}
                disabled={rating === 0}
                className={`w-full mt-4 py-3 rounded-lg transition ${
                  rating > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Success Modal */}
      {showCancelSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowCancelSuccess(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <img 
                src={success} 
                alt="Success" 
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Successful</h3>
              <p className="text-gray-600">
                Your repair request has been cancelled successfully
              </p>
            </div>
            
            <button
              onClick={() => setShowCancelSuccess(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        (showCancelModal || showRateModal || showCancelSuccess) ? 'blur-sm' : ''
      }`}>
{/* Back Button */}
{/* Top Row */}
<div className="relative mb-12">

  {/* Back Button — locked to left */}
  <div className="absolute left-0 top-0">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-[#3E83C4] hover:underline"
    >
      <ArrowLeft size={18} />
      <span className="text-sm">Back</span>
    </button>
  </div>

  {/* Centered Title Block */}
  <div className="text-center">
    <h2 className="text-black font-semibold text-xl">
      Track Your Repair
    </h2>

    <p className="text-[#6B6B6B] text-sm mt-1">
      View your device status and repair progress in real time.
    </p>
  </div>
</div>

{/* Repair Info */}
<div className="mt-8 text-center space-y-2">
  <h3 className="font-semibold text-2xl">
  Repair ID: <span className="font-semibold">#{booking.id}</span>
</h3>

<p className="text-lg font-normal text-black">
  {booking.deviceModel}
</p>
</div>

{/* Status */}
<div className="flex justify-center items-center gap-2 mt-3">
  <p className="text-sm text-[#535353]">Status:</p>

<span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
  {booking.status}
</span>
</div>

<p className="text-sm text-center text-[#7A7A7A] mt-2">
  Last Updated: Today, 2:42 PM
</p>



        {/* Timeline */}
        <div className="mt-10">
          {stepsData.map((step, index) => {
            const isCompleted = index <= completedStep;
            const timestamp = timestamps[index];

            return (
              <div
                key={index}
                onClick={() => updateProgress(index)}
                // className="flex items-start gap-6 mb-10 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                className="flex items-start gap-8 mb-8 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"

              >
                {/* LEFT: Line & Icon */}
                <div className="relative flex flex-col items-center">
                  {/* <span className="z-10 bg-white"> */}
                  <span className="z-10 bg-white p-0.5 rounded-full">
                    {isCompleted ? (
                      <CheckCircle2 className="text-[#3E83C4] w-6 h-6" />
                    ) : (
                      <Circle className="text-[#656565] w-6 h-6" />
                    )}
                  </span>

                  {index !== stepsData.length - 1 && (
                    // <span className="w-px h-full bg-blue-300 absolute top-6" />
                    <span className="w-px h-[72px] bg-blue-300 absolute top-7" />

                  )}
                </div>

                {/* CENTER: Step Content */}
                <div className="flex-1">
                  {/* <p
                    className={`font-semibold ${
                      isCompleted ? "text-blue-700" : "text-gray-500"
                    }`}
                    
                  > */}
                  <p className={`font-medium ${isCompleted ? "text-[#3E83C4]" : "text-gray-600"}`}>

                    {step}
                  </p>

                  {/* <p className="text-sm text-gray-500"> */}
                  <p className="text-xs text-[#656565] mt-1">

                    {[
                      "Repair request accepted",
                      "Dropped off with technician",
                      "Technician working…",
                      "Repair done, awaiting pick-up",
                      "Service completed",
                    ][index]}
                  </p>
                </div>

                {/* RIGHT: Date & Time */}
                {/* <div className="w-28 text-xs text-gray-400 text-right leading-tight"> */}
                <div className="w-32 text-[11px] text-gray-400 text-right leading-tight pt-1">

                  {timestamp && (
                    <>
                      <p>{timestamp.date}</p>
                      <p>{timestamp.time}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Buttons */}
        {/* <div className="flex flex-col gap-3 items-center mt-10"> */}
        <div className="flex flex-col gap-4 items-center mt-14">

          <button 
            onClick={() => setShowRateModal(true)}
            className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#3e83c4] transition-colors cursor-pointer"
          >
            Rate Service
          </button>
          <button 
            onClick={() => setShowCancelModal(true)}
            className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
          >
            Cancel Request
          </button>
        </div>
      </div>
    </div>
    </section>
  );
};

export default TrackRepair;