import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getIdentity, setIdentity } from "../../Auth/tokenStorage";
import useAuth from "../../Auth/useAuth";
import { Camera, Save, ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Key, Edit3, CheckCircle, AlertCircle, Clock, Building } from "lucide-react";

const ModernEditProfile = () => {
  const navigate = useNavigate();
  const { state, logout } = useAuth();
  
  const [profile, setProfile] = useState({
    fullName: "",
    bio: "",
    skills: "",
    phone: "",
    email: "",
    location: "",
    password: "",
    businessName: "",
    businessHours: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      console.log("Selected image:", file);
    }
  };

  useEffect(() => {
    const user = getIdentity();
    if (!user) {
      setErrorMessage("User not found. Please log in again.");
      setShowError(true);
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }
    
    // Populate profile with user data from sessionStorage
    setProfile({
      fullName: user.fullName || "",
      bio: user.bio || "Professional artisan with years of experience in appliance repair and maintenance.",
      skills: user.skills || "",
      phone: user.phone || "",
      email: user.email || "",
      location: user.address || "",
      password: user.password || "",
      businessName: user.businessName || "",
      businessHours: user.businessHours || "",
    });
  }, [navigate]);

  const handleSave = async () => {
    const user = getIdentity();
    if (!user) {
      setErrorMessage("User not found. Please log in again.");
      setShowError(true);
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }
    
    setIsSaving(true);
    setShowError(false);
    
    try {
      const token = state.token
      console.log(token);
      if (!token) {
        setErrorMessage("No token found. Please log in again.");
        setShowError(true);
        return;
      }

      const updatedProfile = {
        fullName: profile.fullName,
        skills: profile.skills,
        phone: profile.phone,
        email: profile.email,
        location: profile.location,
        businessName: profile.businessName,
        businessHours: profile.businessHours,
      };

      const response = await fetch(
        `https://user-management-h4hg.onrender.com/api/admin/${user._id}`,
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
         setErrorMessage("Your session has expired. Please log in again.");
         setShowError(true);
         logout();
         setTimeout(() => {
           window.location.href = "/auth/login";
         }, 500);
         return;
       }

        console.error("Server responded with:", errorText);
        throw new Error("Failed to save profile");
      }

      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      
      const updatedUser = { ...user, ...updatedProfile };
      setIdentity(updatedUser);
      const resp = await response.json();
      console.log("Profile updated successfully:", resp);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Save error:", error);
      setErrorMessage("An error occurred while saving your profile.");
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Success/Error Notifications */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          Profile updated successfully!
        </div>
      )}
      
      {showError && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Profile
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Edit Profile
          </h1>
          <p className="text-gray-600 mt-2">Update your personal information and settings</p>
        </div>

        {/* Profile Image Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={profileImage || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="profile"
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <label
                htmlFor="profileImageUpload"
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all group"
              >
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  id="profileImageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profile Picture</h2>
            <p className="text-gray-600 text-center">Click the camera icon to upload a new profile picture</p>
          </div>
        </div>

        {/* Form Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">About</h3>
            </div>
            
            <div className="space-y-4">
              <ModernInfoCard
                icon={<User className="w-4 h-4" />}
                title="Full Name"
                value={profile.fullName}
                onChange={(val) => setProfile({ ...profile, fullName: val })}
              />
              <ModernInfoCard
                icon={<Edit3 className="w-4 h-4" />}
                title="Bio"
                value={profile.bio}
                onChange={(val) => setProfile({ ...profile, bio: val })}
                multiline
                disabled
                note="Coming soon"
              />
              <ModernInfoCard
                icon={<Briefcase className="w-4 h-4" />}
                title="Skills & Services"
                value={profile.skills}
                onChange={(val) => setProfile({ ...profile, skills: val })}
                multiline
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Business Information</h3>
            </div>
            
            <div className="space-y-4">
              <ModernInfoCard
                icon={<Building className="w-4 h-4" />}
                title="Business Name"
                value={profile.businessName}
                onChange={(val) => setProfile({ ...profile, businessName: val })}
                placeholder="e.g., Akande Appliance Repair Services"
              />
              <ModernInfoCard
                icon={<Clock className="w-4 h-4" />}
                title="Business Hours"
                value={JSON.stringify(profile.businessHours)}
                onChange={(val) => setProfile({ ...profile, businessHours: val })}
                multiline
                placeholder="e.g., Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <ModernInfoCard
              icon={<Phone className="w-4 h-4" />}
              title="Phone Number"
              value={profile.phone}
              onChange={(val) => setProfile({ ...profile, phone: val })}
              type="tel"
            />
            <ModernInfoCard
              icon={<Mail className="w-4 h-4" />}
              title="Email Address"
              value={profile.email}
              onChange={(val) => setProfile({ ...profile, email: val })}
              type="email"
            />
          </div>
          
          <div className="mt-4">
            <ModernInfoCard
              icon={<MapPin className="w-4 h-4" />}
              title="Address"
              value={profile.location}
              onChange={(val) => setProfile({ ...profile, location: val })}
              multiline
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
              <Key className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Security</h3>
          </div>
          
          <ModernInfoCard
            icon={<Key className="w-4 h-4" />}
            title="Change Password"
            value={profile.password}
            onChange={(val) => setProfile({ ...profile, password: val })}
            type="password"
            disabled
            note="Password changes coming soon"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            disabled={isSaving}
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all ${
              isSaving 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105"
            }`}
          >
            <Save className="w-5 h-5" />
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ModernInfoCard = ({ 
  icon, 
  title, 
  value, 
  onChange, 
  type = "text", 
  multiline = false, 
  disabled = false, 
  note,
  placeholder
}) => (
  <div className={`relative group ${disabled ? 'opacity-60' : ''}`}>
    <div className="border-2 border-gray-200 rounded-xl p-4 transition-all group-hover:border-blue-300 group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-500/10">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-gray-500 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <label className="text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
          {title}
        </label>
        {note && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {note}
          </span>
        )}
      </div>
      
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full border-none bg-transparent text-gray-800 focus:outline-none resize-none disabled:cursor-not-allowed"
          placeholder={placeholder || `Enter ${title.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full border-none bg-transparent text-gray-800 focus:outline-none disabled:cursor-not-allowed"
          placeholder={placeholder || `Enter ${title.toLowerCase()}...`}
        />
      )}
    </div>
  </div>
);

export default ModernEditProfile;