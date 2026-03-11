import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import profileImage from "../../assets/client images/client-home/profile.png";
import mark from "../../assets/client images/client-home/mark.png";
import star from "../../assets/client images/client-home/star.png";
import master from "../../assets/client images/client-home/master.png";
import paypal from "../../assets/client images/client-home/paypal.png";
import visa from "../../assets/client images/client-home/visa.png";
import wallet from "../../assets/client images/client-home/wallet.png";
import creditImg from "../../assets/client images/client-home/creditcard.png";
import walletPay from "../../assets/client images/client-home/walletpay.png";
import loading from "../../assets/client images/client-home/loading.png";
import success from "../../assets/client images/client-home/success.png";
import failure from "../../assets/client images/client-home/cancel.png";
import { createDraftOrder } from "../../api/order.api";
import { getArtisanServices } from "../../api/artisan.api";
import settingImage from "../../assets/client images/client-home/setting.png";
import battery from "../../assets/client images/client-home/battery.png";
import flashImage from "../../assets/client images/client-home/flash.png";
import cameraImage from "../../assets/client images/client-home/camera.png";

const MODAL = {
  WALLET: "wallet",
  PROCESSING: "processing",
  SUCCESS: "success",
  CANCEL: "cancel",
};

const BookingSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeModal, setActiveModal] = useState(null);
  const [finalBooking, setFinalBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [artisanServiceList, setArtisanServiceList] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const paymentMethods = [
    { img: master, label: "Mastercard" },
    { img: paypal, label: "PayPal" },
    { img: visa, label: "Visa" },
    { img: wallet, label: "Wallet" },
  ];

  const [selected, setSelected] = useState("Mastercard");

  const state = location.state || {};
  const artisan = state?.artisan || null;
  const booking = state?.booking || null;

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
    finalBooking?.id ||
    booking?.id ||
    booking?.orderId ||
    booking?.draftOrderId ||
    "Pending payment";

  const professionLabel =
    artisan?.profession ||
    artisan?.roleTitle ||
    artisan?.categoryTitle ||
    artisan?.specialty ||
    (Array.isArray(artisan?.skills) && artisan.skills.length > 0
      ? typeof artisan.skills[0] === "string"
        ? artisan.skills[0]
        : artisan.skills[0]?.name || artisan.skills[0]?.title || ""
      : "") ||
    (Array.isArray(artisan?.categories) && artisan.categories.length > 0
      ? typeof artisan.categories[0] === "string"
        ? artisan.categories[0]
        : artisan.categories[0]?.name || artisan.categories[0]?.title || ""
      : "") ||
    "Technician";

  const reviewsCount = Number(
    artisan?.reviewsCount ||
      (Array.isArray(artisan?.reviewsList) ? artisan.reviewsList.length : 0) ||
      artisan?.reviews ||
      0
  );

  const yearsFromCreatedAt = artisan?.createdAt
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(artisan.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      )
    : null;

  const categoriesToShow =
    Array.isArray(artisan?.categories) && artisan.categories.length
      ? artisan.categories.slice(0, 3)
      : ["Phone", "Tablet", "Laptop"];

  const fallbackServices = [
    { id: 1, title: "Screen Replacement", price: 12000, icon: settingImage },
    { id: 2, title: "Battery Replacement", price: 7000, icon: battery },
    { id: 3, title: "Charging port Fix", price: 5000, icon: flashImage },
    { id: 4, title: "Camera Repair", price: 8000, icon: cameraImage },
    { id: 5, title: "General Diagnostics", price: 3500, icon: settingImage },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      if (!artisan?.id && !artisan?._id && !artisan?.artisanId) {
        setArtisanServiceList([]);
        setLoadingServices(false);
        return;
      }

      try {
        setLoadingServices(true);
        const artisanId = artisan?.id || artisan?._id || artisan?.artisanId;
        const res = await getArtisanServices(artisanId);
        setArtisanServiceList(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("BOOKING SUMMARY SERVICES ERROR:", err);
        setArtisanServiceList([]);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [artisan]);

  const mapServiceCard = (service, idx, prefix) => {
    const title =
      typeof service === "string"
        ? service
        : service?.title ||
          service?.name ||
          service?.serviceName ||
          `Service ${idx + 1}`;

    return {
      id: service?.id || service?._id || service?.serviceId || `${prefix}-${idx}`,
      title,
      description: service?.description || "",
      price: service?.price ?? service?.amount ?? null,
      estimatedDuration: service?.estimatedDuration || service?.duration || "",
      icon: String(title).toLowerCase().includes("battery")
        ? battery
        : String(title).toLowerCase().includes("camera")
        ? cameraImage
        : String(title).toLowerCase().includes("charg")
        ? flashImage
        : settingImage,
    };
  };

  const serviceApiMapped = useMemo(() => {
    return (Array.isArray(artisanServiceList) ? artisanServiceList : [])
      .filter((s) => s?.isActive !== false)
      .map((s, idx) => mapServiceCard(s, idx, "api"));
  }, [artisanServiceList]);

  const profileServicesMapped = useMemo(() => {
    const services = Array.isArray(artisan?.services) ? artisan.services : [];
    return services
      .filter((s) => s?.isActive !== false)
      .map((s, idx) => mapServiceCard(s, idx, "profile"));
  }, [artisan]);

  const skillServicesMapped = useMemo(() => {
    const skills = Array.isArray(artisan?.skills) ? artisan.skills : [];
    return skills.map((s, idx) => mapServiceCard(s, idx, "skill"));
  }, [artisan]);

  const allServiceOptions =
    serviceApiMapped.length > 0
      ? serviceApiMapped
      : profileServicesMapped.length > 0
      ? profileServicesMapped
      : skillServicesMapped.length > 0
      ? skillServicesMapped
      : fallbackServices;

  const selectedService = useMemo(() => {
    const normalizedRequired = String(booking?.serviceRequired || "")
      .toLowerCase()
      .trim();

    if (!normalizedRequired) return null;

    return (
      allServiceOptions.find((s) => {
        const title = String(s?.title || "").toLowerCase().trim();
        return (
          title === normalizedRequired ||
          title.includes(normalizedRequired) ||
          normalizedRequired.includes(title)
        );
      }) || null
    );
  }, [allServiceOptions, booking?.serviceRequired]);

  const serviceCost =
    selectedService?.price ??
    booking?.serviceCost ??
    artisan?.startingPrice ??
    null;

const platformFee = 1000;
// const taxFee = booking?.taxFee ?? null;

const totalFee =
  serviceCost != null
    ? Number(serviceCost) + Number(platformFee)
    : null;

  const uploadDeviceImage = async (token, userId) => {
    const fd = new FormData();

    fd.append("productImage", booking.imageFile);
    fd.append(
      "objectName",
      cleanText(
        booking.objectName,
        `Damaged Device - ${cleanText(booking.deviceType)} ${cleanText(
          booking.brand
        )} ${cleanText(booking.model)}`.trim()
      )
    );
    fd.append(
      "description",
      booking.issueDescription || booking.description || "Damaged device image"
    );

    const res = await fetch(
      `https://dev-user-api.fixserv.co/api/upload/${userId}/upload-products`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Image upload failed");
    }

    const uploadedProductId =
      data?.product?.uploadedProductId ||
      data?.product?.id ||
      data?.product?._id ||
      data?.product?.uuid ||
      data?.data?.product?.id ||
      data?.data?.product?._id;

    const imageUrl =
      data?.product?.imageUrl || data?.data?.product?.imageUrl || "";

    if (!uploadedProductId) {
      throw new Error("Upload succeeded but uploadedProductId missing.");
    }

    return { uploadedProductId, imageUrl };
  };

  const handleWalletPayment = async () => {
    try {
      setSubmitError("");
      setIsSubmitting(true);
      setActiveModal(MODAL.PROCESSING);

      const token = localStorage.getItem("fixserv_token");
      const storedUser = localStorage.getItem("fixserv_user");

      let user = null;

      try {
        user = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        user = null;
      }

      const userId = user?.id || user?._id;

      if (!token) throw new Error("Token not found. Please login again.");
      if (!userId) throw new Error("User ID not found. Please login again.");
      if (!booking?.imageFile) throw new Error("No image selected.");

      const uploaded = await uploadDeviceImage(token, userId);

      const draftPayload = {
        uploadedProductId: uploaded.uploadedProductId,
        deviceType: booking.deviceType,
        deviceBrand: booking.brand,
        deviceModel: booking.model,
        serviceRequired: booking.serviceRequired,
      };

      const createdOrder = await createDraftOrder(draftPayload);

      console.log("CREATED ORDER RESPONSE =>", createdOrder);

      const orderId =
        createdOrder?.id ||
        createdOrder?._id ||
        createdOrder?.orderId ||
        createdOrder?.draftOrderId ||
        createdOrder?.data?.id ||
        createdOrder?.data?._id ||
        createdOrder?.data?.orderId ||
        createdOrder?.data?.draftOrderId;

      if (!orderId) {
        throw new Error(
          "Order created but no id/orderId/draftOrderId was returned."
        );
      }

      localStorage.setItem("fixserv_last_order_id", orderId);
      localStorage.setItem(
        "fixserv_last_uploaded_image_url",
        uploaded.imageUrl
      );

      setFinalBooking({
        ...booking,
        id: orderId,
        orderId,
        uploadedProductId: uploaded.uploadedProductId,
        damagedDeviceImageUrl: uploaded.imageUrl,
        serviceCost,
platformFee,
// taxFee,
totalFee,
        artisan,
      });

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

  if (!artisan || !booking) {
    return (
      <div className="py-20 text-center text-gray-500">
        Booking details not found. Please start again.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <section className="w-full py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-[260px_1fr] gap-30 max-w-7xl mx-auto">
            <div className="bg-[#EEF6FF] rounded-xl p-4 w-[290px]">
              <div className="flex flex-col">
                <img
                  src={
                    artisan?.profilePicture ||
                    artisan?.profileImage ||
                    artisan?.avatar ||
                    profileImage
                  }
                  alt="artisan"
                  className="w-[250px] h-[220px] rounded-xl object-cover mb-4"
                />

                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-black text-2xl">
                    {cleanText(
                      artisan?.fullName,
                      cleanText(artisan?.businessName, "Unnamed Artisan")
                    )}
                  </h2>
                  <img src={mark} alt="verified" className="w-5 h-5" />
                </div>

                <p className="text-lg text-[#656565] mt-1">{professionLabel}</p>

                <div className="flex items-center gap-1 mt-2 text-lg">
                  <img src={star} alt="star" className="w-6 h-6" />
                  <span className="font-medium text-black">
                    {Number(artisan?.rating || 0).toFixed(1)}
                  </span>
                  <span className="text-black">({reviewsCount} reviews)</span>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {categoriesToShow.map((c, idx) => {
                    const label =
                      typeof c === "string"
                        ? c
                        : c?.name || c?.title || `Category ${idx + 1}`;
                    return (
                      <span
                        key={label + idx}
                        className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-lg"
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-4 text-lg text-[#656565] space-y-1">
                  <p>
                    Experience:{" "}
                    <span className="font-medium text-black">
                      {yearsFromCreatedAt != null
                        ? `${yearsFromCreatedAt}+ years`
                        : "—"}
                    </span>
                  </p>
                  <p>
                    Location:{" "}
                    <span className="font-medium text-black">
                      {cleanText(artisan?.location, "Unknown")}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-lg font-semibold text-black mb-6">
                {serviceTitle}
              </h2>

              <div className="space-y-3 text-lg text-black">
                <p>
                  <span className="text-[#656565]">Booking ID:</span>{" "}
                  {bookingIdToShow}
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
                  {cleanText(booking.issueDescription || booking.description, "—")}
                </p>

                <p>
                  <span className="text-[#656565]">Location:</span>{" "}
                  {cleanText(booking.location, "—")}
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

{/* <p>
  <span className="text-[#656565]">Tax Fee:</span>{" "}
  {taxFee == null ? "To be confirmed" : formatNaira(taxFee)}
</p> */}

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
          <h3 className="text-base font-semibold mb-4">Payment Method</h3>

          <div className="grid grid-cols-4 gap-6 mb-5">
            {paymentMethods.map((item) => {
              const isActive = selected === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelected(item.label)}
                  className="flex items-center gap-3 p-3"
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isActive ? "border-[#3e83c4]" : "border-[#C1DAF3]"
                    }`}
                  >
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-[#3e83c4]" />
                    )}
                  </div>

                  <img
                    src={item.img}
                    alt={item.label}
                    className="h-42 w-42 object-contain"
                  />
                </button>
              );
            })}
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#8B8B8B] w-24">Card Number*</label>

                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  inputMode="numeric"
                  maxLength={19}
                  onInput={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    value = value.match(/.{1,4}/g)?.join(" ") || value;
                    e.target.value = value;
                  }}
                  className="flex-1 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-[#8B8B8B] w-24">Cardholder*</label>

                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#8B8B8B] w-10">Expiry</label>

                <input
                  type="text"
                  placeholder="MM / YY"
                  maxLength={7}
                  inputMode="numeric"
                  onInput={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");

                    if (value.length >= 3) {
                      value = value.slice(0, 2) + " / " + value.slice(2, 4);
                    }

                    e.target.value = value;
                  }}
                  className="w-36 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
                />
              </div>

              <div className="flex items-center">
                <label className="text-sm text-[#8B8B8B] w-10">CVV</label>

                <div className="relative w-26">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={3}
                    placeholder="123"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    className="w-full border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
                  />

                  <img
                    src={creditImg}
                    alt="CVV info"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 opacity-60 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center space-y-4">
            <button
              onClick={() => setActiveModal(MODAL.WALLET)}
              className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-3 rounded-md text-sm font-medium transition cursor-pointer"
            >
              Make Payment
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
                  <div className="bg-white rounded-xl w-[400px] p-6 relative">
                    {activeModal === MODAL.WALLET && (
                      <div className="text-center space-y-4">
                        <img src={walletPay} alt="wallet" className="mx-auto w-12" />

                        <h3 className="font-semibold text-lg">Your Wallet</h3>
                        <p className="text-sm text-gray-500">
                          This amount will be deducted from your wallet once you confirm this booking
                        </p>

                        <div className="text-sm space-y-1 text-left mt-4">
                          <p>
                            Total:{" "}
                            {loadingServices
                              ? "Loading..."
                              : totalFee == null
                              ? "To be confirmed"
                              : formatNaira(totalFee)}
                          </p>
                          <p>Balance: ₦—</p>
                          <p>Balance After Payment: ₦—</p>
                        </div>

                        <button
                          disabled={isSubmitting || loadingServices}
                          onClick={handleWalletPayment}
                          className={`w-full bg-blue-600 text-white py-2 rounded-md ${
                            isSubmitting || loadingServices
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {isSubmitting ? "Uploading..." : "Make Payment"}
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
                            navigate(`/client/track-repair/${finalBooking?.id}`, {
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
                          Are you sure you want to cancel this booking?
                        </p>

                        <button
                          onClick={() => setActiveModal(null)}
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

export default BookingSummary;