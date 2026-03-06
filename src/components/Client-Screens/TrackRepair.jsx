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

 
  if (s === "PENDING_ARTISAN_RESPONSE") return 0;
  if (s === "ACCEPTED") return 1;
  if (s === "IN_PROGRESS") return 2;
  if (s === "WORK_COMPLETED") return 3;
  if (s === "COMPLETED") return 4;


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
      // map order fields 
      brand: order.deviceBrand || "",
      model: order.deviceModel || "",
      damagedDeviceImageUrl: order.damagedDeviceImageUrl || fallbackImageUrl,
    };
  }, [order]);


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

      </div>
    </section>
  );
};

export default TrackRepair;