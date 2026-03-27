import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import master from "../../assets/client images/client-home/master.png";
import paypal from "../../assets/client images/client-home/paypal.png";
import visa from "../../assets/client images/client-home/visa.png";
import wallet from "../../assets/client images/client-home/wallet.png";
import creditImg from "../../assets/client images/client-home/creditcard.png";
import { createOrder } from "../../api/order.api";
import walletPay from "../../assets/client images/client-home/walletpay.png";
import loading from "../../assets/client images/client-home/loading.png";
import success from "../../assets/client images/client-home/success.png";
import failure from "../../assets/client images/client-home/cancel.png";

import { normalizeArtisan } from "../../utils/normalizeArtisan";

import ArtisanCard from "./ArtisanCard";

const MODAL = {
  WALLET: "wallet",
  PROCESSING: "processing",
  SUCCESS: "success",
  CANCEL: "cancel",
};

const BookingSummaryA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeModal, setActiveModal] = useState(null);
  const [finalBooking, setFinalBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

   const [loadingServices, setLoadingServices] = useState(true);

  const paymentMethods = [
    { img: master, label: "Mastercard" },
    { img: paypal, label: "PayPal" },
    { img: visa, label: "Visa" },
    { img: wallet, label: "Wallet" },
  ];

  const [selected, setSelected] = useState("Mastercard");

  const state = location.state || {};

const rawArtisan = state?.artisan || null;
const artisan = useMemo(() => normalizeArtisan(rawArtisan), [rawArtisan]);

  const extractConfirmedOrderId = (rawConfirm, fallbackId = "") => {
    return (
      rawConfirm?.data?.orderId ||
      rawConfirm?.data?.id ||
      rawConfirm?.data?.order?.id ||
      rawConfirm?.data?.order?._id ||
      rawConfirm?.orderId ||
      rawConfirm?.id ||
      rawConfirm?.order?.id ||
      rawConfirm?.order?._id ||
      fallbackId
    );
  };

  const confirmedOrderId = extractConfirmedOrderId(
    state?.rawConfirm,
    state?.draftOrderId || ""
  );

  const booking = {
    draftOrderId: state?.draftOrderId || "",
    orderId: confirmedOrderId,
    uploadedProductId: state?.uploadedProductId || "",
    deviceType: state?.deviceType || "",
    brand: state?.deviceBrand || "",
    model: state?.deviceModel || "",
    serviceRequired: state?.serviceRequired || "",
    issueDescription: state?.description || "",
    objectName: state?.objectName || "",
    rawConfirm: state?.rawConfirm || null,
    serviceCost: state?.serviceCost ?? null,
  };

  const cleanText = (v, fallback = "") =>
    typeof v === "string" && v.trim() === "" ? fallback : v ?? fallback;

  const formatNaira = (value) => {
    const num = Number(value);
    if (value == null || Number.isNaN(num)) return value;
    return `₦${num.toLocaleString("en-NG")}`;
  };

  const serviceTitle =
    typeof booking?.serviceRequired === "string" && booking.serviceRequired.trim()
      ? booking.serviceRequired
      : "Selected Service";

  const bookingIdToShow =
    finalBooking?.id || booking?.orderId || booking?.draftOrderId || "—";

const artisanServices = useMemo(() => {
  if (Array.isArray(artisan?.services) && artisan.services.length) {
    return artisan.services;
  }

  // fallback fake service using starting price
  if (artisan?.startingPrice) {
    return [
      {
        title: "General Service",
        price: artisan.startingPrice,
      },
    ];
  }

  return [];
}, [artisan]);


const startingPrice = useMemo(() => {
  if (!artisanServices.length) return null;

  const prices = artisanServices
    .map((s) => {
      const raw =
        s?.price ||
        s?.cost ||
        s?.amount ||
        s?.startingPrice ||
        s?.details?.price ||
        s?.details?.cost ||
        s?.details?.amount;

      const parsed = Number(raw);
      return Number.isNaN(parsed) ? null : parsed;
    })
    .filter((p) => p !== null && p > 0);

  return prices.length ? Math.min(...prices) : null;
}, [artisanServices]);



  const selectedServiceFromArtisan = useMemo(() => {
    const normalizedRequired = String(booking?.serviceRequired || "")
      .toLowerCase()
      .trim();

    if (artisanServices.length === 0) return null;

    if (!normalizedRequired) {
      return artisanServices[0] || null;
    }

    return (
      artisanServices.find((s) => {
        const title = String(
  s?.title || s?.name || s?.serviceName || s?.details?.title || ""
).toLowerCase().trim();

        return (
          title === normalizedRequired ||
          title.includes(normalizedRequired) ||
          normalizedRequired.includes(title)
        );
      }) || artisanServices[0] || null
    );
  }, [artisanServices, booking?.serviceRequired]);

  
const serviceCost = useMemo(() => {
  const selectedPrice =
    selectedServiceFromArtisan?.price ||
    selectedServiceFromArtisan?.cost ||
    selectedServiceFromArtisan?.amount;

  if (selectedPrice != null) return Number(selectedPrice);

  if (startingPrice != null) return startingPrice;

  // 🔥 ADD THIS
  if (artisan?.startingPrice != null) {
    return Number(artisan.startingPrice);
  }

  if (booking?.serviceCost != null) return Number(booking.serviceCost);

  return null;
}, [selectedServiceFromArtisan, startingPrice, artisan, booking]);




  const platformFee = 1000;

  const totalFee =
    serviceCost != null
      ? Number(serviceCost) + Number(platformFee)
      : null;

const handleWalletPayment = async () => {
  try {
    setSubmitError("");
    setIsSubmitting(true);
    setActiveModal(MODAL.PROCESSING);

    if (!artisan) throw new Error("Selected artisan not found.");
    if (!booking?.uploadedProductId) {
      throw new Error("Uploaded product not found. Please start again.");
    }

    const selectedServiceId =
      selectedServiceFromArtisan?.id ||
      selectedServiceFromArtisan?._id ||
      selectedServiceFromArtisan?.serviceId ||
      null;

    if (!selectedServiceId) {
      throw new Error("No valid artisan service selected for this booking.");
    }

    const createdOrder = await createOrder({
      serviceId: selectedServiceId,
      uploadedProductId: booking.uploadedProductId,
    });

    const finalOrderId =
      createdOrder?.id ||
      createdOrder?._id ||
      createdOrder?.orderId ||
      createdOrder?.data?.id ||
      createdOrder?.data?._id ||
      createdOrder?.data?.orderId ||
      "";

    if (!finalOrderId) {
      throw new Error("Order created but no order id was returned.");
    }

    const finalData = {
      id: finalOrderId,
      orderId: finalOrderId,
      uploadedProductId: booking.uploadedProductId,
      deviceType: booking.deviceType,
      brand: booking.brand,
      model: booking.model,
      serviceRequired: booking.serviceRequired,
      issueDescription: booking.issueDescription,
      objectName: booking.objectName,
      serviceId: selectedServiceId,
      serviceCost,
      platformFee,
      totalFee,
      artisan,
    };

    localStorage.setItem("fixserv_last_order_id", finalOrderId);

    setFinalBooking(finalData);
    setActiveModal(MODAL.SUCCESS);
  } catch (err) {
    console.error(err);
    setActiveModal(MODAL.WALLET);
    setSubmitError(err?.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

    useEffect(() => {
  if (artisan) {
    setLoadingServices(false);
  }
}, [artisan]);

  if (!artisan || (!booking?.draftOrderId && !booking?.orderId)) {
    return (
      <div className="py-20 text-center text-gray-500">
        Booking details not found. Please start again.
      </div>
    );
  }



// useEffect(() => {
//   console.log("ARTISAN SERVICES =>", artisanServices);
// }, [artisanServices]);

// useEffect(() => {
//   console.log("RAW ARTISAN =>", rawArtisan);
// }, [rawArtisan]);



  return (
    <div className="w-full min-h-screen bg-white">
      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="text-center mb-8 md:mb-12">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <h1 className="text-lg font-semibold text-black">
              Review & Confirm Booking
            </h1>
            <p className="text-sm text-[#656565] mt-1">
              Double-check your request and make payment to confirm
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-20 max-w-7xl mx-auto">

           <div className="bg-[#EEF6FF] rounded-2xl p-5 w-full max-w-[340px] mx-auto lg:mx-0 lg:max-w-[420px] xl:max-w-[460px] shadow-sm">
  <div className="flex flex-col gap-3">

    <ArtisanCard artisan={artisan} />

              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-lg font-semibold text-black mb-6">{serviceTitle}</h2>

              <div className="space-y-3 text-lg text-black">
                <p>
                  <span className="text-[#656565]">Booking ID:</span> {bookingIdToShow}
                </p>

                <p>
                  <span className="text-[#656565]">Device Type:</span>{" "}
                  {cleanText(booking.deviceType, "—")}
                </p>

                <p>
                  <span className="text-[#656565]">Device Brand:</span>{" "}
                  {cleanText(booking.brand, "—")}
                </p>

                <p>
                  <span className="text-[#656565]">Device Model:</span>{" "}
                  {cleanText(booking.model, "—")}
                </p>

                <p>
                  <span className="text-[#656565]">Issue description:</span>{" "}
                  {cleanText(booking.issueDescription, "—")}
                </p>

                <p>
                  <span className="text-[#656565]">Object Name:</span>{" "}
                  {cleanText(booking.objectName, "—")}
                </p>

                <div className="pt-6 space-y-2">
                  <p>
                    <span className="text-[#656565]">Service Cost:</span>{" "}
                    {loadingServices
                      ? "Loading..."
                      : serviceCost == null
                      ? "To be confirmed"
                      : formatNaira(serviceCost)}
                  </p>
                  <p>
                    <span className="text-[#656565]">Platform Fee:</span>{" "}
                    {formatNaira(platformFee)}
                  </p>

                  <p className="text-base font-semibold text-blue-600 pt-2">
                    Total Fee:{" "}
  {loadingServices
    ? "Loading..."
    : totalFee == null
    ? "To be confirmed"
    : formatNaira(totalFee)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          
          <div className="mt-2 text-center space-y-4">
            <button
              onClick={() => setActiveModal(MODAL.WALLET)}
              className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white w-full sm:w-auto px-8 sm:px-16 py-3 rounded-md text-sm font-medium transition cursor-pointer"
            >
              Confirm Booking
            </button>

            <div>
              <button
                onClick={() => setActiveModal(MODAL.CANCEL)}
                className="text-sm text-blue-600 cursor-pointer"
              >
                Cancel Booking
              </button>

              {activeModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl w-[90%] max-w-[400px] p-6 relative">
                  
                    {activeModal === MODAL.WALLET && (
                      <div className="text-center space-y-4">
                        <img src={walletPay} alt="wallet" className="mx-auto w-12" />

                        <h3 className="font-semibold text-lg">Your Wallet</h3>
                        <p className="text-sm text-gray-500">
                          To confirm booking you need to make payment. This amount will be deducted from your wallet once you confirm this booking
                        </p>

                        <div className="text-sm space-y-1 text-left mt-4">
                          <p>Total: {totalFee == null ? "—" : formatNaira(totalFee)}</p>
                          {/* <p>Balance: ₦—</p>
                          <p>Balance After Payment: ₦—</p> */}
                        </div>

                        <button
                          disabled={isSubmitting}
                          onClick={handleWalletPayment}
                          className={`w-full bg-blue-600 text-white py-2 rounded-md ${
                            isSubmitting ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          {isSubmitting ? "Processing..." : "Make Payment"}
                        </button>

                        {submitError && (
                          <p className="text-sm text-red-500 mt-3">{submitError}</p>
                        )}

                        <button
                          onClick={() => setActiveModal(null)}
                          className="text-sm text-blue-600"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {activeModal === MODAL.PROCESSING && (
                      <div className="text-center space-y-4">
                        <img
                          src={loading}
                          alt="loading"
                          className="mx-auto w-12 animate-spin"
                        />

                        <h3 className="font-semibold text-lg">Payment Processing</h3>
                        <p className="text-sm text-gray-500">
                          Verifying your payment, this may take a few seconds
                        </p>
                      </div>
                    )}

                    {activeModal === MODAL.SUCCESS && (
                      <div className="text-center space-y-4">
                        <img src={success} alt="success" className="mx-auto w-12" />

                        <h3 className="font-semibold text-lg">Booking Confirmed</h3>
                        <p className="text-sm text-gray-500">
                          Your booking has been successfully confirmed
                        </p>

                        <button
                          onClick={() =>
                            navigate(`/client/track-repair-a/${finalBooking?.id}`, {
                              state: {
                                orderId: finalBooking?.id,
                                artisan,
                                booking: finalBooking,
                              },
                            })
                          }
                          disabled={!finalBooking?.id}
                          className={`w-full bg-blue-600 text-white py-2 rounded-md ${
                            !finalBooking?.id ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          Track Repair
                        </button>
                      </div>
                    )}

                    {activeModal === MODAL.CANCEL && (
                      <div className="text-center space-y-4">
                        <img src={failure} alt="cancel" className="mx-auto w-12" />

                        <h3 className="font-semibold text-lg">Cancel Booking?</h3>
                        <p className="text-sm text-gray-500">
                          Are you sure you want to cancel this booking?booking?
                        </p>

                        <button
                          onClick={() => navigate(-1)}
                          className="w-full bg-red-500 text-white py-2 rounded-md"
                        >
                          Yes, Cancel Booking
                        </button>

                        <button
                          onClick={() => setActiveModal(null)}
                          className="text-sm text-blue-600"
                        >
                          Go Back
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingSummaryA;