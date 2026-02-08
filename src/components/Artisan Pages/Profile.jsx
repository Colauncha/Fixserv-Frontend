import { useEffect, useState } from "react";
import { getAuthToken } from "../../utils/auth";
import star from "../../assets/Artisan Images/star.png";
import location from "../../assets/Artisan Images/location.png";
import badge from "../../assets/Artisan Images/badge.png";
import profileImg from "../../assets/Artisan Images/adebayo.png";
import not from "../../assets/Artisan Images/not.png";
import profile from "../../assets/Artisan Images/adebayo.png";

const Profile = () => {
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://user-management-h4hg.onrender.com/api/artisan/profile",
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        const data = await res.json();
        setArtisan(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
  return <p className="p-6 text-gray-500">Loading profile...</p>;
}

if (!artisan) {
  return <p className="p-6 text-red-500">Failed to load profile</p>;
}


  return (
    <div className="w-full pr-4">

      {/* Top Header */}
      <div className="flex justify-between p-4 items-center mb-4">
        <h1 className="text-2xl font-semibold text-black">Profile</h1>

       <div className="flex items-center gap-4">
                 <img src={not} className="w-11 h-9 cursor-pointer" />
                 <img src={profile} className="w-9 h-9 rounded-full cursor-pointer" />
               </div>
      </div>

      <div className="border-t border-blue-100">

        {/* Main Profile Row */}
<div className="pl-6">
          <div className="flex gap-8 items-start mt-6">

          {/* Profile Image */}
          <div className="relative w-44 h-44">
            <img
              src={artisan.profileImage ||profileImg}
              className="w-full h-full rounded-full object-cover border-[6px] border-[#3E83C4]"
            />

            <div className="absolute -bottom-1 left-2">
              <img src={badge} className="w-12" />
            </div>
          </div>

          {/* Name & Info */}
<div className="flex flex-col justify-center">
  <h2 className="text-2xl font-semibold mb-1">{artisan.fullName}</h2>

  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
    <img src={star} className="w-4" />
    <span>{artisan.rating} ({artisan.reviewsCount})</span>
  </div>

  <div className="flex items-center gap-2 text-sm text-gray-600">
    <img src={location} className="w-4" />
    <span>{artisan.location}</span>
  </div>
</div>

        </div>

        {/* About Me */}
        <div className="mt-8 max-w-xl">
          <h3 className="font-semibold mb-1">About me</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {artisan.about}
          </p>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-semibold mb-1">Skills</h3>
          <p className="text-sm text-gray-600">{artisan.skills?.join(", ")}</p>
        </div>

        {/* Edit Button */}
        <button className="mt-6 bg-[#3E83C4] text-white px-10 py-2 rounded-md text-sm hover:opacity-90 transition">
          Edit Profile
        </button>
      
            {/* Contact Info */}
<div className="mt-10 space-y-5">

  <h3 className="text-lg font-semibold">Contact info</h3>

  <div className="space-y-4 text-sm text-gray-500">

<p>
  <span className="font-medium text-gray-700">Phone :</span>{" "}
  {artisan.phone}
</p>

<p>
  <span className="font-medium text-gray-700">Email :</span>{" "}
  {artisan.email}
</p>

<p>
  <span className="font-medium text-gray-700">Address :</span>{" "}
  {artisan.address}
</p>

<p>
  <span className="font-medium text-gray-700">Available Work Locations :</span>{" "}
  {artisan.workLocations}
</p>


  </div>

</div>
      </div>


</div>

    </div>
  );
};

export default Profile;
