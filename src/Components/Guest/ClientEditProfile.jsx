import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft,User,FileText,Mail,Phone,Lock,Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ClientEditProfile = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("https://randomuser.me/api/portraits/men/75.jpg");

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(sessionStorage.getItem("clientData"));
    if (storedData) {
      setFullName(storedData.fullName || "");
      setBio(storedData.bio || "");
      setPhone(storedData.phone || "");
      setEmail(storedData.email || "");
      setProfileImage(storedData.profileImage || "https://randomuser.me/api/portraits/men/75.jpg");
    }
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  //  const handleSaveChanges = () => {
  //   const updatedData = {
  //     fullName,
  //     bio,
  //     phone,
  //     email,
  //     profileImage
  //   };
  //   sessionStorage.setItem("clientData", JSON.stringify(updatedData));
  //   navigate("/client/dashboard");
  // };

  const handleSaveChanges = async () => {
  const stored = JSON.parse(sessionStorage.getItem("identity"));
  if (!stored || !stored.token || !stored._id) {
    alert("User not authenticated.");
    return;
  }

  try {
    const response = await fetch(`https://user-management-h4hg.onrender.com/api/admin/user/${stored._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${stored.token}`,
      },
      body: JSON.stringify({
        fullName,
        about: bio,
        phone,
        email,
        image: profileImage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile.");
    }

    const updatedUser = await response.json();

    // Update sessionStorage
    sessionStorage.setItem("identity", JSON.stringify({ ...stored, ...updatedUser }));

    alert("Profile updated successfully!");
    navigate("/client/dashboard");
  } catch (err) {
    console.error(err);
    alert("Error updating profile.");
  }
};



  return (
    <div className="min-h-screen bg-[#f4f7fe] p-6">
      {/* Top Navigation */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <button
        onClick={() => navigate("/client/dashboard")} 
        className="flex items-center text-blue-600 hover:underline text-sm">
          <ArrowLeft className="mr-2" size={18} />
          Back to Profile
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
        <div></div> {/* Empty space for centering */}
      </div>

      {/* Profile Picture */}
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-md text-center mb-6 relative">
        <div className="relative inline-block">
          <img
            src={profileImage}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
          />
          <button
            onClick={handleImageClick}
            className="absolute bottom-1 right-1 bg-blue-500 p-1 rounded-full shadow text-white hover:bg-blue-600"
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile Picture</h2>
        <p className="mt-4 text-sm text-gray-600">Tap the camera to change image</p>
      </div>

      {/* Form Sections */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="mr-2" size={18} /> Full Name
          </h3>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Bio */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2" size={18} /> Bio
          </h3>
         <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Phone className="mr-2" size={16} />
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Mail className="mr-2" size={16} />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Security */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Lock className="mr-2" size={16} />
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Lock className="mr-2" size={16} />
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>  
      </div>

      {/* Save Button */}
      <div className="max-w-6xl mx-auto mt-8 text-center">
        <button 
        onClick={handleSaveChanges}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm shadow hover:opacity-90">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ClientEditProfile;
