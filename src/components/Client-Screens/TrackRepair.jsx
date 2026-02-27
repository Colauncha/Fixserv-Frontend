
// import React, { useState, useEffect } from "react";
// import { CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import failure from "../../assets/client images/client-home/cancel.png";
// import success from "../../assets/client images/client-home/success.png";
// import { useLocation } from "react-router-dom";

// const stepsData = [
//   "Request Received",
//   "Device Drop-off",
//   "Repair in Progress",
//   "Ready for Pick-up",
//   "Completed",
// ];

// const TrackRepair = () => {
//   const [completedStep, setCompletedStep] = useState(0);
//   // const [timestamps, setTimestamps] = useState(
//   //   stepsData.map(() => null)
//   // );

//   useEffect(() => {
//   if (booking?.currentStep !== undefined) {
//     setCompletedStep(booking.currentStep);
//   }
// }, [booking]);

  
//   // Modal states
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showRateModal, setShowRateModal] = useState(false);
//   const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  
//   // Cancel reason state
//   const [cancelReason, setCancelReason] = useState("");
//   const [otherReason, setOtherReason] = useState("");
//   // Rating state
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState("");

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

// {stepsData.map((step, index) => {
//   const isCompleted = index <= completedStep;
//   const timestamp = booking.timeline?.[index];


// })}


//   const handleCancelReasonSelect = (reason) => {
//     setCancelReason(reason);
//   };

//   const handleCancelRequest = () => {
//     // Here you would typically make an API call to cancel the repair
//     console.log("Cancelling repair with reason:", cancelReason);
//     setShowCancelModal(false);
//     setShowCancelSuccess(true);
//     // Reset form
//     setCancelReason("");
//     setOtherReason("");
//   };

//   const handleRateService = () => {
//     // Here you would typically handle the rating submission
//     console.log("Rating submitted:", { rating, feedback });
//     setShowRateModal(false);
//     // Reset form
//     setRating(0);
//     setFeedback("");
//     // Optionally show success message
//   };

//   const navigate = useNavigate();

//   const location = useLocation();
// const booking = location.state?.booking;
// const artisan = location.state?.artisan;

// useEffect(() => {
//   if (booking?.currentStep !== undefined) {
//     setCompletedStep(booking.currentStep);
//   }
// }, [booking]);


// if (!booking) {
//   return (
//     <div className="py-20 text-center text-gray-500">
//       Repair details not found.
//     </div>
//   );
// }

//   return (
//    <section className="w-full py-14 overflow-hidden bg-white relative">
//   <div className="max-w-7xl mx-auto px-6 md:px-10">

//       {/* Blur backdrop when any modal is open */}
//       {(showCancelModal || showRateModal || showCancelSuccess) && (
//         <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>
//       )}

//       {/* Cancel Reason Modal */}
//       {showCancelModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold text-gray-900">Cancel Repair Reason</h3>
//               <button
//                 onClick={() => {
//                   setShowCancelModal(false);
//                   setCancelReason("");
//                   setOtherReason("");
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <h4 className="font-semibold text-gray-800 mb-2">Cancel Repair Request?</h4>
//               <p className="text-gray-600 text-sm mb-4">
//                 We're sorry to see you cancel this request. Please tell us why so we can improve your experience.
//               </p>
              
//               <p className="font-medium text-gray-700 mb-3">Why do you want to cancel?</p>
              
//               <div className="space-y-2">
//                 {[
//                   "Technician hasn't responded",
//                   "Found another repair option",
//                   "Took too long to get a quote",
//                   "Decided not to fix the device",
//                   "Issue was resolved elsewhere",
//                   "Other (please specify)"
//                 ].map((reason) => (
//                   <label key={reason} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
//                     <input
//                       type="radio"
//                       name="cancelReason"
//                       value={reason}
//                       checked={cancelReason === reason}
//                       onChange={(e) => handleCancelReasonSelect(e.target.value)}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-gray-700">{reason}</span>
//                   </label>
//                 ))}
//               </div>
              
//               {cancelReason === "Other (please specify)" && (
//                 <textarea
//                   value={otherReason}
//                   onChange={(e) => setOtherReason(e.target.value)}
//                   placeholder="Please specify your reason..."
//                   className="w-full mt-3 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   rows="3"
//                 />
//               )}
//             </div>
            
//             <div className="border-t pt-4 mb-4">
//               <h4 className="font-semibold text-gray-800 mb-2">Cancel Request?</h4>
//               <p className="text-gray-600 text-sm mb-4">
//                 Cancelling a repair in progress now results in partial charges depending on the technicians effort so far.
//               </p>
              
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleCancelRequest}
//                   disabled={!cancelReason}
//                   className={`flex-1 py-2 px-4 rounded-lg transition ${
//                     cancelReason 
//                       ? 'bg-red-600 text-white hover:bg-red-700' 
//                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                   }`}
//                 >
//                   Yes, Cancel Booking
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowCancelModal(false);
//                     setCancelReason("");
//                     setOtherReason("");
//                   }}
//                   className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   Go Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Rate Service Modal */}
//       {showRateModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-gray-900">Rate Our Service</h3>
//               <button
//                 onClick={() => {
//                   setShowRateModal(false);
//                   setRating(0);
//                   setFeedback("");
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="text-center mb-6">
//               <p className="text-gray-600 mb-4">How would you rate your repair experience?</p>
              
//               {/* Star Rating Component */}
//               <div className="flex justify-center gap-1 mb-6">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     onClick={() => setRating(star)}
//                     className={`text-4xl transition-transform hover:scale-110 ${
//                       star <= rating ? 'text-yellow-400' : 'text-gray-300'
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
              
//               <div className="text-sm text-gray-500 mb-4">
//                 {rating === 0 && "Select your rating"}
//                 {rating === 1 && "Poor"}
//                 {rating === 2 && "Fair"}
//                 {rating === 3 && "Good"}
//                 {rating === 4 && "Very Good"}
//                 {rating === 5 && "Excellent"}
//               </div>
              
//               <textarea
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//                 placeholder="Additional feedback (optional)"
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows="4"
//               />
              
//               <button
//                 onClick={handleRateService}
//                 disabled={rating === 0}
//                 className={`w-full mt-4 py-3 rounded-lg transition ${
//                   rating > 0
//                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Submit Rating
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cancel Success Modal */}
//       {showCancelSuccess && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">
//             <div className="flex justify-end mb-4">
//               <button
//                 onClick={() => setShowCancelSuccess(false)}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <img 
//                 src={success} 
//                 alt="Success" 
//                 className="w-20 h-20 mx-auto mb-4"
//               />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Successful</h3>
//               <p className="text-gray-600">
//                 Your repair request has been cancelled successfully
//               </p>
//             </div>
            
//             <button
//               onClick={() => setShowCancelSuccess(false)}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${
//         (showCancelModal || showRateModal || showCancelSuccess) ? 'blur-sm' : ''
//       }`}>
// {/* Back Button */}
// {/* Top Row */}
// <div className="relative mb-12">

//   {/* Back Button — locked to left */}
//   <div className="absolute left-0 top-0">
//     <button
//       onClick={() => navigate(-1)}
//       className="flex items-center gap-1 text-[#3E83C4] hover:underline"
//     >
//       <ArrowLeft size={18} />
//       <span className="text-sm">Back</span>
//     </button>
//   </div>

//   {/* Centered Title Block */}
//   <div className="text-center">
//     <h2 className="text-black font-semibold text-xl">
//       Track Your Repair
//     </h2>

//     <p className="text-[#6B6B6B] text-sm mt-1">
//       View your device status and repair progress in real time.
//     </p>
//   </div>
// </div>

// {/* Repair Info */}
// <div className="mt-8 text-center space-y-2">
//   <h3 className="font-semibold text-2xl">
//   Repair ID: <span className="font-semibold">#{booking.id}</span>
// </h3>

// <p className="text-lg font-normal text-black">
//   {booking.deviceModel}
// </p>
// </div>

// {/* Status */}
// <div className="flex justify-center items-center gap-2 mt-3">
//   <p className="text-sm text-[#535353]">Status:</p>

// <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
//   {booking.status}
// </span>
// </div>

// <p className="text-sm text-center text-[#7A7A7A] mt-2">
//   Last Updated: Today, 2:42 PM
// </p>



//         {/* Timeline */}
// <div className="mt-10">
//   {stepsData.map((step, index) => {
//     const isCompleted = index <= completedStep;
//     const timestamp = booking.timeline?.[index];

//     return (
//       <div
//         key={index}
//         className="flex items-start gap-8 mb-8 p-3 rounded-lg"
//       >
//         {/* LEFT */}
//         <div className="relative flex flex-col items-center">
//           <span className="z-10 bg-white p-0.5 rounded-full">
//             {isCompleted ? (
//               <CheckCircle2 className="text-[#3E83C4] w-6 h-6" />
//             ) : (
//               <Circle className="text-[#656565] w-6 h-6" />
//             )}
//           </span>

//           {index !== stepsData.length - 1 && (
//             <span className="w-px h-[72px] bg-blue-300 absolute top-7" />
//           )}
//         </div>

//         {/* CENTER */}
//         <div className="flex-1">
//           <p className={`font-medium ${isCompleted ? "text-[#3E83C4]" : "text-gray-600"}`}>
//             {step}
//           </p>
//           <p className="text-xs text-[#656565] mt-1">
//             {[
//               "Repair request accepted",
//               "Dropped off with technician",
//               "Technician working…",
//               "Repair done, awaiting pick-up",
//               "Service completed",
//             ][index]}
//           </p>
//         </div>

//         {/* RIGHT */}
//         <div className="w-32 text-[11px] text-gray-400 text-right pt-1">
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


//         {/* Bottom Buttons */}
//         {/* <div className="flex flex-col gap-3 items-center mt-10"> */}
//         <div className="flex flex-col gap-4 items-center mt-14">

//           <button 
//             onClick={() => setShowRateModal(true)}
//             className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#3e83c4] transition-colors cursor-pointer"
//           >
//             Rate Service
//           </button>
//           <button 
//             onClick={() => setShowCancelModal(true)}
//             className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
//           >
//             Cancel Request
//           </button>
//         </div>
//       </div>
//     </div>
//     </section>
//   );
// };

// export default TrackRepair;



// import React, { useMemo, useState, useEffect } from "react";
// import { CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
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
//   /* ================= INITIALIZATIONS ================= */

//   const navigate = useNavigate();
//   const location = useLocation();

// const bookingFromStorage = JSON.parse(localStorage.getItem("fixserv_last_booking") || "null");

// const bookingRaw = bookingFromState || bookingFromStorage;

//   const bookingFromState = location.state?.booking;
//   const artisan = location.state?.artisan;

//   const booking = bookingFromState
//     ? {
//         id: bookingFromState.id || "FX1230",
//         status: bookingFromState.status || "Pending",
//         currentStep: bookingFromState.currentStep ?? 0,
//         timeline: bookingFromState.timeline || [],
//         deviceType: bookingFromState.deviceType || "",
//         brand: bookingFromState.brand || "",
//         model: bookingFromState.model || "",
//         location: bookingFromState.location || "",
//         serviceRequired: bookingFromState.serviceRequired || "",
//         issueDescription: bookingFromState.issueDescription || "",
//         damagedDeviceImageUrl:
//           bookingFromState.damagedDeviceImageUrl || "",
//       }
//     : null;

//     const booking = useMemo(() => {
//   if (!bookingRaw) return null;

//   return {
//     id: bookingRaw.id || "FX1230",
//     status: bookingRaw.status || "Pending",
//     currentStep: bookingRaw.currentStep ?? 0,
//     timeline: bookingRaw.timeline || [],
//     deviceType: bookingRaw.deviceType || "",
//     brand: bookingRaw.brand || "",
//     model: bookingRaw.model || "",
//     location: bookingRaw.location || "",
//     serviceRequired: bookingRaw.serviceRequired || "",
//     issueDescription: bookingRaw.issueDescription || "",
//     damagedDeviceImageUrl: bookingRaw.damagedDeviceImageUrl || "",
//   };
// }, [bookingRaw]);

//   const [completedStep, setCompletedStep] = useState(0);

//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [showRateModal, setShowRateModal] = useState(false);
//   const [showCancelSuccess, setShowCancelSuccess] = useState(false);

//   const [cancelReason, setCancelReason] = useState("");
//   const [otherReason, setOtherReason] = useState("");

//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState("");

//   /* ================= EFFECTS ================= */

//   useEffect(() => {
//     if (booking?.currentStep !== undefined) {
//       setCompletedStep(booking.currentStep);
//     }
//   }, [booking]);

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

//   const handleCancelReasonSelect = (reason) => {
//     setCancelReason(reason);
//   };

//   const handleCancelRequest = () => {
//     console.log("Cancelling repair with reason:", cancelReason);
//     setShowCancelModal(false);
//     setShowCancelSuccess(true);
//     setCancelReason("");
//     setOtherReason("");
//   };

//   const handleRateService = () => {
//     console.log("Rating submitted:", { rating, feedback });
//     setShowRateModal(false);
//     setRating(0);
//     setFeedback("");
//   };

//   if (!booking) {
//     return (
//       <div className="py-20 text-center text-gray-500">
//         Repair details not found.
//       </div>
//     );
//   }

//   /* ================= JSX ================= */

//   return (
//     <section className="w-full py-14 overflow-hidden bg-white relative">
//       <div className="max-w-7xl mx-auto px-6 md:px-10">

//         {(showCancelModal || showRateModal || showCancelSuccess) && (
//           <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>
//         )}

//         {showCancelModal && (
//           <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-bold text-gray-900">
//                   Cancel Repair Reason
//                 </h3>
//                 <button
//                   onClick={() => {
//                     setShowCancelModal(false);
//                     setCancelReason("");
//                     setOtherReason("");
//                   }}
//                   className="text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <h4 className="font-semibold text-gray-800 mb-2">
//                   Cancel Repair Request?
//                 </h4>
//                 <p className="text-gray-600 text-sm mb-4">
//                   We're sorry to see you cancel this request. Please tell us why so we can improve your experience.
//                 </p>

//                 <p className="font-medium text-gray-700 mb-3">
//                   Why do you want to cancel?
//                 </p>

//                 <div className="space-y-2">
//                   {[
//                     "Technician hasn't responded",
//                     "Found another repair option",
//                     "Took too long to get a quote",
//                     "Decided not to fix the device",
//                     "Issue was resolved elsewhere",
//                     "Other (please specify)",
//                   ].map((reason) => (
//                     <label
//                       key={reason}
//                       className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
//                     >
//                       <input
//                         type="radio"
//                         name="cancelReason"
//                         value={reason}
//                         checked={cancelReason === reason}
//                         onChange={(e) =>
//                           handleCancelReasonSelect(e.target.value)
//                         }
//                         className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="text-gray-700">{reason}</span>
//                     </label>
//                   ))}
//                 </div>

//                 {cancelReason === "Other (please specify)" && (
//                   <textarea
//                     value={otherReason}
//                     onChange={(e) => setOtherReason(e.target.value)}
//                     placeholder="Please specify your reason..."
//                     className="w-full mt-3 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     rows="3"
//                   />
//                 )}
//               </div>

//               <div className="border-t pt-4 mb-4">
//                 <h4 className="font-semibold text-gray-800 mb-2">
//                   Cancel Request?
//                 </h4>
//                 <p className="text-gray-600 text-sm mb-4">
//                   Cancelling a repair in progress now results in partial charges depending on the technicians effort so far.
//                 </p>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleCancelRequest}
//                     disabled={!cancelReason}
//                     className={`flex-1 py-2 px-4 rounded-lg transition ${
//                       cancelReason
//                         ? "bg-red-600 text-white hover:bg-red-700"
//                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Yes, Cancel Booking
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowCancelModal(false);
//                       setCancelReason("");
//                       setOtherReason("");
//                     }}
//                     className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
//                   >
//                     Go Back
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Rate Service Modal */}
//       {showRateModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-lg font-bold text-gray-900">Rate Our Service</h3>
//               <button
//                 onClick={() => {
//                   setShowRateModal(false);
//                   setRating(0);
//                   setFeedback("");
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="text-center mb-6">
//               <p className="text-gray-600 mb-4">How would you rate your repair experience?</p>
              
//               {/* Star Rating Component */}
//               <div className="flex justify-center gap-1 mb-6">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <button
//                     key={star}
//                     onClick={() => setRating(star)}
//                     className={`text-4xl transition-transform hover:scale-110 ${
//                       star <= rating ? 'text-yellow-400' : 'text-gray-300'
//                     }`}
//                   >
//                     ★
//                   </button>
//                 ))}
//               </div>
              
//               <div className="text-sm text-gray-500 mb-4">
//                 {rating === 0 && "Select your rating"}
//                 {rating === 1 && "Poor"}
//                 {rating === 2 && "Fair"}
//                 {rating === 3 && "Good"}
//                 {rating === 4 && "Very Good"}
//                 {rating === 5 && "Excellent"}
//               </div>
              
//               <textarea
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//                 placeholder="Additional feedback (optional)"
//                 className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows="4"
//               />
              
//               <button
//                 onClick={handleRateService}
//                 disabled={rating === 0}
//                 className={`w-full mt-4 py-3 rounded-lg transition ${
//                   rating > 0
//                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 Submit Rating
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cancel Success Modal */}
//       {showCancelSuccess && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">
//             <div className="flex justify-end mb-4">
//               <button
//                 onClick={() => setShowCancelSuccess(false)}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X size={24} />
//               </button>
//             </div>
            
//             <div className="mb-6">
//               <img 
//                 src={success} 
//                 alt="Success" 
//                 className="w-20 h-20 mx-auto mb-4"
//               />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Successful</h3>
//               <p className="text-gray-600">
//                 Your repair request has been cancelled successfully
//               </p>
//             </div>
            
//             <button
//               onClick={() => setShowCancelSuccess(false)}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
//             >
//               Done
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${
//         (showCancelModal || showRateModal || showCancelSuccess) ? 'blur-sm' : ''
//       }`}>
// {/* Back Button */}
// {/* Top Row */}
// <div className="relative mb-12">

//   {/* Back Button — locked to left */}
//   <div className="absolute left-0 top-0">
//     <button
//       onClick={() => navigate(-1)}
//       className="flex items-center gap-1 text-[#3E83C4] hover:underline"
//     >
//       <ArrowLeft size={18} />
//       <span className="text-sm">Back</span>
//     </button>
//   </div>

//   {/* Centered Title Block */}
//   <div className="text-center">
//     <h2 className="text-black font-semibold text-xl">
//       Track Your Repair
//     </h2>

//     <p className="text-[#6B6B6B] text-sm mt-1">
//       View your device status and repair progress in real time.
//     </p>
//   </div>
// </div>

// {/* Repair Info */}
// <div className="mt-8 text-center space-y-2">
//   <h3 className="font-semibold text-2xl">
//   Repair ID: <span className="font-semibold">#{booking.id}</span>
// </h3>

// <p className="text-lg font-normal text-black">
//   {`${booking.brand} ${booking.model}`.trim()}
// </p>
// </div>

// {/* Status */}
// <div className="flex justify-center items-center gap-2 mt-3">
//   <p className="text-sm text-[#535353]">Status:</p>

// <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
//   {booking.status}
// </span>
// </div>

// <p className="text-sm text-center text-[#7A7A7A] mt-2">
//   Last Updated: Today, 2:42 PM
// </p>

// {/* Timeline */}
// <div className="mt-10">
//   {/* Optional image */}
//   {booking.damagedDeviceImageUrl && (
//     <div className="mb-10 flex justify-center">
//       <img
//         src={booking.damagedDeviceImageUrl}
//         alt="Damaged device"
//         className="w-56 h-56 object-cover rounded-xl border"
//       />
//     </div>
//   )}

//   {/* Steps */}
//   {/* {stepsData.map((step, index) => {
//     const isCompleted = index <= completedStep;
//     const timestamp = booking.timeline?.[index];

//     return (
//       <div key={index} className="flex items-start gap-8 mb-8 p-3 rounded-lg">
//         {/* LEFT */}
//         <div className="relative flex flex-col items-center">
//           <span className="z-10 bg-white p-0.5 rounded-full">
//             {isCompleted ? (
//               <CheckCircle2 className="text-[#3E83C4] w-6 h-6" />
//             ) : (
//               <Circle className="text-[#656565] w-6 h-6" />
//             )}
//           </span>

//           {index !== stepsData.length - 1 && (
//             <span className="w-px h-[72px] bg-blue-300 absolute top-7" />
//           )}
//         </div>

//         {/* CENTER */}
//         <div className="flex-1">
//           <p className={`font-medium ${isCompleted ? "text-[#3E83C4]" : "text-gray-600"}`}>
//             {step}
//           </p>
//           <p className="text-xs text-[#656565] mt-1">
//             {[
//               "Repair request accepted",
//               "Dropped off with technician",
//               "Technician working…",
//               "Repair done, awaiting pick-up",
//               "Service completed",
//             ][index]}
//           </p>
//         </div>

//         {/* RIGHT */}
//         <div className="w-32 text-[11px] text-gray-400 text-right pt-1">
//           {timestamp?.date && timestamp?.time ? (
//             <>
//               <p>{timestamp.date}</p>
//               <p>{timestamp.time}</p>
//             </>
//           ) : null}
//         </div>
//       </div>
//     );
//   })} */}
// </div>


//         {/* Bottom Buttons */}
//         {/* <div className="flex flex-col gap-3 items-center mt-10"> */}
//         <div className="flex flex-col gap-4 items-center mt-14">

//           <button 
//             onClick={() => setShowRateModal(true)}
//             className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#3e83c4] transition-colors cursor-pointer"
//           >
//             Rate Service
//           </button>
//           <button 
//             onClick={() => setShowCancelModal(true)}
//             className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
//           >
//             Cancel Request
//           </button>
//         </div>
//       </div>
//     </div>
//     </section>
//   );
// };

// export default TrackRepair;
     


import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getOrderById } from "../../api/order.api";

const stepsData = [
  "Request Received",
  "Device Drop-off",
  "Repair in Progress",
  "Ready for Pick-up",
  "Completed",
];

const statusToStep = (status) => {
  const s = String(status || "").toUpperCase();

  // from your backend notes
  if (s === "PENDING_ARTISAN_RESPONSE") return 0;
  if (s === "ACCEPTED") return 1;
  if (s === "IN_PROGRESS") return 2;
  if (s === "WORK_COMPLETED") return 3;
  if (s === "COMPLETED") return 4;

  // fallback
  return 0;
};

const TrackRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const artisan = location.state?.artisan;

  // ✅ orderId is the source of truth
  const orderIdFromState = location.state?.orderId;
  const orderIdFromStorage = localStorage.getItem("fixserv_last_order_id");
  const orderId = orderIdFromState || orderIdFromStorage;

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [completedStep, setCompletedStep] = useState(0);

  useEffect(() => {
    const run = async () => {
      if (!orderId) return;

      try {
        setOrderError("");
        setLoadingOrder(true);

        const data = await getOrderById(orderId);

        setOrder(data);
        setCompletedStep(statusToStep(data?.status));
      } catch (e) {
        setOrder(null);
        setOrderError(e?.message || "Failed to load booking");
      } finally {
        setLoadingOrder(false);
      }
    };

    run();
  }, [orderId]);

  // ✅ Adapt backend order -> UI booking object
  const booking = useMemo(() => {
    if (!order) return null;

    const createdAt = order.createdAt ? new Date(order.createdAt) : null;

    const createdDate = createdAt
      ? createdAt.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : null;

    const createdTime = createdAt
      ? createdAt.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    // we saved this during upload (since order fetch may not include image)
    const fallbackImageUrl =
      localStorage.getItem("fixserv_last_uploaded_image_url") || "";

    return {
      id: order.id,
      status: order.status || "Pending",
      currentStep: statusToStep(order.status),
      timeline: [
        createdDate && createdTime ? { date: createdDate, time: createdTime } : null,
        null,
        null,
        null,
        null,
      ],
      // map order fields -> what your UI expects
      brand: order.deviceBrand || "",
      model: order.deviceModel || "",
      damagedDeviceImageUrl: order.damagedDeviceImageUrl || fallbackImageUrl,
    };
  }, [order]);

  // ✅ UI guards
  if (!orderId) {
    return (
      <div className="py-20 text-center text-gray-500">
        No orderId found. Please start again.
      </div>
    );
  }

  if (loadingOrder) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading repair details...
      </div>
    );
  }

  if (orderError || !booking) {
    return (
      <div className="py-20 text-center text-gray-500">
        {orderError || "Repair details not found."}
      </div>
    );
  }

  return (
    <section className="w-full py-14 overflow-hidden bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Top Row */}
        <div className="relative mb-12">
          <div className="absolute left-0 top-0">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[#3E83C4] hover:underline"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-black font-semibold text-xl">Track Your Repair</h2>
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
            {`${booking.brand} ${booking.model}`.trim()}
          </p>
        </div>

        {/* Status */}
        <div className="flex justify-center items-center gap-2 mt-3">
          <p className="text-sm text-[#535353]">Status:</p>
          <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
            {booking.status}
          </span>
        </div>

        {/* Timeline */}
        <div className="mt-10">
          {booking.damagedDeviceImageUrl && (
            <div className="mb-10 flex justify-center">
              <img
                src={booking.damagedDeviceImageUrl}
                alt="Damaged device"
                className="w-56 h-56 object-cover rounded-xl border"
              />
            </div>
          )}

          {stepsData.map((step, index) => {
            const isCompleted = index <= completedStep;
            const timestamp = booking.timeline?.[index];

            return (
              <div
                key={index}
                className="flex items-start gap-8 mb-8 p-3 rounded-lg"
              >
                <div className="relative flex flex-col items-center">
                  <span className="z-10 bg-white p-0.5 rounded-full">
                    {isCompleted ? (
                      <CheckCircle2 className="text-[#3E83C4] w-6 h-6" />
                    ) : (
                      <Circle className="text-[#656565] w-6 h-6" />
                    )}
                  </span>

                  {index !== stepsData.length - 1 && (
                    <span className="w-px h-[72px] bg-blue-300 absolute top-7" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      isCompleted ? "text-[#3E83C4]" : "text-gray-600"
                    }`}
                  >
                    {step}
                  </p>
                </div>

                <div className="w-32 text-[11px] text-gray-400 text-right pt-1">
                  {timestamp?.date && timestamp?.time ? (
                    <>
                      <p>{timestamp.date}</p>
                      <p>{timestamp.time}</p>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* you can use artisan if you want later */}
        {/* <pre>{JSON.stringify(artisan, null, 2)}</pre> */}
      </div>
    </section>
  );
};

export default TrackRepair;