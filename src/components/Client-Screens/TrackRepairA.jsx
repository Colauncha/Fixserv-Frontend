import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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

  if (s === "PENDING_ARTISAN_RESPONSE") return 0;
  if (s === "ACCEPTED") return 1;
  if (s === "IN_PROGRESS") return 2;
  if (s === "WORK_COMPLETED") return 3;
  if (s === "COMPLETED") return 4;

  return 0;
};

const formatDate = (value) => {
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

const booking = useMemo(() => {
  if (!bookingFromState) return null;

  const createdAt = formatDate(order?.createdAt || new Date().toISOString());

  return {
    id: bookingFromState.id || orderId,

    // status comes from API if available
    status: order?.status || "PENDING_ARTISAN_RESPONSE",

    currentStep: order
      ? statusToStep(order.status)
      : statusToStep("PENDING_ARTISAN_RESPONSE"),

    timeline: [createdAt || null, null, null, null, null],

    // keep original booking data EXACTLY
    brand: bookingFromState.brand,
    model: bookingFromState.model,
    damagedDeviceImageUrl: bookingFromState.damagedDeviceImageUrl || "",
  };
}, [order, bookingFromState, orderId]);

  const displayStatus = booking?.status || "PENDING_ARTISAN_RESPONSE";

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
            {`${booking.brand} ${booking.model}`.trim()}
          </p>
        </div>

        <div className="flex justify-center items-center gap-2 mt-3">
          <p className="text-sm text-[#535353]">Status:</p>
          <span className="bg-[#F6E4C7] text-[#F99F10] text-xs px-3 py-[2px] rounded-full">
            {displayStatus}
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
              <img
                src={booking.damagedDeviceImageUrl}
                alt="Damaged device"
                className="w-56 h-56 object-cover rounded-xl border"
              />
            </div>
          )}

          {stepsData.map((step, index) => {
            const activeStep = order ? completedStep : booking.currentStep;
            const isCompleted = index <= activeStep;
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
      </div>
    </section>
  );
};

export default TrackRepairA;