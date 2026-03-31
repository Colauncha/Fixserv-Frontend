
import React, { useEffect, useMemo, useState } from "react";
import { getOrderById } from "../../../api/order.api";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import profileImage from "../../../assets/client images/client-home/profile.png";
import mark from "../../../assets/client images/client-home/mark.png";
import star from "../../../assets/client images/client-home/star.png";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const ViewRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const repair = location.state?.repair || null;

  const [orderDetails, setOrderDetails] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);

  const pickValue = (...values) => {
    for (const value of values) {
      if (value == null) continue;

      if (typeof value === "number" && !Number.isNaN(value)) {
        return value;
      }

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

  const pickArray = (...values) => {
    for (const value of values) {
      if (Array.isArray(value) && value.length > 0) return value;
    }
    return [];
  };

  const cleanText = (value, fallback = "—") => {
    const picked = pickValue(value);
    return picked === "" ? fallback : picked;
  };

  const formatNaira = (value) => {
    const num = Number(value);
    if (value == null || value === "" || Number.isNaN(num)) return "—";
    return `₦${num.toLocaleString("en-NG")}`;
  };

  
const platformFee = 1000;

  useEffect(() => {
  let mounted = true;

  const fetchOrderDetails = async () => {
    const orderId = repair?.id || repair?.raw?.id || repair?.raw?._id || repair?.raw?.orderId;

    if (!orderId) return;

    try {
      setDetailsLoading(true);
      const res = await getOrderById(orderId);
      if (!mounted) return;

      // console.log("VIEW REPAIR ORDER DETAILS =>", res);
      setOrderDetails(res || null);
    } catch (err) {
      // console.error("VIEW REPAIR ORDER DETAILS ERROR =>", err);
    } finally {
      if (mounted) setDetailsLoading(false);
    }
  };

  fetchOrderDetails();

  return () => {
    mounted = false;
  };
}, [repair]);

const extractJobDetails = (job) => {
  const product =
    job?.uploadedProducts?.[0] ||
    job?.uploadedProduct ||
    {};

  const description = product.description || "—";

  const rawName = product.objectName || "";
const cleaned = rawName
  .replace(/damaged device\s*-\s*/i, "")
  .trim();

const parts = cleaned.split(/\s+/).filter(Boolean);

  return {
    description,
    deviceType: parts[0] || "—",
    deviceBrand: parts[1] || "—",
    deviceModel: parts.slice(2).join(" ") || "—",
  };
};

  const raw = orderDetails || repair?.raw || {};

  const uploadedProduct = Array.isArray(raw?.uploadedProducts)
    ? raw.uploadedProducts[0]
    : raw?.uploadedProduct || null;

  const parsedDetails = useMemo(
    () => extractJobDetails(raw),
    [raw]
  );

  const booking = useMemo(() => {
    return {
      id:
        orderDetails?.id ||
        repair?.id ||
        raw?.id ||
        raw?._id ||
        raw?.orderId ||
        "—",

      deviceType:
        parsedDetails.deviceType ||
        orderDetails?.deviceType ||
        repair?.deviceType ||
        raw?.deviceType ||
        "—",

      brand:
        parsedDetails.deviceBrand ||
        orderDetails?.deviceBrand ||
        repair?.deviceBrand ||
        raw?.deviceBrand ||
        "—",

      model:
        parsedDetails.deviceModel ||
        orderDetails?.deviceModel ||
        repair?.deviceModel ||
        raw?.deviceModel ||
        "—",

      issueDescription:
        orderDetails?.issueDescription ||
        repair?.issueDescription ||
        parsedDetails.description,

      serviceRequired:
        orderDetails?.serviceRequired ||
        repair?.serviceRequired ||
        raw?.serviceRequired ||
        raw?.service?.title ||
        uploadedProduct?.objectName ||
        "—",

      paymentReference:
        orderDetails?.paymentReference ||
        repair?.paymentReference ||
        raw?.paymentReference ||
        "—",

      objectName:
        orderDetails?.objectName ||
        repair?.objectName ||
        raw?.objectName ||
        uploadedProduct?.objectName ||
        "—",

      location:
        repair?.location ||
        (raw?.clientAddress
          ? [
              raw.clientAddress.street,
              raw.clientAddress.city,
              raw.clientAddress.state,
              raw.clientAddress.country,
            ]
              .filter(Boolean)
              .join(", ")
          : "") ||
        raw?.location ||
        "—",

      createdAt:
        orderDetails?.createdAt ||
        repair?.createdAt ||
        raw?.createdAt ||
        "",

      uploadedAt:
        repair?.uploadedAt ||
        raw?.uploadedAt ||
        uploadedProduct?.uploadedAt ||
        uploadedProduct?.createdAt ||
        "",

      artisanResponseDeadline:
        orderDetails?.artisanResponseDeadline ||
        repair?.artisanResponseDeadline ||
        raw?.artisanResponseDeadline ||
        "",

      artisanId:
        orderDetails?.artisanId ||
        repair?.artisanId ||
        raw?.artisanId ||
        "—",

      serviceId:
        orderDetails?.serviceId ||
        repair?.serviceId ||
        raw?.serviceId ||
        "—",

      escrowStatus:
        orderDetails?.escrowStatus ||
        repair?.escrowStatus ||
        raw?.escrowStatus ||
        "—",

      progress:
        repair?.progress ||
        repair?.orderStatus ||
        raw?.status ||
        raw?.orderStatus ||
        "—",

      status:
        repair?.status ||
        repair?.paymentStatus ||
        raw?.paymentStatus ||
        raw?.status ||
        "—",

      cost:
        orderDetails?.price ||
        repair?.priceRaw ||
        repair?.cost ||
        repair?.price ||
        raw?.price ||
        raw?.cost ||
        0,

      artisanName:
        repair?.artisanName ||
        repair?.tech ||
        raw?.artisanName ||
        "Unknown Technician",

      artisanCategory:
        repair?.artisanCategory ||
        "Repair Technician",

      artisanRating:
        repair?.artisanRating ?? "—",

      artisanReviews:
        repair?.artisanReviews ?? "—",

      artisanExperience:
        repair?.artisanExperience ||
        "—",

      artisanLocation:
        repair?.artisanLocation ||
        "—",

      artisanImage:
        repair?.artisanImage ||
        profileImage,

      uploadedImage:
        repair?.uploadedImage ||
        uploadedProduct?.imageUrl ||
        uploadedProduct?.url ||
        "",

      artisanSkills:
        Array.isArray(repair?.artisanSkills)
          ? repair.artisanSkills
          : [],
    };
  }, [orderDetails, repair, raw, uploadedProduct, parsedDetails]);

const totalFee =
  Number(booking.cost || 0) + Number(platformFee || 0);

  if (!repair) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-black mb-2">
            No repair details found
          </h2>
          <p className="text-sm text-[#656565] mb-6">
            Please go back and select a repair history item.
          </p>
          <button
            onClick={() => navigate("/client/repair")}
            className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-6 py-3 rounded-md text-sm font-medium transition"
          >
            Back to Repair History
          </button>
        </div>
      </div>
    );
  }

const displayTitle =
  `${booking.brand !== "—" ? booking.brand : ""} ${booking.model !== "—" ? booking.model : ""}`.trim() ||
  booking.serviceRequired ||
  "Device repair";

  const skillBadges =
    (booking.artisanSkills?.length ? booking.artisanSkills : [booking.deviceType])
      .filter(Boolean)
      .slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-white">
      <section className="w-full py-10 sm:py-14 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => navigate("/client/repair")}
              className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="text-center">
              <h1 className="text-base sm:text-lg font-semibold text-black break-words">
                Request Summary - {booking.id || "—"}
              </h1>
              <p className="text-sm text-[#656565] mt-1">
                View the full repair request details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 lg:gap-8 xl:gap-10 max-w-7xl mx-auto">
            <div className="bg-[#EEF6FF] rounded-xl p-4 w-full xl:w-[340px]">
              <div className="flex flex-col">
                <img
  src={booking.artisanImage}
  alt="artisan"
  className="w-full h-[280px] sm:h-[320px] xl:w-[310px] xl:h-[280px] rounded-xl object-cover object-top mb-4"
/>

                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-black text-xl sm:text-2xl break-words">
                    {booking.artisanName || "Unknown Technician"}
                  </h2>
                  <img src={mark} alt="verified" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <p className="text-sm sm:text-base text-[#656565] mt-1 break-words">
                  {booking.artisanCategory || "Repair Technician"}
                </p>

                <div className="flex items-center gap-1 mt-2 text-sm sm:text-base flex-wrap">
                  <img src={star} alt="star" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-black">
                    {booking.artisanRating ?? "—"}
                  </span>
                  <span className="text-black break-words">
                    (
                    {booking.artisanReviews === "—" || booking.artisanReviews == null
                      ? "reviews unavailable"
                      : `${booking.artisanReviews} reviews`}
                    )
                  </span>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {skillBadges.map((item, index) => (
                    <span
                      key={`${
                        typeof item === "string"
                          ? item
                          : item?.name || item?.title || item?.label || "skill"
                      }-${index}`}
                      className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-xs sm:text-sm break-words"
                    >
                      {typeof item === "string"
                        ? item
                        : item?.name || item?.title || item?.label || "Skill"}
                    </span>
                  ))}
                </div>

                <div className="mt-4 text-sm text-[#656565] space-y-2">
                  {/* <p className="break-words">
                    Experience:{" "}
                    <span className="font-medium text-black">
                      {cleanText(booking.artisanExperience)}
                    </span>
                  </p> */}
                  <p className="break-words">
                    Location:{" "}
                    <span className="font-medium text-black">
                      {cleanText(booking.artisanLocation)}
                    </span>
                  </p>
                  <p className="break-words">
                    Order Status:{" "}
                    <span className="font-medium text-black">
                      {cleanText(booking.progress)}
                    </span>
                  </p>
                  <p className="break-words">
                    Payment Status:{" "}
                    <span className="font-medium text-black">
                      {cleanText(booking.status)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-0 xl:pt-2 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-black mb-6 break-words">
                {displayTitle}
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-black">
                <p className="break-words">
                  <span className="text-[#656565]">Booking ID:</span>{" "}
                  {cleanText(booking.id)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Technician:</span>{" "}
                  {cleanText(booking.artisanName, "Unknown Technician")}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Type:</span>{" "}
                  {cleanText(booking.deviceType)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Brand:</span>{" "}
                  {cleanText(booking.brand)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Model:</span>{" "}
                  {cleanText(booking.model)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Service Required:</span>{" "}
                  {cleanText(booking.serviceRequired)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Issue Description:</span>{" "}
                  {cleanText(booking.issueDescription)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Uploaded Item Name:</span>{" "}
                  {cleanText(booking.objectName)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Client Address:</span>{" "}
                  {cleanText(booking.location)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Created At:</span>{" "}
                  {formatDate(booking.createdAt)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Uploaded At:</span>{" "}
                  {formatDate(booking.uploadedAt)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Artisan Response Deadline:</span>{" "}
                  {formatDate(booking.artisanResponseDeadline)}
                </p>
                {/* <p className="break-words">
                  <span className="text-[#656565]">Payment Reference:</span>{" "}
                  {cleanText(booking.paymentReference)}
                </p> */}
                <p className="break-words">
                  <span className="text-[#656565]">Artisan ID:</span>{" "}
                  {cleanText(booking.artisanId)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Service ID:</span>{" "}
                  {cleanText(booking.serviceId)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Escrow Status:</span>{" "}
                  {cleanText(booking.escrowStatus)}
                </p>

                {booking.uploadedImage && (
                  <div className="pt-4">
                    <p className="text-[#656565] mb-2">Uploaded Image:</p>
                    <img
                      src={booking.uploadedImage}
                      alt="uploaded product"
                      className="w-full max-w-[220px] h-[180px] rounded-xl object-cover border"
                    />
                  </div>
                )}

                <div className="pt-6 space-y-2">
                  <p className="break-words">
                    <span className="text-[#656565]">Service Cost:</span>{" "}
                    {formatNaira(booking.cost)}
                  </p>
                  <p>
  <span className="text-[#656565]">Platform Fee:</span>{" "}
  {formatNaira(platformFee)}
</p>
                  {/* <p className="break-words">
                    <span className="text-[#656565]">Tax Fee:</span> ₦0
                  </p> */}
                  <p className="text-sm sm:text-base font-semibold text-blue-600 pt-2 break-words">
  Total Fee: {formatNaira(totalFee)}
</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 sm:mt-8 lg:mt-16 max-w-4xl mx-auto pb-10 sm:pb-14 px-4 sm:px-6">
        <div className="text-center space-y-4">
          <button
            onClick={() =>
              navigate("/client/view-track-repair", { state: { repair } })
            }
            className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white cursor-pointer w-full sm:w-auto px-8 sm:px-16 py-3 rounded-md text-sm font-medium transition"
          >
            Track Repair
          </button>

          <div>
           <button
  onClick={() =>
    navigate("/client/rate-service", {
      state: { repair }, 
    })
  }
  className="text-sm text-blue-600 cursor-pointer"
>
  Rate Service
</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewRepair;