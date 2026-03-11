import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import caution from "../../assets/client images/caution.png";
import success from "../../assets/client images/client-home/success.png";

const stepsData = [
  "Request Received",
  "Device Drop-off",
  "Repair in Progress",
  "Ready for Pick-up",
  "Completed",
];

const stepDescriptions = [
  "Your repair request has been received",
  "Device has been dropped off with the technician",
  "Technician is currently working on the device",
  "Repair is complete and awaiting pick-up",
  "Service has been completed",
];

const formatDateTimeParts = (value) => {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return {
    date: d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const formatLastUpdated = (value) => {
  if (!value) return "—";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStepIndexFromStatus = (status) => {
  const value = String(status || "").toUpperCase().trim();

  if (value === "PENDING_ARTISAN_RESPONSE") return 0;
  if (value === "ACCEPTED") return 1;
  if (value === "IN_PROGRESS") return 2;
  if (value === "READY_FOR_PICKUP" || value === "READY_FOR_PICK_UP") return 3;
  if (value === "COMPLETED") return 4;
  if (value === "CANCELLED") return 0;

  return 0;
};

const getStatusBadge = (progress) => {
  const value = String(progress || "").toLowerCase();

  if (value.includes("completed")) {
    return "bg-green-100 text-green-600";
  }

  if (value.includes("cancel")) {
    return "bg-red-100 text-red-600";
  }

  if (value.includes("progress") || value.includes("pending") || value.includes("accepted")) {
    return "bg-[#F6E4C7] text-[#F99F10]";
  }

  return "bg-gray-100 text-gray-600";
};

const ViewTrackRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const repair = location.state?.repair || null;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const completedStep = useMemo(() => {
    return getStepIndexFromStatus(repair?.orderStatus || repair?.raw?.status || repair?.progress);
  }, [repair]);

  const timestamps = useMemo(() => {
    const createdAt = repair?.createdAt || repair?.raw?.createdAt || null;
    const deadline = repair?.artisanResponseDeadline || repair?.raw?.artisanResponseDeadline || null;

    return stepsData.map((_, index) => {
      if (index === 0) return formatDateTimeParts(createdAt);
      if (index === 1 && completedStep >= 1) return formatDateTimeParts(deadline || createdAt);
      if (index === 2 && completedStep >= 2) return formatDateTimeParts(deadline || createdAt);
      if (index === 3 && completedStep >= 3) return formatDateTimeParts(deadline || createdAt);
      if (index === 4 && completedStep >= 4) return formatDateTimeParts(deadline || createdAt);
      return null;
    });
  }, [repair, completedStep]);

  useEffect(() => {
    if (showCancelSuccess) {
      const timer = setTimeout(() => {
        setShowCancelSuccess(false);
        navigate(-1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showCancelSuccess, navigate]);

  const handleCancelReasonSelect = (reason) => {
    setCancelReason(reason);
  };

  const handleSubmitCancel = () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation");
      return;
    }

    if (cancelReason === "Other (please specify)" && !otherReason.trim()) {
      alert("Please specify your reason");
      return;
    }

    setShowCancelModal(false);
    setShowCancelSuccess(true);
  };

  if (!repair) {
    return (
      <section className="w-full py-14 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[#3E83C4] hover:underline cursor-pointer mb-8"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-black mb-3">
              No repair tracking details found
            </h2>
            <p className="text-sm text-[#6B6B6B] mb-6">
              Please go back and open a repair from your history or summary page.
            </p>
            <button
              onClick={() => navigate("/client/repair")}
              className="bg-[#3E83C4] text-white px-6 py-3 rounded-lg hover:bg-[#2d75b8] transition cursor-pointer"
            >
              Go to Repair History
            </button>
          </div>
        </div>
      </section>
    );
  }

  const repairTitle = [repair.deviceBrand, repair.deviceModel]
    .filter(Boolean)
    .join(" - ") || repair.deviceType || repair.serviceRequired || "Device Repair";

  const currentStatus = repair.progress || "Pending";
  const rawStatus = repair.orderStatus || repair.raw?.status || "—";
  const lastUpdated = repair.artisanResponseDeadline || repair.createdAt || repair.raw?.updatedAt || repair.raw?.createdAt;

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
                className="w-full bg-red-200 text-red-600 py-3 rounded-lg font-medium hover:bg-red-300 transition mb-3 cursor-pointer"
              >
                Yes, Cancel Repair
              </button>

              <button
                onClick={() => setShowCancelConfirm(false)}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
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
                      onChange={(e) => handleCancelReasonSelect(e.target.value)}
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
                  rows={3}
                />
              )}

              <button
                onClick={handleSubmitCancel}
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
              <img src={success} alt="success" className="w-14 h-14 mx-auto mb-5" />

              <p className="text-base font-medium text-black">
                Your repair request has been cancelled successfully
              </p>
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            showCancelModal || showCancelSuccess || showCancelConfirm
              ? "blur-sm"
              : ""
          }`}
        >
          <div className="relative mb-12">
            <div className="absolute left-0 top-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-[#3E83C4] hover:underline cursor-pointer"
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
              Repair ID: <span className="font-semibold">{repair.id}</span>
            </h3>

            <p className="text-lg font-normal text-black">
              {repairTitle}
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 mt-3">
            <p className="text-sm text-[#535353]">Status:</p>

            <span
              className={`text-xs px-3 py-[2px] rounded-full ${getStatusBadge(currentStatus)}`}
            >
              {currentStatus}
            </span>
          </div>

          <p className="text-sm text-center text-[#7A7A7A] mt-2">
            Last Updated: {formatLastUpdated(lastUpdated)}
          </p>

          <div className="mt-3 text-center">
            <p className="text-xs text-[#7A7A7A]">
              Backend Status: {rawStatus}
            </p>
          </div>

          <div className="mt-10">
            {stepsData.map((step, index) => {
              const isCompleted = index <= completedStep;
              const timestamp = timestamps[index];

              return (
                <div
                  key={step}
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
                      <span
                        className={`w-px h-[72px] absolute top-7 ${
                          index < completedStep ? "bg-blue-300" : "bg-gray-300"
                        }`}
                      />
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

                    <p className="text-xs text-[#656565] mt-1">
                      {stepDescriptions[index]}
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
              onClick={() => navigate("/client/rate-service", { state: { repair } })}
              className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg w-40 hover:bg-[#2d75b8] transition-colors cursor-pointer"
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

export default ViewTrackRepair;