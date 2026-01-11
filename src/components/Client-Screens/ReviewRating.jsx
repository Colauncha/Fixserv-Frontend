import React, { useState } from "react";
import star from "../../assets/client images/client-home/Star 5.png";
import upload from "../../assets/client images/client-home/uploads.png";


const ReviewRating = () => {

    const [showReviewModal, setShowReviewModal] = useState(false);


  return (
    <div className="w-full bg-white">
      <section className="w-full py-14">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-black">
              Reviews & Ratings
            </h1>
            <p className="text-sm text-black mt-1">
              Manage your feedback and ratings
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F1F1F1] rounded-lg p-6">
              <p className="text-sm text-black">Reviews Given</p>
              <h2 className="text-3xl font-semibold text-black mt-2">2</h2>
            </div>

            <div className="bg-[#F1F1F1] rounded-lg p-6 ">
              <p className="text-sm text-black">Reviews Received</p>
              <h2 className="text-3xl font-semibold text-black mt-2 mb-4">2</h2>
            </div>

            <div className="bg-[#F1F1F1] rounded-lg p-6">
              <p className="text-sm text-black">Average Rating</p>
              <h2 className="text-3xl font-semibold text-black mt-2">5.0</h2>
            </div>
          </div>

          {/* Leave Review Button */}
          <div className="mb-10">
           <button
  onClick={() => setShowReviewModal(true)}
  className="bg-[#3E83C4] text-white px-7 py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
>
  Leave a Review
</button>

          </div>

          {/* Reviews Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Left Review */}
            <div>
              <h3 className="text-lg font-semibold mb-4">My Reviews</h3>

              <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg">
               
                 <div className="flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-xl text-black">
        M
      </div>

      <div>
        <p className="font-bold text-2xl text-black">
          Micheal John
        </p>
        <p className="text-sm text-black mb-4">
          Plumbering Repair
        </p>

        {/* Stars */}
        <div className="flex gap-1 mt-2 mb-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <img key={i} src={star} alt="star" className="w-8 h-8" />
          ))}
        </div>

        <p className="text-sm text-black mb-4">
          Amazing craftsmanship! Highly recommend.
        </p>

        
      </div>
    </div>

    <p className="text-sm text-gray-600">
      10/19/2025
    </p>
  </div>
              </div>
            </div>

            {/* Right Review */}
            <div>
              <h3 className="text-lg font-semibold mb-4">My Reviews</h3>

<div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg">
  <div className="flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-xl text-black">
        S
      </div>

      <div>
        <p className="font-bold text-2xl text-black">
          Client: Sarah Mishael
        </p>
        <p className="text-sm text-black mb-4">
          Carpentry Work
        </p>

        {/* Stars */}
        <div className="flex gap-1 mt-2 mb-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <img key={i} src={star} alt="star" className="w-8 h-8" />
          ))}
        </div>

        <p className="text-sm text-black mb-4">
          Amazing craftsmanship! Highly recommend.
        </p>

        
      </div>
    </div>

    <p className="text-sm text-gray-600">
      10/19/2025
    </p>
  </div>
</div>

            </div>

 {/* Left Review */}
            <div>

              <div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg">
               
                 <div className="flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-xl text-black">
        D
      </div>

      <div>
        <p className="font-bold text-2xl text-black">
          David Brown
        </p>
        <p className="text-sm text-black mb-4">
          Electrical Work
        </p>

        {/* Stars */}
        <div className="flex gap-1 mt-2 mb-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <img key={i} src={star} alt="star" className="w-8 h-8" />
          ))}
        </div>

        <p className="text-sm text-black mb-4">
          Amazing craftsmanship! Highly recommend.
        </p>

        
      </div>
    </div>

    <p className="text-sm text-gray-600">
      10/19/2025
    </p>
  </div>
              </div>
            </div>

            {/* Right Review */}
            <div>

<div className="bg-white border border-gray-200 rounded-xl p-7 shadow-lg">
  <div className="flex justify-between items-start">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-xl text-black">
        T
      </div>

      <div>
        <p className="font-bold text-2xl text-black">
          Client: Tom Wilson
        </p>
        <p className="text-sm text-black mb-4">
          House Renovation
        </p>

        {/* Stars */}
        <div className="flex gap-1 mt-2 mb-4">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <img key={i} src={star} alt="star" className="w-8 h-8" />
          ))}
        </div>

        <p className="text-sm text-black mb-4">
          Amazing craftsmanship! Highly recommend.
        </p>

        
      </div>
    </div>

    <p className="text-sm text-gray-600">
      10/19/2025
    </p>
  </div>
</div>

            </div>

            

          </div>
        </div>
      </section>

      {/* Blur backdrop */}
{showReviewModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>
)}

{/* Leave Review Modal */}
{showReviewModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl relative">

      {/* Close button */}
      <button
        onClick={() => setShowReviewModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      {/* Header */}
      <h2 className="text-lg font-semibold text-black mb-1">
        Leave a Review
      </h2>
      <p className="text-sm text-gray-800 mb-6">
        Share your experience with the artisan's service
      </p>

      {/* Rating */}
      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">Rating</p>

        <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2 w-fit">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
            B
          </div>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <img key={i} src={star} alt="star" className="w-6 h-6" />
            ))}
          </div>
        </div>
      </div>

      {/* Review textarea */}
      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">Your Review</p>
        <textarea
          placeholder="Share details of your experience..."
          className="w-full border border-gray-300 rounded-lg p-4 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#3E83C4]"
        />
      </div>

      {/* Upload */}
      <div className="mb-6">
        <p className="text-sm font-medium text-black mb-2">
          Photos (Optional)
        </p>

        <button className="w-full flex items-center justify-center gap-2 bg-[#3E83C4] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition cursor-pointer">
          <img src={upload} alt="upload" className="w-6 h-6" />
          Upload Photos
        </button>
      </div>

      {/* Submit */}
      <button className="w-full bg-[#3E83C4] text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition cursor-pointer">
        Submit Review
      </button>

    </div>
  </div>
)}

    </div>
  );
};

export default ReviewRating;
