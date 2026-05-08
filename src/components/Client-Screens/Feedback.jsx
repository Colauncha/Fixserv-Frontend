import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../../context/AuthContext";
import { useAuth } from "../../context/AuthContext";

import bg from "../../assets/client images/client-home/referal part/referalbg.png";
import overlayOne from "../../assets/client images/client-home/referal part/referalbgoverlayone.png";
import overlayTwo from "../../assets/client images/client-home/referal part/referalbgoverlaytwo.png";

const GENERAL_API = import.meta.env.VITE_GENERAL_API_BASE_URL;

const FeedbackPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);

  const categories = [
    "General",
    "Bug Report",
    "Feature Request",
    "Payment Issue",
    "Service Experience",
  ];
 
  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Please enter your feedback");
      return;
    }

    try {
      setSending(true);

      const res = await fetch(`${GENERAL_API}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          category,
          message,
          rating,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit feedback");
      }

      alert("Feedback submitted successfully 🎉");
      setMessage("");
      setRating(0);
      setCategory("General");
    } catch (err) {
      console.log(err);
      alert(err.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="relative w-full min-h-[260px] bg-[#254B71] overflow-hidden">
        <img src={bg} className="absolute inset-0 w-full h-full object-cover" />
        <img src={overlayOne} className="absolute inset-0 w-full h-full object-cover" />
        <img src={overlayTwo} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4 pt-16 pb-10">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-4 text-sm"
          >
            ← Back
          </button>

          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
            Give Feedback
          </h1>
          <p className="text-sm text-blue-100 max-w-md">
            Help us improve your experience by sharing your thoughts
          </p>
        </div>
      </section>

      {/* FORM CARD */}
      <section className="relative -mt-10 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#EFF7FF] p-6 sm:p-8 rounded-2xl shadow-xl">
            <div className="bg-white rounded-xl p-6 sm:p-8 space-y-6">
              
              {/* CATEGORY */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={5}
                  className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none resize-none"
                />
              </div>

              {/* RATING */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setRating(num)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer ${
                        rating >= num
                          ? "bg-[#3E83C4] text-white border-[#3E83C4]"
                          : "bg-white text-gray-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full bg-[#3E83C4] text-white py-3 rounded-lg text-sm sm:text-base cursor-pointer disabled:opacity-60"
              >
                {sending ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;