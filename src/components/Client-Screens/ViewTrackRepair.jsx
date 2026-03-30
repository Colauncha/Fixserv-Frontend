import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ArrowLeft, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cancelOrderByClient,
  releasePaymentToArtisan,
} from "../../api/order.api";
import caution from "../../assets/client images/caution.png";
import success from "../../assets/client images/client-home/success.png";

const stepsData = [
  "Request Received",
  "Device Drop-off",
  "Repair in Progress",
  "Completed",
  "Ready for Pick-up",
];

const stepDescriptions = [
  "Your repair request has been received",
  "Device has been dropped off with the technician",
  "Technician is currently working on the device",
  "Service has been completed",
  "Repair is complete and awaiting pick-up",
];

const rejectedStepsData = [
  "Request Received",
  "Request Rejected",
];

const rejectedStepDescriptions = [
  "Your repair request has been received",
  "Your request was rejected by the technician",
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

const pickValue = (...values) => {
  for (const value of values) {
    if (Array.isArray(value)) {
      if (value.length > 0) return value;
      continue;
    }

    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value;

    const text = String(value ?? "").trim();

    if (
      text &&
      text !== "—" &&
      text.toLowerCase() !== "n/a" &&
      text.toLowerCase() !== "null" &&
      text.toLowerCase() !== "undefined" &&
      !/^-+$/.test(text)
    ) {
      return value;
    }
  }

  return "";
};

const normalizeProgressText = (status) => {
  const value = String(status || "").toUpperCase().trim();

  if (value === "PENDING_ARTISAN_RESPONSE") return "Pending Artisan Response";
  if (value === "REQUESTED") return "Request Received";
  if (value === "NEW") return "Request Received";
  if (value === "ACCEPTED") return "Accepted";
  if (value === "DEVICE_DROPPED_OFF") return "Device Dropped Off";
  if (value === "IN_PROGRESS") return "In Progress";
  if (value === "ONGOING") return "In Progress";
  if (value === "AVAILABLE") return "In Progress";
  if (value === "READY_FOR_PICKUP") return "Ready for Pick-up";
  if (value === "READY_FOR_PICK_UP") return "Ready for Pick-up";
  if (value === "WORK_COMPLETED") return "Completed";
  if (value === "COMPLETED") return "Completed";
  if (value === "DONE") return "Completed";
  if (value === "CANCELLED") return "Cancelled";
  if (value === "REJECTED") return "Rejected";

  return value.replace(/_/g, " ") || "Pending";
};

const getStepIndexFromStatus = (status) => {
  const value = String(status || "").toUpperCase().trim();

  if (["PENDING_ARTISAN_RESPONSE", "REQUESTED", "NEW"].includes(value)) return 0;
  if (["ACCEPTED", "DEVICE_DROPPED_OFF"].includes(value)) return 1;
  if (["IN_PROGRESS", "ONGOING", "AVAILABLE"].includes(value)) return 2;
  if (["READY_FOR_PICKUP", "READY_FOR_PICK_UP"].includes(value)) return 3;
  if (["WORK_COMPLETED", "COMPLETED", "DONE"].includes(value)) return 4;
  if (["CANCELLED", "REJECTED"].includes(value)) return 0;

  return 0;
};

const getStatusBadge = (progress) => {
  const value = String(progress || "").toLowerCase();

  if (value.includes("completed")) {
    return "bg-green-100 text-green-600";
  }

  if (value.includes("cancel") || value.includes("reject")) {
    return "bg-red-100 text-red-600";
  }

  if (
    value.includes("progress") ||
    value.includes("pending") ||
    value.includes("accepted") ||
    value.includes("request") ||
    value.includes("pick-up") ||
    value.includes("drop")
  ) {
    return "bg-[#F6E4C7] text-[#F99F10]";
  }

  return "bg-gray-100 text-gray-600";
};

const ViewTrackRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const repair = location.state?.repair || null;
  const raw = repair?.raw || {};

  const rawUploadedProduct = Array.isArray(raw?.uploadedProducts)
    ? raw.uploadedProducts[0]
    : raw?.uploadedProduct || null;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [cancelEmail, setCancelEmail] = useState("");
  const [cancelPassword, setCancelPassword] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState(false);

  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [releasingPayment, setReleasingPayment] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("fixserv_user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (storedUser?.email) {
      setCancelEmail(storedUser.email);
    }
  }, [storedUser?.email]);

  const booking = useMemo(() => {
    return {
      id: pickValue(repair?.id, raw?.id),

      brand: pickValue(
        repair?.deviceBrand,
        repair?.brand,
        raw?.deviceBrand,
        raw?.brand
      ),

      model: pickValue(
        repair?.deviceModel,
        repair?.model,
        raw?.deviceModel,
        raw?.model
      ),

      deviceType: pickValue(repair?.deviceType, raw?.deviceType),

      serviceRequired: pickValue(
        repair?.serviceRequired,
        raw?.serviceRequired,
        raw?.service?.title
      ),

      objectName: pickValue(
        repair?.objectName,
        raw?.objectName,
        rawUploadedProduct?.objectName
      ),

      progress: pickValue(
        repair?.progress,
        repair?.orderStatus,
        raw?.status,
        raw?.orderStatus
      ),

      createdAt: pickValue(repair?.createdAt, raw?.createdAt),

      updatedAt: pickValue(
        repair?.updatedAt,
        raw?.updatedAt,
        raw?.completedAt,
        raw?.readyForPickupAt,
        raw?.inProgressAt
      ),

      artisanResponseDeadline: pickValue(
        repair?.artisanResponseDeadline,
        raw?.artisanResponseDeadline
      ),

      paymentReleased:
        raw?.paymentReleased ||
        raw?.isPaymentReleased ||
        raw?.released ||
        raw?.paymentStatus === "RELEASED" ||
        repair?.paymentReleased ||
        repair?.isPaymentReleased ||
        false,
    };
  }, [repair, raw, rawUploadedProduct]);

  const backendStatus = useMemo(() => {
  return pickValue(
    repair?.orderStatus,
    raw?.status,
    raw?.orderStatus,
    repair?.progress
  );
}, [repair, raw]);

const normalizedBackendStatus = String(backendStatus || "")
  .toUpperCase()
  .trim();

const isRejected = normalizedBackendStatus === "REJECTED";

const currentStatus = useMemo(() => {
  if (repair?.progress && repair.progress !== "—") return repair.progress;
  return normalizeProgressText(backendStatus);
}, [repair, backendStatus]);

const activeSteps = isRejected ? rejectedStepsData : stepsData;
const activeDescriptions = isRejected
  ? rejectedStepDescriptions
  : stepDescriptions;

const completedStep = useMemo(() => {
  if (isRejected) return 1;
  return getStepIndexFromStatus(backendStatus);
}, [backendStatus, isRejected]);


const timestamps = useMemo(() => {
  const createdAt = booking.createdAt || null;
  const updatedAt =
    booking.updatedAt ||
    booking.artisanResponseDeadline ||
    booking.createdAt ||
    null;

  return activeSteps.map((_, index) => {
    if (index === 0) return formatDateTimeParts(createdAt);
    if (index <= completedStep) return formatDateTimeParts(updatedAt);
    return null;
  });
}, [booking, completedStep, activeSteps]);


  const repairTitle = useMemo(() => {
    return (
      `${booking.brand || ""} ${booking.model || ""}`.trim() ||
      booking.serviceRequired ||
      booking.objectName ||
      booking.deviceType ||
      "Device repair"
    );
  }, [booking]);

  const lastUpdated = useMemo(() => {
    return (
      booking.updatedAt ||
      booking.artisanResponseDeadline ||
      booking.createdAt ||
      null
    );
  }, [booking]);

  // const normalizedBackendStatus = String(backendStatus || "")
  //   .toUpperCase()
  //   .trim();

  const canCancelOrder = ["PENDING_ARTISAN_RESPONSE", "ACCEPTED"].includes(
    normalizedBackendStatus
  );

const backendPaymentReleased =
  raw?.paymentReleased === true ||
  raw?.isPaymentReleased === true ||
  raw?.released === true ||
  String(raw?.paymentStatus || "").toUpperCase() === "RELEASED" ||
  String(raw?.escrowStatus || "").toUpperCase() === "RELEASED" ||
  repair?.paymentReleased === true ||
  repair?.isPaymentReleased === true ||
  repair?.released === true ||
  String(repair?.paymentStatus || "").toUpperCase() === "RELEASED" ||
  String(repair?.escrowStatus || "").toUpperCase() === "RELEASED" ||
  booking?.paymentReleased === true;

const effectivePaymentReleased = backendPaymentReleased || paymentReleased;

const canReleasePayment =
  normalizedBackendStatus === "WORK_COMPLETED" && !effectivePaymentReleased;

  useEffect(() => {
    if (showCancelSuccess) {
      const timer = setTimeout(() => {
        setShowCancelSuccess(false);
        navigate("/client", { replace: true });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showCancelSuccess, navigate]);

  useEffect(() => {
    if (
      showCancelConfirm ||
      showCancelModal ||
      showCancelSuccess ||
      showReleaseConfirm
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    showCancelConfirm,
    showCancelModal,
    showCancelSuccess,
    showReleaseConfirm,
  ]);

  const handleCancelReasonSelect = (reason) => {
    setCancelReason(reason);
  };

  const handleSubmitCancel = async () => {
    try {
      const orderId = raw?.id || repair?.id || booking?.id;

      if (!orderId) {
        alert("Order ID not found");
        return;
      }

      if (!cancelReason) {
        alert("Please select a reason for cancellation");
        return;
      }

      if (cancelReason === "Other (please specify)" && !otherReason.trim()) {
        alert("Please specify your reason");
        return;
      }

      if (!cancelEmail.trim()) {
        alert("Email is required");
        return;
      }

      if (!cancelPassword.trim()) {
        alert("Password is required");
        return;
      }

      setCancellingOrder(true);

      await cancelOrderByClient(orderId, {
        email: cancelEmail.trim(),
        password: cancelPassword,
      });

      setShowCancelModal(false);
      setShowCancelSuccess(true);
      setCancelPassword("");
    } catch (error) {
      console.error("CANCEL ORDER ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel repair request"
      );
    } finally {
      setCancellingOrder(false);
    }
  };

  const handleReleasePayment = async () => {
    try {
      const orderId = raw?.id || repair?.id || booking?.id;

      if (!orderId) {
        alert("Order ID not found");
        return;
      }

      setReleasingPayment(true);

      const res = await releasePaymentToArtisan(orderId);

      alert(res?.message || "Payment released successfully");

setPaymentReleased(true);
setShowReleaseConfirm(false);

navigate("/client", {
  replace: true,
  state: {
    repair: {
      ...repair,
      paymentReleased: true,
      isPaymentReleased: true,
      paymentStatus: "RELEASED",
      raw: {
        ...raw,
        paymentReleased: true,
        isPaymentReleased: true,
        paymentStatus: "RELEASED",
      },
    },
  },
});
    } catch (error) {
      console.error("RELEASE PAYMENT ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to release payment"
      );
    } finally {
      setReleasingPayment(false);
    }
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

  return (
    <section className="w-full py-14 overflow-hidden bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {(showCancelConfirm ||
          showCancelModal ||
          showCancelSuccess ||
          showReleaseConfirm) && (
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
                  if (cancellingOrder) return;
                  setShowCancelModal(false);
                  setCancelReason("");
                  setOtherReason("");
                  setCancelPassword("");
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={cancelEmail}
                  onChange={(e) => setCancelEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm outline-none"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={cancelPassword}
                  onChange={(e) => setCancelPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm outline-none"
                />
              </div>

              <button
                onClick={handleSubmitCancel}
                disabled={cancellingOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 rounded-md transition cursor-pointer mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cancellingOrder ? "Cancelling..." : "Cancel Repair"}
              </button>

              <button
                onClick={() => {
                  if (cancellingOrder) return;
                  setShowCancelModal(false);
                  setCancelPassword("");
                }}
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

        {showReleaseConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertTriangle className="text-yellow-600 w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-3">
                Confirm Before Releasing Funds
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Confirm your item is working, the stated repair is properly fixed, and your item is in good condition before you continue.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleReleasePayment}
                  disabled={releasingPayment}
                  className="px-5 py-2 bg-[#3E83C4] text-white rounded-lg text-sm hover:bg-[#2f6fa5] transition disabled:opacity-70"
                >
                  {releasingPayment ? "Processing..." : "Continue"}
                </button>

                <button
                  onClick={() => setShowReleaseConfirm(false)}
                  disabled={releasingPayment}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            showCancelModal ||
            showCancelSuccess ||
            showCancelConfirm ||
            showReleaseConfirm
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
              Repair ID: <span className="font-semibold">{booking.id || "—"}</span>
            </h3>

            <p className="text-lg font-normal text-black">{repairTitle}</p>
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

          {/* <div className="mt-3 text-center">
            <p className="text-xs text-[#7A7A7A]">
              Backend Status: {backendStatus || "—"}
            </p>
          </div> */}

          <div className="mt-10">
            {activeSteps.map((step, index) => {
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

                    {index !== activeSteps.length - 1 && (
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
                     {activeDescriptions[index]}
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
  {(completedStep === 4 || canReleasePayment || effectivePaymentReleased) && (
    <div className="flex flex-wrap justify-center gap-4">
      {completedStep === 4 && (
        <button
          onClick={() =>
            navigate("/client/rate-service", {
              state: { repair },
            })
          }
          className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg min-w-[160px] hover:bg-[#2d75b8] transition-colors cursor-pointer"
        >
          Rate Service
        </button>
      )}

      {canReleasePayment && (
        <button
          onClick={() => setShowReleaseConfirm(true)}
          disabled={releasingPayment}
          className="bg-[#3E83C4] text-white px-6 py-2 rounded-lg min-w-[160px] hover:bg-[#2d75b8] transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {releasingPayment ? "Processing..." : "Release Payment"}
        </button>
      )}

      {effectivePaymentReleased && (
        <button
          disabled
          className="bg-gray-300 text-gray-600 px-6 py-2 rounded-lg min-w-[160px] cursor-not-allowed"
        >
          Payment Released
        </button>
      )}
    </div>
  )}

  {canCancelOrder && (
    <button
      onClick={() => setShowCancelConfirm(true)}
      className="text-red-600 text-sm hover:text-red-700 transition-colors cursor-pointer"
    >
      Cancel Request
    </button>
  )}
</div>
        </div>
      </div>
    </section>
  );
};

export default ViewTrackRepair;