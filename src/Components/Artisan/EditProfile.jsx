import { useState } from "react";
import { Pencil } from "lucide-react";
import ArrowUp from "../../assets/uploads/ArrowUp.png";
import Footer from "../Footer";
import DashboardNavbar from "./DashboardNavbar";

const artisanId = "b647ea46-9e42-4a6f-a30e-28c2eeb12f2f";


const EditProfile = () => {
  const [profile, setProfile] = useState({
    username: "Abbass Akande",
    bio: "Convalis, dolor non, convallis non quam urna, facilisis dui nisl...",
    skills: "Refrigerator repair, Television repair and Microwave",
    phone: "+234 904454667",
    email: "abbassakande123@gmail.com",
    address: "Mr Daniel Izuchukwu Nkwope, 9, My Street, Ikassan Lekki, Lagos",
    password: "@Akande2021",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // 📸 Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      console.log("Selected image:", file);
    }
  };

  // Handle save profile
  const handleSave = async () => {
  setIsSaving(true);
  try {
    const token = localStorage.getItem("token"); 
    if (!token) {
  alert("No token found. Please log in again.");
  return;
}

const updatedProfile = {
  username: profile.username,
  skills: profile.skills,
  phone: profile.phone,
  email: profile.email,
  address: profile.address,
};

console.log("Sending to backend:", updatedProfile);

    const response = await fetch(
      `https://user-management-h4hg.onrender.com/api/admin/${artisanId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      if (
          errorText.includes("token has expired") ||
          errorText.includes("Invalid token")
        ) {
       alert("Your session has expired. Please log in again.");
       localStorage.removeItem("token"); // Optionally redirect to login
       window.location.href = "/login";
     return;
   }

      console.error("Server responded with:", errorText);
      throw new Error("Failed to save profile");
    }

    // update frontend directly
    setProfile((prev) => ({ ...prev, ...updatedProfile }));
    


    // // Get updated profile from backend
    // const refreshedRes = await fetch (
    //   `https://user-management-h4hg.onrender.com/api/admin/${artisanId}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // if (!refreshedRes.ok) {
    //   throw new Error("Failed to fetch updated profile");
    // }

    // const updatedData = await refreshedRes.json();
    //   setProfile(updatedData); //updates frontend with latest profile


    alert("Profile saved successfully!");
  } catch (error) {
    console.error("Save error:", error);
    alert("An error occurred while saving.");
  } finally {
    setIsSaving(false);
  }
};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
    <DashboardNavbar />

    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt="profile"
            className="rounded-full w-28 h-28 object-cover"
          />
          <label
            htmlFor="profileImageUpload"
            className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow cursor-pointer"
          >
            <Pencil size={16} />
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="mt-2 text-lg font-semibold">Edit Personal Information</p>
      </div>

      {/* ABOUT SECTION */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2 text-gray-700">ABOUT</h3>
        <InfoCard
          title="User Name"
          value={profile.username}
          onChange={(val) => setProfile({ ...profile, username: val })}
        />
        <InfoCard
          title="Bio (Not yet Active)"
          value={profile.bio}
          onChange={(val) => setProfile({ ...profile, bio: val })}
        />
        <InfoCard
          title="Skills/Services"
          value={profile.skills}
          onChange={(val) => setProfile({ ...profile, skills: val })}
        />
      </div>

      {/* CONTACT INFORMATION */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2 text-gray-700">CONTACT INFORMATION</h3>
        <InfoCard
          title="Phone number"
          value={profile.phone}
          onChange={(val) => setProfile({ ...profile, phone: val })}
        />
        <InfoCard
          title="Email address"
          value={profile.email}
          onChange={(val) => setProfile({ ...profile, email: val })}
        />
        <InfoCard
          title="Address"
          value={profile.address}
          onChange={(val) => setProfile({ ...profile, address: val })}
        />
      </div>

      {/* PASSWORD SECTION */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2 text-gray-700">PASSWORD (Not yet active)</h3>
        <InfoCard
          title="Change Password"
          value={profile.password}
          onChange={(val) => setProfile({ ...profile, password: val })}
        />
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-center">
        <button
          disabled={isSaving}
          onClick={handleSave}
          className={`px-6 py-2 rounded-full shadow text-white transition ${
            isSaving ? "bg-gray-400" : "bg-[#7A9DF7] hover:bg-blue-600"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>

    {/* Scroll to Top */}
          <div className="w-full flex justify-end -mb-10 px-8 mt-10 z-50">
            <img
              src={ArrowUp}
              alt="Back to Top"
              className="w-16 h-16 cursor-pointer hover:scale-110 transition duration-300"
              onClick={scrollToTop}
            />
          </div>
    <Footer />
    </>
  );
};

const InfoCard = ({ title, value, onChange }) => (
  <div className="border rounded p-4 mb-3 relative">
    <label className="text-sm font-semibold text-gray-600 mb-1 block">{title}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border-none bg-transparent text-sm text-gray-800 focus:outline-none"
    />
  </div>
);

export default EditProfile;
