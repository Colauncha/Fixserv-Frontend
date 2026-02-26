import React, { useState, useEffect }  from "react";
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


const BookingSummary = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const [finalBooking, setFinalBooking] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");


const paymentMethods = [
  { img: master, label: "Mastercard" },
  { img: paypal, label: "PayPal" },
  { img: visa, label: "Visa" },
  { img: wallet, label: "Wallet" },
];

const [selected, setSelected] = useState("Mastercard");

const location = useLocation();

const artisan = location.state?.artisan;
const booking = location.state?.booking;

const uploadDeviceImage = async (token, userId) => {
  const fd = new FormData();

  fd.append("productImage", booking.imageFile);
  fd.append(
    "objectName",
    `Damaged Device - ${booking.deviceType} ${booking.brand} ${booking.model}`.trim()
  );
  fd.append("description", booking.issueDescription || "Damaged device image");

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
    data?.product?.uuid;

  const imageUrl = data?.product?.imageUrl || "";

  if (!uploadedProductId) {
    throw new Error("Upload succeeded but uploadedProductId missing.");
  }

  return { uploadedProductId, imageUrl };
};


const handleWalletPayment = async () => {
  try {
    setSubmitError("");
    setIsSubmitting(true);
    setActiveModal("processing");

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

    // Upload
    const uploaded = await uploadDeviceImage(token, userId);

    // Create draft
const draftPayload = {
  uploadedProductId: uploaded.uploadedProductId,
  deviceType: booking.deviceType,
  deviceBrand: booking.brand,
  deviceModel: booking.model,
  serviceRequired: booking.serviceRequired,
};

const createdOrder = await createDraftOrder(draftPayload);
const orderId = createdOrder?.id || createdOrder?.data?.id;

if (!orderId) {
  throw new Error("Order created but no id was returned.");
}


    localStorage.setItem("fixserv_last_order_id", orderId);
    localStorage.setItem("fixserv_last_uploaded_image_url", uploaded.imageUrl);

    setFinalBooking({
      ...booking,
      id: orderId,
      damagedDeviceImageUrl: uploaded.imageUrl,
    });

    setActiveModal("success");
  } catch (err) {
    console.error(err);
    setActiveModal("wallet");
    setSubmitError(err?.message || "Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};

const MODAL = {
  WALLET: "wallet",
  PROCESSING: "processing",
  SUCCESS: "success",
  CANCEL: "cancel",
};

useEffect(() => {
  if (activeModal) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
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
      
      {/* <section className="w-full px-24 md:px-53 py-14"> */}
                <section className="w-full py-14 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-6">
  
        {/* Header */}
        <div className="text-center mb-12">
          <button onClick={() => navigate(-1)} className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1">
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

        {/* Main Content */}
      <div className="grid grid-cols-[260px_1fr] gap-30 max-w-7xl mx-auto">
          {/* LEFT — Artisan Card */}
          <div className="bg-[#EEF6FF] rounded-xl p-4 w-[290px]">
            <div className="flex flex-col">
          
              <img
                src={profileImage}
                alt="artisan"
                className="w-[250px] h-[220px] rounded-xl object-cover mb-4"
              />
          
              <div className="flex items-center gap-7">
                <h2 className="font-semibold text-black text-2xl">
  {artisan.fullName}
</h2>

                <img src={mark} alt="verified" className="w-5 h-5" />
              </div>
          
              <p className="text-lg text-[#656565] mt-1">
                Electronics Technicians
              </p>
          
              {/* Rating */}
              <div className="flex items-center gap-1 mt-2 text-lg">
                <img src={star} alt="star" className="w-6 h-6" />
                <span className="font-medium text-black">4.7</span>
                <span className="text-black">(89 reviews)</span>
              </div>
          
              {/* Categories */}
              <div className="flex gap-2 mt-3">
                {["Phone", "Tablet", "Laptop"].map((item) => (
                  <span
                    key={item}
                    className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-lg"
                  >
                    {item}
                  </span>
                ))}
              </div>
          
              <div className="mt-4 text-lg text-[#656565] space-y-1">
                <p>
                  Experience: <span className="font-medium text-black">5+ years</span>
                </p>
                <p>
                  Location: <span className="font-medium text-black">Surulere, Lagos</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Booking Summary */}

          <div className="pt-2">
<h2 className="text-lg font-semibold text-black mb-6">
  {booking.serviceRequired}
</h2>

  <div className="space-y-3 text-lg text-black">

    <p><span className="text-[#656565]">Booking ID:</span> FX1230</p>
<p>
  <span className="text-[#656565]">Device Type:</span>{" "}
  {booking.deviceType}
</p>

<p>
  <span className="text-[#656565]">Device Brand:</span>{" "}
  {booking.brand}
</p>

<p>
  <span className="text-[#656565]">Device Model:</span>{" "}
  {booking.model}
</p>

<p>
  <span className="text-[#656565]">Issue description:</span>{" "}
  {booking.issueDescription}
</p>

<p>
  <span className="text-[#656565]">Location:</span>{" "}
  {booking.location}
</p>
    <div className="pt-6 space-y-2">
      <p><span className="text-[#656565]">Service Cost:</span> ₦7,000.00</p>
      <p><span className="text-[#656565]">Platform Fee:</span> ₦500.00</p>
      <p><span className="text-[#656565]">Tax Fee:</span> ₦0.00</p>
      <p className="text-base font-semibold text-blue-600 pt-2">
        Total Fee: ₦7,500.00
      </p>
    </div>
  </div>
</div>

        </div>
        </div>
      </section>
      

      {/* <section className="mt-16 max-w-4xl mx-auto"> */}

              <section className="w-full py-2 overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-6">
  
  <h3 className="text-base font-semibold mb-4">
    Payment Method
  </h3>

  {/* Payment Options */}
  {/* <div className="grid grid-cols-4 gap-6 mb-10">

    {[
      { img: master, label: "Mastercard" },
      { img: paypal, label: "PayPal" },
      { img: visa, label: "Visa" },
      { img: wallet, label: "Wallet" },
    ].map((item, idx) => (
      <div
        key={idx}
        className="flex items-center gap-3"
      >
        <div className="w-4 h-4 rounded-full border border-[#C1DAF3]" />
        <img src={item.img} alt={item.label} className="h-42 w-42
         object-contain" />
      </div>
    ))}

  </div> */}

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
            {/* Radio */}
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center
                ${
                  isActive
                    ? "border-[#3e83c4]"
                    : "border-[#C1DAF3]"
                }`}
            >
              {isActive && (
                <div className="w-4 h-4 rounded-full bg-[#3e83c4]" />
              )}
            </div>

            {/* Logo */}
            <img
              src={item.img}
              alt={item.label}
              className="h-42 w-42 object-contain"
            />
          </button>
        );
      })}
    </div>

  {/* Card Details */}
  <div className="space-y-8">

 <div className="grid grid-cols-2 gap-6">
  {/* Card Number */}
  <div className="flex items-center gap-2">
    <label className="text-sm text-[#8B8B8B] w-24">
      Card Number*
    </label>

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
      className="flex-1 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none
                 focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
    />
  </div>

  {/* Cardholder */}
  <div className="flex items-center gap-2">
    <label className="text-sm text-[#8B8B8B] w-24">
      Cardholder*
    </label>

    <input
      type="text"
      placeholder="Name"
      className="flex-1 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none
                 focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
    />
  </div>
</div>


    <div className="grid grid-cols-2 gap-8">
<div className="flex items-center gap-2">
  <label className="text-sm text-[#8B8B8B] w-10">
    Expiry
  </label>

  <input
    type="text"
    placeholder="MM / YY"
    maxLength={5}
    inputMode="numeric"
    onInput={(e) => {
      let value = e.target.value.replace(/[^0-9]/g, "");

      if (value.length >= 3) {
        value = value.slice(0, 2) + " / " + value.slice(2, 4);
      }

      e.target.value = value;
    }}
    className="w-36 border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none
               focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
  />
</div>


  <div className="flex items-center">
  <label className="text-sm text-[#8B8B8B] w-10">
    CVV
  </label>

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
      className="w-full border border-[#87AACB] rounded-md px-3 py-2.5 text-sm text-gray-700 outline-none
                 focus:border-[#3e83c4] focus:ring-1 focus:ring-[#3e83c4]"
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

  {/* Actions */}
  <div className="mt-14 text-center space-y-4">
<button onClick={() => setActiveModal(MODAL.WALLET)}
  className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-3 rounded-md text-sm font-medium transition cursor-pointer"
>
  Make Payment
</button>


    <div>
      <button
  onClick={() => setActiveModal("cancel")}
  className="text-sm text-blue-600 cursor-pointer"
>
  Cancel Booking
</button>

{activeModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-[400px] p-6 relative">

{activeModal === "wallet" && (
  <div className="text-center space-y-4">
    <img src={walletPay} alt="wallet" className="mx-auto w-12" />

    <h3 className="font-semibold text-lg">Your Wallet</h3>
    <p className="text-sm text-gray-500">
      This amount will be deducted from your wallet once you confirm this booking
    </p>

    <div className="text-sm space-y-1 text-left mt-4">
      <p>Payment Details</p>
      <p>Total: ₦7,500.00</p>
      <p>Balance: ₦18,500.00</p>
      <p>Balance After Payment: ₦11,000.00</p>
    </div>

{/* <button
  disabled={isSubmitting}
  onClick={async () => {
    try {
      setSubmitError("");
      setIsSubmitting(true);
      setActiveModal("processing");

      // 1) Upload damaged device image
      const token = localStorage.getItem("fixserv_token");
      const user = JSON.parse(localStorage.getItem("fixserv_user") || "{}");
      const userId = user?.id || user?._id;

      if (!token) throw new Error("Token not found. Please login again.");
      if (!userId) throw new Error("User ID not found. Please login again.");
      if (!booking?.imageFile) throw new Error("No image selected.");

      const fd = new FormData();
      fd.append("productImage", booking.imageFile);
      fd.append(
        "objectName",
        `Damaged Device - ${booking.deviceType} ${booking.brand} ${booking.model}`.trim()
      );
      fd.append("description", booking.issueDescription || "Damaged device image");

      const uploadRes = await fetch(
        `https://dev-user-api.fixserv.co/api/upload/${userId}/upload-products`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData?.message || "Image upload failed");

      const uploadedProductId =
        uploadData?.product?.uploadedProductId ||
        uploadData?.product?.id ||
        uploadData?.product?._id ||
        uploadData?.product?.uuid;

      const uploadedImageUrl = uploadData?.product?.imageUrl || "";

      if (!uploadedProductId) {
        throw new Error("Upload succeeded but uploadedProductId was not returned.");
      }

      // 2) Create draft order
      const draftPayload = {
        uploadedProductId,
        deviceType: booking.deviceType,
        deviceBrand: booking.brand,
        deviceModel: booking.model,
        serviceRequired: booking.serviceRequired,
      };

      const createdOrder = await createDraftOrder(draftPayload);
      const orderId = createdOrder?.id || createdOrder?.data?.id;

      if (!orderId) throw new Error("Order created but no id was returned.");

      // 3) Persist for TrackRepair (refresh-safe)
      localStorage.setItem("fixserv_last_order_id", orderId);
      localStorage.setItem("fixserv_last_uploaded_image_url", uploadedImageUrl);

      // 4) Success modal
      setFinalBooking({
        ...booking,
        id: orderId, // ✅ important
        damagedDeviceImageUrl: uploadedImageUrl,
      });

      setActiveModal("success");
    } catch (err) {
      console.error(err);
      setActiveModal("wallet");
      setSubmitError(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }}
  className={`w-full bg-blue-600 text-white py-2 rounded-md ${
    isSubmitting ? "opacity-60 cursor-not-allowed" : ""
  }`}
>
  {isSubmitting ? "Uploading..." : "Make Payment"}
</button> */}

<button
  disabled={isSubmitting}
  onClick={handleWalletPayment}
  className={`w-full bg-blue-600 text-white py-2 rounded-md ${
    isSubmitting ? "opacity-60 cursor-not-allowed" : ""
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

{activeModal === "processing" && (
  <div className="text-center space-y-4">
    <img src={loading} alt="loading" className="mx-auto w-12 animate-spin" />

    <h3 className="font-semibold text-lg">Payment Processing</h3>
    <p className="text-sm text-gray-500">
      Verifying your payment, this may take a few seconds
    </p>
  </div>
)}

{activeModal === "success" && (
  <div className="text-center space-y-4">
    <img src={success} alt="success" className="mx-auto w-12" />

    <h3 className="font-semibold text-lg">Booking Confirmed</h3>
    <p className="text-sm text-gray-500">
      Your booking has been successfully confirmed
    </p>

   <button
  onClick={() =>
    navigate(`/client/track-repair/${finalBooking?.id}`)
    // navigate("/client/track-repair", {
    //   state: { orderId: finalBooking?.id, artisan },
    // })
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

{activeModal === "cancel" && (
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


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import profileImage from "../../assets/client images/client-home/profile.png";
// import mark from "../../assets/client images/client-home/mark.png";
// import star from "../../assets/client images/client-home/star.png";
// import master from "../../assets/client images/client-home/master.png";
// import paypal from "../../assets/client images/client-home/paypal.png";
// import visa from "../../assets/client images/client-home/visa.png";
// import wallet from "../../assets/client images/client-home/wallet.png";
// import creditImg from "../../assets/client images/client-home/creditcard.png";
// import walletPay from "../../assets/client images/client-home/walletpay.png";
// import loading from "../../assets/client images/client-home/loading.png";
// import success from "../../assets/client images/client-home/success.png";
// import failure from "../../assets/client images/client-home/cancel.png";
// import { createDraftOrder } from "../../api/order.api";

// const MODAL = {
//   WALLET: "wallet",
//   PROCESSING: "processing",
//   SUCCESS: "success",
//   CANCEL: "cancel",
// };

// const BookingSummary = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const artisan = location.state?.artisan;
//   const booking = location.state?.booking;

//   const [activeModal, setActiveModal] = useState(null);
//   const [finalBooking, setFinalBooking] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");
//   const [selected, setSelected] = useState("Mastercard");

//   const paymentMethods = [
//     { img: master, label: "Mastercard" },
//     { img: paypal, label: "PayPal" },
//     { img: visa, label: "Visa" },
//     { img: wallet, label: "Wallet" },
//   ];

//   useEffect(() => {
//     document.body.style.overflow = activeModal ? "hidden" : "auto";
//   }, [activeModal]);

//   if (!artisan || !booking) {
//     return (
//       <div className="py-20 text-center text-gray-500">
//         Booking details not found. Please start again.
//       </div>
//     );
//   }

//   // Helper: Upload image
//   const uploadDeviceImage = async (token, userId) => {
//     const fd = new FormData();
//     fd.append("productImage", booking.imageFile);
//     fd.append(
//       "objectName",
//       `Damaged Device - ${booking.deviceType} ${booking.brand} ${booking.model}`.trim()
//     );
//     fd.append("description", booking.issueDescription || "Damaged device image");

//     const res = await fetch(
//       `https://dev-user-api.fixserv.co/api/upload/${userId}/upload-products`,
//       { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
//     );

//     const data = await res.json();
//     if (!res.ok) throw new Error(data?.message || "Image upload failed");

//     const uploadedProductId =
//       data?.product?.uploadedProductId || data?.product?.id || data?.product?._id || data?.product?.uuid;
//     const imageUrl = data?.product?.imageUrl || "";

//     if (!uploadedProductId) throw new Error("Upload succeeded but uploadedProductId missing.");
//     return { uploadedProductId, imageUrl };
//   };

//   // Wallet payment flow
//   const handleWalletPayment = async () => {
//     try {
//       setSubmitError("");
//       setIsSubmitting(true);
//       setActiveModal(MODAL.PROCESSING);

//       const token = localStorage.getItem("fixserv_token");
//       const storedUser = localStorage.getItem("fixserv_user");
//       const user = storedUser ? JSON.parse(storedUser) : null;
//       const userId = user?.id || user?._id;

//       if (!token) throw new Error("Token not found. Please login again.");
//       if (!userId) throw new Error("User ID not found. Please login again.");
//       if (!booking?.imageFile) throw new Error("No image selected.");

//       // 1) Upload device image
//       const uploaded = await uploadDeviceImage(token, userId);

//       // 2) Create draft order
//       const draftPayload = {
//         uploadedProductId: uploaded.uploadedProductId,
//         deviceType: booking.deviceType,
//         deviceBrand: booking.brand,
//         deviceModel: booking.model,
//         serviceRequired: booking.serviceRequired,
//       };

//       const createdOrder = await createDraftOrder(draftPayload);
//       const orderId = createdOrder?.id || createdOrder?.data?.id;
//       if (!orderId) throw new Error("Order created but no id was returned.");

//       // 3) Persist for TrackRepair
//       localStorage.setItem("fixserv_last_order_id", orderId);
//       localStorage.setItem("fixserv_last_uploaded_image_url", uploaded.imageUrl);

//       // 4) Success modal
//       setFinalBooking({ ...booking, id: orderId, damagedDeviceImageUrl: uploaded.imageUrl });
//       setActiveModal(MODAL.SUCCESS);
//     } catch (err) {
//       console.error(err);
//       setActiveModal(MODAL.WALLET);
//       setSubmitError(err?.message || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Compute totals dynamically
//   const serviceCost = booking?.serviceCost || 7000;
//   const platformFee = booking?.platformFee || 500;
//   const taxFee = booking?.taxFee || 0;
//   const totalFee = serviceCost + platformFee + taxFee;

//   return (
//     <div className="w-full min-h-screen bg-white">
//       {/* Header + Booking Info */}
//       <section className="w-full py-14 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-2 md:px-6">
//           <div className="text-center mb-12">
//             <button onClick={() => navigate(-1)} className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1">
//               <ArrowLeft size={18} /> Back
//             </button>
//             <h1 className="text-lg font-semibold text-black">Review & Confirm Booking</h1>
//             <p className="text-sm text-[#656565] mt-1">
//               Double-check your request and make payment to confirm
//             </p>
//           </div>

//           <div className="grid grid-cols-[260px_1fr] gap-30 max-w-7xl mx-auto">
//             {/* Left Artisan */}
//             <div className="bg-[#EEF6FF] rounded-xl p-4 w-[290px]">
//               <div className="flex flex-col">
//                 <img src={profileImage} alt="artisan" className="w-[250px] h-[220px] rounded-xl object-cover mb-4" />
//                 <div className="flex items-center gap-2">
//                   <h2 className="font-semibold text-black text-3xl">{artisan.fullName}</h2>
//                   <img src={mark} alt="verified" className="w-6 h-6" />
//                 </div>
//                 <p className="text-lg text-[#656565] mt-1">Electronics Technicians</p>
//                 <div className="flex items-center gap-1 mt-2 text-lg">
//                   <img src={star} alt="star" className="w-6 h-6" />
//                   <span className="font-medium text-black">4.7</span>
//                   <span className="text-black">(89 reviews)</span>
//                 </div>
//                 <div className="flex gap-2 mt-3">
//                   {["Phone", "Tablet", "Laptop"].map((item) => (
//                     <span key={item} className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-lg">
//                       {item}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="mt-4 text-lg text-[#656565] space-y-1">
//                   <p>Experience: <span className="font-medium text-black">5+ years</span></p>
//                   <p>Location: <span className="font-medium text-black">Surulere, Lagos</span></p>
//                 </div>
//               </div>
//             </div>

//             {/* Right Booking Summary */}
//             <div className="pt-2">
//               <h2 className="text-lg font-semibold text-black mb-6">{booking.serviceRequired}</h2>
//               <div className="space-y-3 text-lg text-black">
//                 <p><span className="text-[#656565]">Booking ID:</span> FX1230</p>
//                 <p><span className="text-[#656565]">Device Type:</span> {booking.deviceType}</p>
//                 <p><span className="text-[#656565]">Device Brand:</span> {booking.brand}</p>
//                 <p><span className="text-[#656565]">Device Model:</span> {booking.model}</p>
//                 <p><span className="text-[#656565]">Issue description:</span> {booking.issueDescription}</p>
//                 <p><span className="text-[#656565]">Location:</span> {booking.location}</p>
//                 <div className="pt-6 space-y-2">
//                   <p><span className="text-[#656565]">Service Cost:</span> ₦{serviceCost.toLocaleString()}</p>
//                   <p><span className="text-[#656565]">Platform Fee:</span> ₦{platformFee.toLocaleString()}</p>
//                   <p><span className="text-[#656565]">Tax Fee:</span> ₦{taxFee.toLocaleString()}</p>
//                   <p className="text-base font-semibold text-blue-600 pt-2">
//                     Total Fee: ₦{totalFee.toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Payment Section */}
//       <section className="w-full py-2 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-2 md:px-6">
//           <h3 className="text-base font-semibold mb-4">Payment Method</h3>
//           <div className="grid grid-cols-4 gap-6 mb-5">
//             {paymentMethods.map((item) => {
//               const isActive = selected === item.label;
//               return (
//                 <button key={item.label} type="button" onClick={() => setSelected(item.label)} className="flex items-center gap-3 p-3">
//                   <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isActive ? "border-[#3e83c4]" : "border-[#C1DAF3]"}`}>
//                     {isActive && <div className="w-4 h-4 rounded-full bg-[#3e83c4]" />}
//                   </div>
//                   <img src={item.img} alt={item.label} className="h-42 w-42 object-contain" />
//                 </button>
//               );
//             })}
//           </div>

//           {/* Card Details */}
//           <div className="space-y-8">
//             {/* ... card input fields ... */}
//           </div>

//           {/* Actions */}
//           <div className="mt-14 text-center space-y-4">
//             <button
//               onClick={() => setActiveModal(MODAL.WALLET)}
//               className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-3 rounded-md text-sm font-medium transition cursor-pointer"
//             >
//               Make Payment
//             </button>
//             <div>
//               <button onClick={() => setActiveModal(MODAL.CANCEL)} className="text-sm text-blue-600 cursor-pointer">
//                 Cancel Booking
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modals */}
//       {activeModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-[400px] p-6 relative">

//             {/* WALLET CONFIRMATION */}
//             {activeModal === MODAL.WALLET && (
//               <div className="text-center space-y-4">
//                 <img src={walletPay} alt="wallet" className="mx-auto w-12" />
//                 <h3 className="font-semibold text-lg">Your Wallet</h3>
//                 <p className="text-sm text-gray-500">
//                   This amount will be deducted from your wallet once you confirm this booking
//                 </p>
//                 <div className="text-sm space-y-1 text-left mt-4">
//                   <p>Payment Details</p>
//                   <p>Total: ₦{totalFee.toLocaleString()}</p>
//                   {/* Replace these with dynamic user wallet values if available */}
//                   <p>Balance: ₦18,500</p>
//                   <p>Balance After Payment: ₦{18500 - totalFee}</p>
//                 </div>
//                 <button
//                   disabled={isSubmitting}
//                   onClick={handleWalletPayment}
//                   className={`w-full bg-blue-600 text-white py-2 rounded-md ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
//                 >
//                   {isSubmitting ? "Uploading..." : "Make Payment"}
//                 </button>
//                 {submitError && <p className="text-sm text-red-500 mt-3">{submitError}</p>}
//                 <button onClick={() => setActiveModal(null)} className="text-sm text-blue-600">
//                   Cancel Booking
//                 </button>
//               </div>
//             )}

//             {/* PROCESSING */}
//             {activeModal === MODAL.PROCESSING && (
//               <div className="text-center space-y-4">
//                 <img src={loading} alt="loading" className="mx-auto w-12 animate-spin" />
//                 <h3 className="font-semibold text-lg">Payment Processing</h3>
//                 <p className="text-sm text-gray-500">Verifying your payment, this may take a few seconds</p>
//               </div>
//             )}

//             {/* SUCCESS */}
//             {activeModal === MODAL.SUCCESS && (
//               <div className="text-center space-y-4">
//                 <img src={success} alt="success" className="mx-auto w-12" />
//                 <h3 className="font-semibold text-lg">Booking Confirmed</h3>
//                 <p className="text-sm text-gray-500">Your booking has been successfully confirmed</p>
//                 <button
//                   onClick={() => navigate(`/client/track-repair/${finalBooking?.id}`)}
//                   disabled={!finalBooking?.id}
//                   className={`w-full bg-blue-600 text-white py-2 rounded-md ${!finalBooking?.id ? "opacity-60 cursor-not-allowed" : ""}`}
//                 >
//                   Track Repair
//                 </button>
//               </div>
//             )}

//             {/* CANCEL */}
//             {activeModal === MODAL.CANCEL && (
//               <div className="text-center space-y-4">
//                 <img src={failure} alt="cancel" className="mx-auto w-12" />
//                 <h3 className="font-semibold text-lg">Cancel Booking?</h3>
//                 <p className="text-sm text-gray-500">Are you sure you want to cancel this booking?</p>
//                 <button onClick={() => setActiveModal(null)} className="w-full bg-red-500 text-white py-2 rounded-md">
//                   Yes, Cancel Booking
//                 </button>
//                 <button onClick={() => setActiveModal(null)} className="text-sm text-blue-600">Go Back</button>
//               </div>
//             )}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingSummary;
