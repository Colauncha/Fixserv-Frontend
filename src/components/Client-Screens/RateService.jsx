import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { useLocation, useNavigate } from "react-router-dom";

import { ArrowLeft, Star } from "lucide-react";

// import { submitReview } from "../../api/review.api"; // 🔌 connect later

const RateService = () => {

const navigate = useNavigate();
const location = useLocation();

const { token } = useAuth();

const repair = location.state?.repair;

  const [rating, setRating] = useState(0);

  const [hover, setHover] = useState(0);

  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);

  if (!repair) {

    return (
      <div className="py-20 text-center text-gray-500">
        No repair found.
      </div>
    );

  }

const handleSubmit = async () => {

  console.log("REPAIR OBJECT =>", repair);

  if (!rating) {

    alert("Please select a rating");

    return;

  }

  if (!comment.trim()) {

    alert("Please enter a comment");

    return;

  }

  if (!token) {

    alert("Your session has expired. Please login again.");

    return;

  }

  try {

    setSubmitting(true);

    const payload = {
  orderId: repair.id || repair.orderId,

  artisanId:
    repair.artisanId ||
    repair.artisan?.id ||
    repair.artisan?._id,

  serviceId:
    repair.serviceId ||
    repair.service?.id ||
    repair.service?._id,

  comment: comment.trim(),

  artisanRating: Number(rating),

  serviceRating: Number(rating),

  ratingDimensions: {
    quality: Number(rating),
    professionalism: Number(rating),
    communication: Number(rating),
    punctuality: Number(rating),
  },
};

    console.log("REVIEW PAYLOAD =>", payload);

    const response = await fetch(
      "https://review-api.fixserv.co/api/reviews/submitReview",
      {
        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },

        body: JSON.stringify(payload),

      }
    );

    const responseData = await response.json().catch(() => null);

console.log("========== REVIEW DEBUG ==========");
console.log("STATUS =>", response.status);
console.log("REVIEW RESPONSE =>", responseData);
console.log("SENT COMMENT =>", payload.comment);
console.log("RETURNED COMMENT =>", responseData?.data?.comment);
console.log("==================================");

    if (!response.ok) {

      if (response.status === 400) {

        alert(
          responseData?.message ||
          "Invalid review information. Please check your rating and comment."
        );

      } else if (response.status === 401) {

        alert("Your session has expired. Please login again.");

      } else if (response.status === 403) {

        alert("You are not authorized to submit this review.");

      } else if (response.status === 404) {

        alert(
          responseData?.message ||
          "The order, artisan, or service could not be found."
        );

      } else if (response.status === 409) {

        alert("You have already submitted a review for this order.");

      } else {

        alert(
          responseData?.message ||
          "Failed to submit review. Please try again."
        );

      }

      return;

    }

    console.log("REVIEW SUBMITTED SUCCESSFULLY =>", responseData);

    alert("Thanks for your feedback!");

    navigate("/client");

  } catch (err) {

    console.error("REVIEW SUBMISSION ERROR =>", err);

    alert("Failed to submit review. Please check your connection and try again.");

  } finally {

    setSubmitting(false);

  }

};

  const repairTitle =

    `${repair.deviceBrand || ""} ${repair.deviceModel || ""}`.trim() ||

    repair.deviceType ||

    "Device Repair";

  return (

    <section className="w-full py-14 bg-white">

      <div className="max-w-xl mx-auto px-6">

        {/* BACK */}

        <button

          onClick={() => navigate(-1)}

          className="flex items-center gap-1 text-[#3E83C4] mb-8"

        >

          <ArrowLeft size={18} />

          <span className="text-sm">Back</span>

        </button>

        {/* HEADER */}

        <div className="text-center mb-10">

          <h2 className="text-xl font-semibold text-black">

            Rate Your Experience

          </h2>

          <p className="text-sm text-gray-500 mt-1">

            How was your repair service?

          </p>

        </div>

        {/* REPAIR INFO */}

        <div className="text-center mb-6">

          <p className="font-medium text-lg">{repairTitle}</p>

          <p className="text-sm text-gray-500">Repair ID: #{repair.id}</p>

        </div>

        {/* ⭐ STAR RATING */}

        <div className="flex justify-center gap-3 mb-6">

          {[1, 2, 3, 4, 5].map((star) => {

            const active = star <= (hover || rating);

            return (

              <Star

                key={star}

                size={34}

                onClick={() => setRating(star)}

                onMouseEnter={() => setHover(star)}

                onMouseLeave={() => setHover(0)}

                className={`cursor-pointer transition ${

                  active ? "text-yellow-400 fill-yellow-400" : "text-gray-300"

                }`}

              />

            );

          })}

        </div>

        {/* LABEL */}

        <p className="text-center text-sm text-gray-500 mb-6">

          {rating === 0 && "Tap a star to rate"}

          {rating === 1 && "Very Poor"}

          {rating === 2 && "Poor"}

          {rating === 3 && "Okay"}

          {rating === 4 && "Good"}

          {rating === 5 && "Excellent"}

        </p>

        {/* COMMENT */}

        <textarea

          value={comment}

          onChange={(e) => setComment(e.target.value)}

          placeholder="Tell us more about your experience"

          className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none mb-6"

          rows={4}

        />

        {/* SUBMIT */}

        <button

          onClick={handleSubmit}

          disabled={submitting}

          className={`w-full py-3 rounded-lg text-white font-medium transition cursor-pointer ${

            submitting

              ? "bg-gray-400 cursor-not-allowed"

              : "bg-[#3E83C4] hover:bg-[#2d75b8]"

          }`}

        >

          {submitting ? "Submitting..." : "Submit Rating"}

        </button>

      </div>

    </section>

  );

};

export default RateService;