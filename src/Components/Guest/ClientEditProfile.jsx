import { useRef, useState, useEffect } from "react";
import { ArrowLeft,User, Users, Mail,Phone,Lock,Camera, Globe2, Building2, Map, MapPinHouse, LocateFixed, Wallet, ServerCog} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Auth/useAuth";
import { getIdentity, setIdentity } from "../../Auth/tokenStorage";
import CharProfilePic from "../CharProfilePic";
import Loader from "../../assets/Loaders/Loader";


const ClientEditProfile = () => {
  const navigate = useNavigate();
  const {state} = useAuth()
  const storedData = getIdentity()
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(storedData.profilePicture);
  const [userData, setUserData] = useState({
    fullName: storedData.fullName || "",
    phoneNumber: storedData.phoneNumber || "",
    email: storedData.email || "",
    servicePreference: storedData.servicePreferences || [],
    deliveryAddress: {
      country: storedData.deliveryAddress?.country || "Nigeria",
      state: storedData.deliveryAddress?.state || "",
      city: storedData.deliveryAddress?.city || "",
      street: storedData.deliveryAddress?.street || "",
      postalCode: storedData.deliveryAddress?.postalCode || ""
    }
  });
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch("https://api.biddius.com/api/misc/states");
        if (!response.ok) {
          throw new Error("Failed to fetch states");
        }
        const data = await response.json();
        setStates(data.data);
        console.log("States fetched:", data.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      const formData = new FormData();
      formData.append("profilePicture", file);
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/${storedData._id || storedData.id}/profile-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        body: formData,
      });
      if (!resp.ok) {
        throw new Error("Failed to upload image");
      }
      const data = await resp.json();
      console.log("Image uploaded successfully:", data);
      setIdentity(data.user)
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSaveChanges = async () => {
    const stored = getIdentity()
    if (!state.isAuthenticated) {
      alert("User not authenticated.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${stored._id || stored.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      const updatedUser = await response.json();

      // Update sessionStorage
      sessionStorage.setItem("identity", JSON.stringify({ ...stored, ...updatedUser }));

      alert("Profile updated successfully!");
      setLoading(false);
      navigate("/client/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
      setLoading(false);
    }
  };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name !== 'deliveryAddress' || name !== 'servicePreference') {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (name === "deliveryAddress") {
      setUserData((prevData) => ({
        ...prevData,
        deliveryAddress: {
          ...prevData.deliveryAddress,
          [name]: value,
        },
      }));
    }
  }

  const handleServicePreferenceChange = (e) => {
    if (e.key === "," || e.key === "Enter") {
      const value = e.target.value.replace(",", "").trim();
      if (value && !userData.servicePreference.includes(value)) {
        setUserData((prevData) => ({
          ...prevData,
          servicePreference: [...prevData.servicePreference, value],
        }));
      }
    e.preventDefault(); // Prevent default comma behavior
    e.target.value = ""; // Clear the input after adding
    }
  };

  const removeServicePreference = (index) => {
    setUserData((prevData) => ({
      ...prevData,
      servicePreference: prevData.servicePreference.filter((_, i) => i !== index),
    }));
  };

  const handlePassChanges = () => {
    alert("Password change functionality is not implemented yet.");
  };

  const loadCities = async (state) => {
    try {
      const response = await fetch(`https://api.biddius.com/api/misc/cities/${state}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      setCities(data.data);
    }
    catch (error) {
      console.error("Error fetching cities:", error);
    }
  }

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
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur ${profileImage ? 'opacity-25 group-hover:opacity-40' : 'opacity-10 group-hover:opacity-15' }  transition duration-300`}></div>
            {profileImage ? <img
              src={profileImage}
              alt="Artisan"
              className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-lg"
            /> : 
            <CharProfilePic size={'32'} username={userData.fullName} otherStyles='!text-4xl' />
            }
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
        <p className="mt-4 text-sm text-gray-600">Tap the camera icon to change image <br /> (Image must not be more than 1mb)</p>
      </div>

      {/* Form Sections */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <User className="mr-2" size={18} /> Full Name
            </h3>
            <input
              type="text"
              name="fullName"
              onChange={handleInputChange}
              placeholder="Enter full name..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ServerCog className="mr-2" size={18} /> Service Preference
            </h3>
            <input
              type="text"
              onKeyDown={handleServicePreferenceChange}
              placeholder="Enter new service preference..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="text-sm text-gray-500 mt-4 flex flex-wrap gap-2">
              {userData.servicePreference?.map((service, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-2 py-1 rounded-full flex gap-2 justify-between"
                  >
                    {service}
                    <span className="cursor-pointer" onClick={() => removeServicePreference(index)}>&times;</span>
                  </span>
                )
              )}
            </div>
          </div>
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
              value={userData.phone}
              name="phoneNumber"
              onChange={handleInputChange}
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
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder="Enter email address..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Wallet className="mr-2" size={16} />
              Wallet Info
            </label>
            <p className="text-sm text-gray-400 font-light text-center mt-auto">Coming soon...</p>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Home address</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Globe2 className="mr-2" size={16} />
              Country
            </label>
            <select name="country" defaultValue={userData.deliveryAddress.country} className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="" disabled>Select Country</option>
              <option value="Nigeria">Nigeria</option>
            </select>
          </div>
          <div className="mb-4 flex gap-3">
            {/* State Select */}
            <div className="w-1/2">
              <label className="text-sm text-gray-700 flex items-center mb-1">
                <Map className="mr-2" size={16} />
                State
              </label>
              <select
                name="state"
                value={userData.deliveryAddress.state}
                onChange={(e) => {
                  const selectedState = e.target.value;
                  setUserData((prev) => ({
                    ...prev,
                    deliveryAddress: {
                      ...prev.deliveryAddress,
                      state: selectedState,
                      city: "", // reset city when state changes
                    },
                  }));
                  loadCities(selectedState); // dynamically load cities
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select State</option>
                {states ? (
                  states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))
                ) : (
                  <option>Loading states...</option>
                )}
              </select>
            </div>

            {/* City Select */}
            <div className="w-1/2">
              <label className="text-sm text-gray-700 flex items-center mb-1">
                <Building2 className="mr-2" size={16} />
                City
              </label>
              <select
                name="city"
                value={userData.deliveryAddress.city}
                onChange={(e) => {
                  const selectedCity = e.target.value;
                  setUserData((prev) => ({
                    ...prev,
                    deliveryAddress: {
                      ...prev.deliveryAddress,
                      city: selectedCity,
                    },
                  }));
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select City</option>
                {cities && cities.length > 0 ? (
                  cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))
                ) : (
                  <option disabled>Choose a state to proceed</option>
                )}
              </select>
            </div>
          </div>
          <div className="mb-4 flex gap-3">
            <div className="w-1/2">
              <label className="text-sm text-gray-700 flex items-center mb-1">
                <MapPinHouse className="mr-2" size={16} />
                Street
              </label>
              <input
                type="text"
                // value={userData.deliveryAddress.street}
                onChange={(e) => {
                  const selectedStreet = e.target.value;
                  setUserData((prev) => ({
                    ...prev,
                    deliveryAddress: {
                      ...prev.deliveryAddress,
                      street: selectedStreet,
                    },
                  }));
                }}
                name="street"
                placeholder="Enter street name..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-1/2">
              <label className="text-sm text-gray-700 flex items-center mb-1">
                <LocateFixed className="mr-2" size={16} />
                Postal Code
              </label>
              <input
                type="text"
                // value={userData.deliveryAddress.postalCode}
                onChange={(e) => {
                  const selectedPostal = e.target.value;
                  setUserData((prev) => ({
                    ...prev,
                    deliveryAddress: {
                      ...prev.deliveryAddress,
                      postalCode: selectedPostal,
                    },
                  }));
                }}
                name="postalCode"
                placeholder="Enter postal code..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>


        {/* Security */}
        <div className=" w-full bg-white p-6 rounded-2xl shadow-md md:col-span-2">
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
          <div className="mb-4">
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
          <div className="mb-4">
            <label className="text-sm text-gray-700 flex items-center mb-1">
              <Lock className="mr-2" size={16} />
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="max-w-6xl mx-auto text-left">
            <button 
            onClick={handlePassChanges}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-xs shadow hover:opacity-90">
              Change Password
            </button>
          </div>
        </div>  
      </div>

      {/* Save Button */}
      <div className="max-w-6xl mx-auto mt-8 text-center">
        <button 
        onClick={handleSaveChanges}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm shadow hover:opacity-90">
          {loading ? <Loader size={'5'} otherStyles={'text-white'} /> : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ClientEditProfile;
