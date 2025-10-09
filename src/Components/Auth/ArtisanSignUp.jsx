import { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../assets/uploads/Welcome_bg.png";
import ArtisanImage from "../../assets/uploads/Artisan_Image.png";

const ArtisanSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    skillSet: [],
    time: new Date().toLocaleString(),
    businessName: "",
    role: "ARTISAN",
    location: "",
    rating: 0,
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: { open: "09:00", close: "17:00" },
  });

  useEffect(() => {
    setBusinessHours({
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" },
      wednesday: { open: "09:00", close: "17:00" },
      thursday: { open: "09:00", close: "17:00" },
      friday: { open: "09:00", close: "17:00" },
      saturday: { open: "09:00", close: "17:00" },
    });
  }, []);

  const navigate = useNavigate();

  const runFetch = async (submitData) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        console.log("Response not ok:", response);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleArtisanSignUp = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const artisanData = {
        businessName: formData.businessName,
        businessHours: businessHours,
        skillSet: formData.skillSet,
        location: formData.location,
        rating: formData.rating,
        phoneNumber: formData.phoneNumber,
      };

      delete formData.businessName;
      delete formData.skillSet;
      delete formData.rating;
      delete formData.location;

  
  const submitData = { ...formData, artisanData };
    console.log("Submitting data:", submitData);
    const data = await runFetch(submitData);
    setMessage("Registration successful!");
    setMessageType("success");
    console.log("Data received:", data);
    navigate("/auth/email-verification", {state: {email: formData.email}});
  } catch (error) {
    setMessage("An error occurred during registration.");
    setMessageType("error");
    console.error("Error during registration:", error);
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen flex flex-col justify-center md:flex-row">
    {/* Left Panel - Hidden on small/medium screens */}
    <div className="hidden md:flex md:w-1/3 bg-gradient-to-bl to-[#7A9DF7] from-[#7A9Dd7] relative flex-col justify-center items-center p-8">
      <img
        src={BackgroundImage}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <img src={ArtisanImage} alt="Artisan" className="h-xl mt-10 ml-10 z-10" />
    </div>

    {/* Right Panel */}
    <div className="w-full md:w-2/3 flex flex-col justify-center items-center p-6">
      <div className="flex flex-col items-start w-full max-w-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-xl text-[#110000C2] font-semibold mb-4">
          Artisan Registration
        </h2>
      </div>

      {/* Feedback message */}
      {message && (
        <div
          className={`mb-4 text-center px-4 py-2 rounded w-full max-w-sm ${
            messageType === 'success'
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {message}
        </div>
      )}

      <form
        className="w-full max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          handleArtisanSignUp();
        }}
      >
        {/* Form Fields (same as before)... */}
        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Full Name
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => {
            setFormData({ ...formData, fullName: e.target.value });
          }}
          className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Phone Number
        </label>
        <input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
        />

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Password
        </label>
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 border border-[#94B0F8] rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-[#113ca8]"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Confirm Password
        </label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="w-full p-2 border border-[#94B0F8] rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-[#113ca8]"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          SkillSet
        </label>
        <input
          type="text"
          value={formData.skillSet}
          onChange={(e) =>
            setFormData({
              ...formData,
              skillSet: e.target.value.split(','),
            })
          }
          placeholder="Enter skillSet separated by commas"
          className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Business Name
        </label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
          className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        <label className="block mb-2 text-sm text-[#110000C2] font-medium">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
          }}
          className="w-full p-2 mb-6 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3 items-center justify-start mb-2">
          <button
            type="submit"
            // onClick={handleArtisanSignUp}
            disabled={loading}
            className="w-full h-10 bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg text-white px-8 py-2 rounded-lg text-lg font-medium cursor-pointer hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              </div>
            ) : (
              'Sign Up'
            )}
          </button>

          <button
            type="button"
            className="w-full h-10 flex items-center justify-center gap-2 rounded-md shadow hover:bg-red-200 transition"
          >
            <span>Continue with</span>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />
          </button>
        </div>

        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/auth/login')}
            className="text-blue-600 font-semibold cursor-pointer"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  </div>
);

};

export default ArtisanSignUp;

