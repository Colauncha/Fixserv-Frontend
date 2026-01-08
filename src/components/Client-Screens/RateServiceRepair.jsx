// import React, { useState, useEffect } from "react";
// import { CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import caution from "../../assets/client images/caution.png";
// import failure from "../../assets/client images/client-home/cancel.png";
// import success from "../../assets/client images/client-home/success.png";


// const stepsData = [
//   "Request Received",
//   "Device Drop-off",
//   "Repair in Progress",
//   "Ready for Pick-up",
//   "Completed",
// ];

// const RateServiceRepair = () => {
//       const [completedStep, setCompletedStep] = useState(1);
//       const [timestamps, setTimestamps] = useState(
//         stepsData.map(() => null)
//       );
      
//       // Modal states
//       const [showCancelModal, setShowCancelModal] = useState(false);
//     //   const [showRateModal, setShowRateModal] = useState(false);
//       const [showCancelSuccess, setShowCancelSuccess] = useState(false);

//       const [showCancelConfirm, setShowCancelConfirm] = useState(false); 

      
//       // Cancel reason state
//       const [cancelReason, setCancelReason] = useState("");
//       const [otherReason, setOtherReason] = useState("");
    
//       const formatDateTime = () => {
//         const now = new Date();
//         const date = now.toLocaleDateString(undefined, {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         });
//         const time = now.toLocaleTimeString(undefined, {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         return { date, time };
//       };
    
//       const updateProgress = (stepIndex) => {
//         setCompletedStep(stepIndex);
//         setTimestamps((prev) =>
//           prev.map((ts, i) =>
//             i <= stepIndex ? ts || formatDateTime() : null
//           )
//         );
//       };
    
//       const handleCancelReasonSelect = (reason) => {
//         setCancelReason(reason);
//       };
    


    
//       const navigate = useNavigate();

//       useEffect(() => {
//   if (showCancelSuccess) {
//     const timer = setTimeout(() => {
//       setShowCancelSuccess(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }
// }, [showCancelSuccess]);

    

//   return (
//    <section className="w-full py-14 overflow-hidden bg-white relative">
//   <div className="max-w-7xl mx-auto px-6 md:px-10">

//       {/* Blur backdrop when any modal is open */}
//      {/* {(showCancelConfirm || showCancelModal || showRateModal || showCancelSuccess) && ( */}
//      {(showCancelConfirm || showCancelModal || showCancelSuccess) && (
//   <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>
// )}

// {showCancelConfirm && (
//   <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//     <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">

//       <img src={caution} alt="warning" className="mx-auto mb-4 w-12 h-12" />

//       <h3 className="text-lg font-bold text-gray-900 mb-2">
//         Cancel Repair?
//       </h3>

//       <p className="text-gray-600 text-sm mb-6">
//         Cancelling a repair in progress may result in partial charges depending
//         on the technician’s effort so far.
//       </p>

//       <button
//         onClick={() => {
//           setShowCancelConfirm(false);
//           setShowCancelModal(true); // 👉 OPEN SECOND MODAL
//         }}
//         className="w-full bg-red-200 text-red-600 py-3 rounded-lg font-medium hover:bg-red-300 transition mb-3"
//       >
//         Yes, Cancel Repair
//       </button>

//       <button
//         onClick={() => setShowCancelConfirm(false)}
//         className="text-sm text-blue-600 hover:underline"
//       >
//         Go Back
//       </button>
//     </div>
//   </div>
// )}

// {showCancelModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
//     <div className="bg-white w-full max-w-[420px] rounded-xl shadow-xl p-8 relative">

//       {/* Close */}
//       <button
//         onClick={() => {
//           setShowCancelModal(false);
//           setCancelReason("");
//           setOtherReason("");
//         }}
//         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
//       >
//         ✕
//       </button>

//       {/* Title */}
//       <h3 className="text-lg font-semibold text-black mb-2">
//         Cancel Repair Request?
//       </h3>

//       <p className="text-sm text-[#535353] mb-5">
//         We're sorry to see you cancel this request. Please tell us why so we can improve your experience.
//       </p>

//       <p className="text-sm font-medium text-black mb-3">
//         Why do you want to cancel?
//       </p>

//       {/* Reasons */}
//       <div className="space-y-3 mb-6">
//         {[
//           "Technician hasn't responded",
//           "Found another repair option",
//           "Took too long to get a quote",
//           "Decided not to fix the device",
//           "Issue was resolved elsewhere",
//           "Other (please specify)"
//         ].map((reason) => (
//           <label
//             key={reason}
//             className="flex items-center gap-3 text-sm text-[#535353] cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="cancelReason"
//               value={reason}
//               checked={cancelReason === reason}
//               onChange={(e) => handleCancelReasonSelect(e.target.value)}
//               className="accent-[#3E83C4]"
//             />
//             {reason}
//           </label>
//         ))}
//       </div>

//       {cancelReason === "Other (please specify)" && (
//         <textarea
//           value={otherReason}
//           onChange={(e) => setOtherReason(e.target.value)}
//           placeholder="Please specify your reason..."
//           className="w-full border border-gray-300 rounded-md p-3 text-sm mb-5 outline-none"
//           rows="3"
//         />
//       )}

//       {/* Actions */}
//       <button
//         onClick={() => {
//           setShowCancelModal(false);
//           setShowCancelSuccess(true);
//         }}
//         className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-md transition cursor-pointer mb-3"
//       >
//         Cancel Repair
//       </button>

//       <button
//         onClick={() => setShowCancelModal(false)}
//         className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
//       >
//         Go Back
//       </button>
//     </div>
//   </div>
// )}

// {showCancelSuccess && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
//     <div className="bg-white w-full max-w-[420px] rounded-xl shadow-xl p-10 text-center">

//       <div className="w-14 h-14 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-5">
//         <span className="text-white text-2xl">✓</span>
//         <img src={success} alt="" />
//       </div>

//       <p className="text-base font-medium text-black">
//         Your repair request has been cancelled successfully
//       </p>
//     </div>
//   </div>
// )}     

//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${
//         (showCancelModal || showCancelSuccess) ? 'blur-sm' : ''
//         // (showCancelModal || showRateModal || showCancelSuccess) ? 'blur-sm' : ''
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
//     Repair ID: <span className="font-semibold">#FX2341</span>
//   </h3>

//   <p className="text-lg font-normal text-black">
//     iPhone 12 Pro - Black
//   </p>
// </div>

// {/* Status */}
// <div className="flex justify-center items-center gap-2 mt-3">
//   <p className="text-sm text-[#535353]">Status:</p>

//   <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
//     In progress
//   </span>
// </div>

// <p className="text-sm text-center text-[#7A7A7A] mt-2">
//   Last Updated: Today, 2:42 PM
// </p>



//         {/* Timeline */}
//         <div className="mt-10">
//           {stepsData.map((step, index) => {
//             const isCompleted = index <= completedStep;
//             const timestamp = timestamps[index];

//             return (
//               <div
//                 key={index}
//                 onClick={() => updateProgress(index)}
//                 // className="flex items-start gap-6 mb-10 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
//                 className="flex items-start gap-8 mb-8 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"

//               >
//                 {/* LEFT: Line & Icon */}
//                 <div className="relative flex flex-col items-center">
//                   {/* <span className="z-10 bg-white"> */}
//                   <span className="z-10 bg-white p-0.5 rounded-full">
//                     {isCompleted ? (
//                       <CheckCircle2 className="text-[#3E83C4] w-6 h-6" />
//                     ) : (
//                       <Circle className="text-[#656565] w-6 h-6" />
//                     )}
//                   </span>

//                   {index !== stepsData.length - 1 && (
//                     // <span className="w-px h-full bg-blue-300 absolute top-6" />
//                     <span className="w-px h-[72px] bg-blue-300 absolute top-7" />

//                   )}
//                 </div>

//                 {/* CENTER: Step Content */}
//                 <div className="flex-1">
//                   {/* <p
//                     className={`font-semibold ${
//                       isCompleted ? "text-blue-700" : "text-gray-500"
//                     }`}
                    
//                   > */}
//                   <p className={`font-medium ${isCompleted ? "text-[#3E83C4]" : "text-gray-600"}`}>

//                     {step}
//                   </p>

//                   {/* <p className="text-sm text-gray-500"> */}
//                   <p className="text-xs text-[#656565] mt-1">

//                     {[
//                       "Repair request accepted",
//                       "Dropped off with technician",
//                       "Technician working…",
//                       "Repair done, awaiting pick-up",
//                       "Service completed",
//                     ][index]}
//                   </p>
//                 </div>

//                 {/* RIGHT: Date & Time */}
//                 {/* <div className="w-28 text-xs text-gray-400 text-right leading-tight"> */}
//                 <div className="w-32 text-[11px] text-gray-400 text-right leading-tight pt-1">

//                   {timestamp && (
//                     <>
//                       <p>{timestamp.date}</p>
//                       <p>{timestamp.time}</p>
//                     </>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Bottom Buttons */}
//         {/* <div className="flex flex-col gap-3 items-center mt-10"> */}
//         <div className="flex flex-col gap-4 items-center mt-14">

//           <button 
//             onClick={() => setShowRateModal(true)}
//             className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#3e83c4] transition-colors cursor-pointer"
//           >
//             Rate Service
//           </button>
//           {/* <button 
//             onClick={() => setShowCancelModal(true)}
//             className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
//           >
//             Cancel Request
//           </button> */}
//           <button 
//   onClick={() => setShowCancelConfirm(true)}
//   className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
// >
//   Cancel Request
// </button>

//         </div>
//       </div>
//     </div>
//     </section>
//   )
// }

// export default RateServiceRepair



import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import caution from "../../assets/client images/caution.png";
import failure from "../../assets/client images/client-home/cancel.png";
import success from "../../assets/client images/client-home/success.png";

const stepsData = [
  "Request Received",
  "Device Drop-off",
  "Repair in Progress",
  "Ready for Pick-up",
  "Completed",
];

const RateServiceRepair = () => {
  const [completedStep, setCompletedStep] = useState(1);
  const [timestamps, setTimestamps] = useState(stepsData.map(() => null));

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

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
      prev.map((ts, i) => (i <= stepIndex ? ts || formatDateTime() : null))
    );
  };

  const handleCancelReasonSelect = (reason) => {
    setCancelReason(reason);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (showCancelSuccess) {
      const timer = setTimeout(() => {
        setShowCancelSuccess(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showCancelSuccess]);

  return (
    <section className="w-full py-14 overflow-hidden bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {(showCancelConfirm || showCancelModal || showCancelSuccess) && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"></div>
        )}

        {showCancelConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">
              <img
                src={caution}
                alt="warning"
                className="mx-auto mb-4 w-12 h-12"
              />

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Cancel Repair?
              </h3>

              <p className="text-gray-600 text-sm mb-6">
                Cancelling a repair in progress may result in partial charges
                depending on the technician’s effort so far.
              </p>

              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  setShowCancelModal(true);
                }}
                className="w-full bg-red-200 text-red-600 py-3 rounded-lg font-medium hover:bg-red-300 transition mb-3"
              >
                Yes, Cancel Repair
              </button>

              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-sm text-blue-600 hover:underline"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-[420px] rounded-xl shadow-xl p-8 relative">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                  setOtherReason("");
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>

              <h3 className="text-lg font-semibold text-black mb-2">
                Cancel Repair Request?
              </h3>

              <p className="text-sm text-[#535353] mb-5">
                We're sorry to see you cancel this request. Please tell us why so
                we can improve your experience.
              </p>

              <p className="text-sm font-medium text-black mb-3">
                Why do you want to cancel?
              </p>

              <div className="space-y-3 mb-6">
                {[
                  "Technician hasn't responded",
                  "Found another repair option",
                  "Took too long to get a quote",
                  "Decided not to fix the device",
                  "Issue was resolved elsewhere",
                  "Other (please specify)",
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-3 text-sm text-[#535353] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) =>
                        handleCancelReasonSelect(e.target.value)
                      }
                      className="accent-[#3E83C4]"
                    />
                    {reason}
                  </label>
                ))}
              </div>

              {cancelReason === "Other (please specify)" && (
                <textarea
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please specify your reason..."
                  className="w-full border border-gray-300 rounded-md p-3 text-sm mb-5 outline-none"
                  rows="3"
                />
              )}

              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setShowCancelSuccess(true);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-md transition cursor-pointer mb-3"
              >
                Cancel Repair
              </button>

              <button
                onClick={() => setShowCancelModal(false)}
                className="w-full text-sm text-[#3E83C4] hover:underline cursor-pointer"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {showCancelSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-[420px] rounded-xl shadow-xl p-10 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-5">
                <span className="text-white text-2xl">✓</span>
                <img src={success} alt="" />
              </div>

              <p className="text-base font-medium text-black">
                Your repair request has been cancelled successfully
              </p>
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            showCancelModal || showCancelSuccess ? "blur-sm" : ""
          }`}
        >
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
              <h2 className="text-black font-semibold text-xl">
                Track Your Repair
              </h2>

              <p className="text-[#6B6B6B] text-sm mt-1">
                View your device status and repair progress in real time.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <h3 className="font-semibold text-2xl">
              Repair ID: <span className="font-semibold">#FX2341</span>
            </h3>

            <p className="text-lg font-normal text-black">
              iPhone 12 Pro - Black
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 mt-3">
            <p className="text-sm text-[#535353]">Status:</p>

            <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
              In progress
            </span>
          </div>

          <p className="text-sm text-center text-[#7A7A7A] mt-2">
            Last Updated: Today, 2:42 PM
          </p>

          <div className="mt-10">
            {stepsData.map((step, index) => {
              const isCompleted = index <= completedStep;
              const timestamp = timestamps[index];

              return (
                <div
                  key={index}
                  onClick={() => updateProgress(index)}
                  className="flex items-start gap-8 mb-8 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
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
                        isCompleted
                          ? "text-[#3E83C4]"
                          : "text-gray-600"
                      }`}
                    >
                      {step}
                    </p>

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

          <div className="flex flex-col gap-4 items-center mt-14">
            <button
              onClick={() => setShowRateModal(true)}
              className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#3e83c4] transition-colors cursor-pointer"
            >
              Rate Service
            </button>

            <button
              onClick={() => setShowCancelConfirm(true)}
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

export default RateServiceRepair;
