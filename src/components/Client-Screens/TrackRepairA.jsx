import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  getOrderById,
  releasePaymentToArtisan,
  cancelOrderByClient,
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

const rejectedStepsData = [
  "Request Received",
  "Request Rejected",
];

const statusToStep = (status) => {
  const s = String(status || "").toUpperCase();

  if (["PENDING_ARTISAN_RESPONSE", "PENDING", "REQUESTED", "NEW"].includes(s))
    return 0;
  if (["ACCEPTED", "DEVICE_DROPPED_OFF"].includes(s)) return 1;
  if (["IN_PROGRESS", "ONGOING", "AVAILABLE"].includes(s)) return 2;
  if (["WORK_COMPLETED", "READY_FOR_PICKUP"].includes(s)) return 3;
  if (["COMPLETED", "DONE"].includes(s)) return 4;

  return 0;
};

const statusToStepIndex = (status) => {
  const s = String(status || "").toUpperCase();

  if (["PENDING_ARTISAN_RESPONSE", "PENDING", "REQUESTED", "NEW"].includes(s))
    return 0;

  if (["REJECTED"].includes(s)) return 1;

  if (["ACCEPTED", "DEVICE_DROPPED_OFF"].includes(s)) return 1;
  if (["IN_PROGRESS", "ONGOING"].includes(s)) return 2;
  if (["WORK_COMPLETED", "READY_FOR_PICKUP"].includes(s)) return 3;
  if (["COMPLETED", "DONE"].includes(s)) return 4;

  return null;
};

const formatStatusLabel = (status) => {
  const s = String(status || "").toUpperCase();

  if (["PENDING_ARTISAN_RESPONSE", "PENDING", "REQUESTED", "NEW"].includes(s)) {
    return "Pending Artisan Response";
  }
  if (["ACCEPTED", "DEVICE_DROPPED_OFF"].includes(s)) {
    return "Accepted";
  }
  if (["IN_PROGRESS", "ONGOING", "AVAILABLE"].includes(s)) {
    return "In Progress";
  }
  if (["WORK_COMPLETED", "READY_FOR_PICKUP"].includes(s)) {
    return "Work Completed";
  }
  if (["COMPLETED", "DONE"].includes(s)) {
    return "Completed";
  }
  if (["REJECTED"].includes(s)) {
    return "Rejected";
  }
  if (["CANCELLED", "CANCELED"].includes(s)) {
    return "Cancelled";
  }

  return status || "Pending Artisan Response";
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

const TrackRepairA = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId: orderIdFromParams } = useParams();

  const artisan = location.state?.artisan || null;
  const bookingFromState = location.state?.booking || null;

  const shouldFetchLiveOrder = true;

  const orderIdFromState = location.state?.orderId;
  const orderIdFromStorage = localStorage.getItem("fixserv_last_order_id");
  const orderId = orderIdFromParams || orderIdFromState || orderIdFromStorage;

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [completedStep, setCompletedStep] = useState(0);
  const [enableLiveTracking, setEnableLiveTracking] = useState(true);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [releasingPayment, setReleasingPayment] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false);

const [showCancelModal, setShowCancelModal] = useState(false);
const [showCancelConfirm, setShowCancelConfirm] = useState(false);
const [showCancelSuccess, setShowCancelSuccess] = useState(false);

const [cancelReason, setCancelReason] = useState("");
const [otherReason, setOtherReason] = useState("");
const [cancelEmail, setCancelEmail] = useState("");
const [cancelPassword, setCancelPassword] = useState("");
const [cancellingOrder, setCancellingOrder] = useState(false);

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

  useEffect(() => {
    const run = async () => {
      if (!orderId || !enableLiveTracking) return;

      try {
        setOrderError("");
        setLoadingOrder(true);

        const data = await getOrderById(orderId);

        setOrder(data);
        setCompletedStep(statusToStep(data?.status));
      } catch (e) {
        console.error("TRACK ORDER ERROR:", e);
        setOrder(null);
        setOrderError(e?.message || "Failed to load booking");
        setCompletedStep(statusToStep("PENDING_ARTISAN_RESPONSE"));

        const status = e?.response?.status || e?.status || e?.statusCode;
        if (status === 400 || status === 404) {
          setEnableLiveTracking(false);
        }
      } finally {
        setLoadingOrder(false);
      }
    };

    run();
  }, [orderId, enableLiveTracking]);

  useEffect(() => {
    if (!orderId || !enableLiveTracking) return;

    const interval = setInterval(async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
        setCompletedStep(statusToStep(data?.status));
        setOrderError("");
      } catch (e) {
        console.error("TRACK ORDER POLLING ERROR:", e);

        const status = e?.response?.status || e?.status || e?.statusCode;
        if (status === 400 || status === 404) {
          setEnableLiveTracking(false);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, enableLiveTracking]);

useEffect(() => {
  if (
    showConfirmModal ||
    showCancelModal ||
    showCancelConfirm ||
    showCancelSuccess
  ) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showConfirmModal, showCancelModal, showCancelConfirm, showCancelSuccess]);

useEffect(() => {
  if (showCancelSuccess) {
    const timer = setTimeout(() => {
      setShowCancelSuccess(false);
      navigate("/client", { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [showCancelSuccess, navigate]);

const displayStatus = bookingFromState?.status || order?.status || "PENDING_ARTISAN_RESPONSE";
const normalizedStatus = String(displayStatus || "").toUpperCase();

const isRejected = normalizedStatus === "REJECTED";
const activeSteps = isRejected ? rejectedStepsData : stepsData;

  const getDuration = (start, end) => {
  if (!start || !end) return null;

  const diffMs = new Date(end) - new Date(start);
  if (diffMs <= 0) return null;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) return `${hours}h ${remainingMinutes}m`;
  return `${minutes}m`;
};

const booking = useMemo(() => {
  const fallbackImageUrl =
    localStorage.getItem("fixserv_last_uploaded_image_url") || "";

  if (order) {
    const activeStep = statusToStep(order.status);

    const sortedHistory = [...(order.statusHistory || [])].sort(
      (a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0)
    );

    const steps = activeSteps;

    const timeline = Array(steps.length).fill(null);
    let durations = Array(steps.length).fill(null);


  //   const steps = statusToStepIndex(order?.status) === 1 && String(order?.status).toUpperCase() === "REJECTED"
  // ? rejectedStepsData
  // : stepsData;


    sortedHistory.forEach((entry) => {
      const stepIndex = statusToStepIndex(entry.status);

      if (stepIndex !== null) {
        const existing = timeline[stepIndex];

        if (
          !existing ||
          new Date(entry.timestamp) > new Date(existing.raw || 0)
        ) {
          timeline[stepIndex] = {
            ...formatDate(entry.timestamp),
            raw: entry.timestamp,
          };
        }
      }
    });

    const cleanedTimeline = timeline.map((t) =>
      t ? { date: t.date, time: t.time } : null
    );

    sortedHistory.forEach((entry, index) => {
      if (index === 0) return;

      const prev = sortedHistory[index - 1];
      const current = entry;
      const stepIndex = statusToStepIndex(current.status);

      if (stepIndex !== null) {
        durations[stepIndex] = getDuration(
          prev.timestamp,
          current.timestamp
        );
      }
    });

    return {
      ...bookingFromState,
      id: order.id || order._id || order.orderId || orderId,
      orderId: order.id || order._id || order.orderId || orderId,
      status: order.status || "PENDING_ARTISAN_RESPONSE",
      currentStep: activeStep,
      timeline: cleanedTimeline,
      durations,
      brand: order.deviceBrand || bookingFromState?.brand || "",
      model: order.deviceModel || bookingFromState?.model || "",
      damagedDeviceImageUrl:
        order.damagedDeviceImageUrl ||
        bookingFromState?.damagedDeviceImageUrl ||
        fallbackImageUrl,
    };
  }

  return bookingFromState || null;
}, [order, bookingFromState, orderId]);

// const displayStatus = booking?.status || "PENDING_ARTISAN_RESPONSE";
// const normalizedStatus = String(displayStatus || "").toUpperCase();

// const isRejected = normalizedStatus === "REJECTED";
// const activeSteps = isRejected ? rejectedStepsData : stepsData;

  const backendPaymentReleased =
    order?.paymentReleased ||
    order?.isPaymentReleased ||
    order?.released ||
    order?.paymentStatus === "RELEASED" ||
    booking?.paymentReleased ||
    booking?.isPaymentReleased;

  const isCompletedStageOrAfter = [
    "WORK_COMPLETED",
    "READY_FOR_PICKUP",
    "COMPLETED",
    "DONE",
  ].includes(normalizedStatus);

  const canReleasePayment =
    isCompletedStageOrAfter && !backendPaymentReleased && !paymentReleased;

  const canCancelOrder = ["PENDING_ARTISAN_RESPONSE", "ACCEPTED"].includes(
    normalizedStatus
  );

  const showNewRequestBtn = [
    "WORK_COMPLETED",
    "READY_FOR_PICKUP",
    "REJECTED",
    "COMPLETED",
    "CANCELLED",
    "DONE",
  ].includes(normalizedStatus);

  const handleReleasePayment = async () => {
    try {
      if (!booking?.orderId) {
        alert("Order ID not found");
        return;
      }

      setReleasingPayment(true);

      const res = await releasePaymentToArtisan(booking.orderId);

      alert(res?.message || "Payment released successfully");

      setPaymentReleased(true);

      setOrder((prev) =>
        prev
          ? {
              ...prev,
              paymentReleased: true,
              isPaymentReleased: true,
              paymentStatus: "RELEASED",
            }
          : prev
      );

      setShowConfirmModal(false);

      navigate("/client", { replace: true });
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

  // const handleCancelOrder = async () => {
  //   try {
  //     if (!booking?.orderId) {
  //       alert("Order ID not found");
  //       return;
  //     }

  //     if (!cancelEmail.trim()) {
  //       alert("Email is required");
  //       return;
  //     }

  //     if (!cancelPassword.trim()) {
  //       alert("Password is required");
  //       return;
  //     }

  //     setCancellingOrder(true);

  //     const res = await cancelOrderByClient(booking.orderId, {
  //       email: cancelEmail.trim(),
  //       password: cancelPassword,
  //     });

  //     alert(
  //       res?.message ||
  //         "Order cancelled successfully. Your funds have been refunded to your wallet."
  //     );

  //     setOrder((prev) =>
  //       prev
  //         ? {
  //             ...prev,
  //             status: "CANCELLED",
  //           }
  //         : prev
  //     );

  //     setShowCancelModal(false);
  //     setCancelPassword("");

  //     navigate("/client", { replace: true });
  //   } catch (error) {
  //     console.error("CANCEL ORDER ERROR:", error);

  //     alert(
  //       error?.response?.data?.message ||
  //         error?.message ||
  //         "Failed to cancel order"
  //     );
  //   } finally {
  //     setCancellingOrder(false);
  //   }
  // };

const handleConfirmContinue = () => {
  setShowConfirmModal(false);
  handleReleasePayment();
};

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  const handleCancelReasonSelect = (reason) => {
  setCancelReason(reason);
};

const handleSubmitCancel = async () => {
  try {
    if (!booking?.orderId) {
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

    await cancelOrderByClient(booking.orderId, {
      email: cancelEmail.trim(),
      password: cancelPassword,
    });

    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "CANCELLED",
          }
        : prev
    );

    setShowCancelModal(false);
    setShowCancelSuccess(true);
    setCancelPassword("");
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    alert(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel order"
    );
  } finally {
    setCancellingOrder(false);
  }
};

  if (!orderId) {
    return (
      <div className="py-20 text-center text-gray-500">
        No orderId found. Please start again.
      </div>
    );
  }

  if (loadingOrder && !bookingFromState) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading repair details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-20 text-center text-gray-500">
        {orderError || "Repair details not found."}
      </div>
    );
  }

  return (
    <section className="w-full py-14 overflow-hidden bg-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
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

        <div className="mt-8 text-center space-y-2">
          <h3 className="font-semibold text-2xl">
            Repair ID: <span className="font-semibold">#{booking.id}</span>
          </h3>

          <p className="text-lg font-normal text-black">
            {`${booking.brand} ${booking.model}`.trim() || "Device repair"}
          </p>
        </div>

        <div className="flex justify-center items-center gap-2 mt-3">
          <p className="text-sm text-[#535353]">Status:</p>
          <span
            className={`text-xs px-3 py-[2px] rounded-full ${
              normalizedStatus === "CANCELLED"
                ? "bg-red-100 text-red-600"
                : "bg-[#F6E4C7] text-[#F99F10]"
            }`}
          >
            {formatStatusLabel(displayStatus)}
          </span>
        </div>

        {!enableLiveTracking && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Live tracking is temporarily unavailable. Showing your latest booking details.
            </p>
          </div>
        )}

        <div className="mt-10">
          {booking.damagedDeviceImageUrl && (
            <div className="mb-10 flex justify-center">
              {/* <img
                src={booking.damagedDeviceImageUrl}
                alt="Damaged device"
                className="w-56 h-56 object-cover rounded-xl border"
              /> */}
            </div>
          )}

          {activeSteps.map((step, index) => {
            const activeStep = statusToStepIndex(normalizedStatus);
const isCompleted = index <= activeStep;
            // const isCompleted = index <= activeStep;
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

                  {index !== activeSteps.length - 1 && (
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

        {(canCancelOrder || isCompletedStageOrAfter || showNewRequestBtn) && (
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            {canCancelOrder && (
  <button
    onClick={() => setShowCancelConfirm(true)}
    className="px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition cursor-pointer"
  >
    Cancel Request
  </button>
)}

            {isCompletedStageOrAfter && (
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!canReleasePayment || releasingPayment}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition ${
                  canReleasePayment && !releasingPayment
                    ? "bg-[#3E83C4] text-white hover:bg-[#2f6fa5] cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {backendPaymentReleased || paymentReleased
                  ? "Payment Released"
                  : releasingPayment
                  ? "Releasing Payment..."
                  : "Release Payment"}
              </button>
            )}

            {showNewRequestBtn && (
              <button
                onClick={() => navigate("/client")}
                className="px-6 py-3 bg-[#3E83C4] text-white rounded-lg text-sm font-medium hover:bg-[#2f6fa5] transition cursor-pointer"
              >
                Create a New Request
              </button>
            )}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-center">
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
                  onClick={handleConfirmContinue}
                  disabled={releasingPayment}
                  className="px-5 py-2 bg-[#3E83C4] text-white rounded-lg text-sm hover:bg-[#2f6fa5] transition disabled:opacity-70"
                >
                  {releasingPayment ? "Processing..." : "Continue"}
                </button>

                <button
                  onClick={handleCancelModal}
                  disabled={releasingPayment}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition disabled:opacity-70"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </section>
  );
};

export default TrackRepairA;