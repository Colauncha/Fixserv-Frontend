import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
// import { submitReview } from "../../api/review.api"; // 🔌 connect later

const RateService = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        orderId: repair.id || repair.orderId,
        rating,
        comment,
      };

      console.log("REVIEW PAYLOAD =>", payload);

      alert("Thanks for your feedback!");

      navigate("/client"); 
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
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
          placeholder="Tell us more about your experience (optional)"
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
