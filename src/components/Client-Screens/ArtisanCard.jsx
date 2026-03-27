import React from "react";
import profileImage from "../../assets/client images/client-home/profile.png";
import mark from "../../assets/client images/client-home/mark.png";
import star from "../../assets/client images/client-home/star.png";

const ArtisanCard = ({ artisan }) => {
  if (!artisan) return null;

  return (
    <div className="bg-[#EEF6FF] w-full max-w-[340px] mx-auto lg:mx-0 lg:max-w-[420px] xl:max-w-[460px]">
      <div className="flex flex-col gap-3">

        {/* Image */}
        <img
          src={artisan.image || profileImage}
          alt="artisan"
          className="w-full h-[300px] lg:h-[280px] xl:h-[280px] rounded-xl object-cover object-top shadow-md"
        />

        {/* Name + Verified */}
        <div className="flex items-center justify-between mt-2">
          <h2 className="font-semibold text-black text-xl lg:text-2xl leading-tight">
            {artisan.name}
          </h2>

          <img src={mark} alt="verified" className="w-5 h-5 shrink-0" />
        </div>

        {/* Profession */}
        {/* <p className="text-base lg:text-lg text-[#656565]">
          {artisan.profession}
        </p> */}

        {/* Skills */}
        {artisan.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {artisan.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-[#D6E8FA] text-[#2F6FAF] px-2.5 py-1 rounded-md text-xs lg:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2 text-base lg:text-lg">
          <img src={star} alt="star" className="w-5 h-5" />
          <span className="font-medium text-black">
            {artisan.rating?.toFixed(1)}
          </span>
          <span className="text-black">
            ({artisan.reviewsCount} reviews)
          </span>
        </div>

        {/* Categories */}
        {artisan.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {artisan.categories.map((cat, idx) => (
              <span
                key={idx}
                className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-full text-xs lg:text-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="mt-3 text-sm lg:text-base text-[#656565] space-y-1">
          <p>
            Experience:{" "}
            <span className="font-medium text-black">
              {artisan.experience != null
                ? `${artisan.experience}+ years`
                : "—"}
            </span>
          </p>

          <p>
            Location:{" "}
            <span className="font-medium text-black">
              {artisan.location}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ArtisanCard;