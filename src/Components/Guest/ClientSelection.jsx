import React from "react";
import contactIcon from "../../assets/icons/contact-icon.png"; 

const ClientSelection = ({ artisan }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Profile Card */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 border p-4 rounded-md">
          <div className="flex items-center gap-4">
            <img
              src={artisan.profileImage}
              alt={artisan.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{artisan.name}</h2>
              <p className="text-[#110000C2]">★ {artisan.rating} ({artisan.reviewsCount})</p>
              <p className="text-sm text-[#110000C2]">{artisan.location}</p>
              <button className="mt-2 px-4 py-1 bg-[#7A9DF7] text-[#110000C2] rounded hover:bg-blue-700">
                Book Me
              </button>
            </div>
          </div>

          {/* About Me */}
          <div className="mt-4">
            <h3 className="font-semibold">About me</h3>
            <p className="text-[#110000C2] mt-1">{artisan.about}</p>
            <h4 className="mt-2 font-semibold">Skills</h4>
            <p className="text-sm text-blue-600">
              {artisan.skills.join(", ")}
            </p>
          </div>
        </div>

        {/* Side Availability Card */}
        <div className="w-full md:w-64 border shadow-md p-4 rounded-md">
          <div className="flex items-center gap-3">
            <img
              src={artisan.profileImage}
              alt={artisan.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{artisan.name}</p>
              <span className="text-[#110000C2] text-sm">
                {artisan.available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          <img src={contactIcon} alt="Contact" className="inline-block w-5 h-5 mr-2" />
          <button className="mt-4 w-full bg-[#7A9DF7] text-white py-2 rounded hover:bg-blue-700">
            <img  />
            Contact me
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <div className="space-y-4 mt-2">
          {artisan.reviews.map((review, index) => (
            <div key={index} className="border p-3 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  <span className="text-sm text-gray-500">
                    {review.country} • {review.time}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-[#110000C2]">{"★".repeat(review.rating)}</p>
              <p className="text-[#110000C2] mt-1">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                Helpful? {review.helpful ? "Yes" : "No"} •{" "}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientSelection;

