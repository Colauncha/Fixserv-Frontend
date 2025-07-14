import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../assets/uploads/Welcome_bg.png";
import ArtisanImage from "../../assets/uploads/Artisan_Image.png";
import { useUser } from "../../Context/UserContext";

const ArtisanSignUp = () => {
  const { setFullName, setTime, setLocation } = useUser();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    skillSet: [],
    time: new Date().toLocaleString(),
    businessName: "",
    role: "ARTISAN",
    location: "",
    rating: 0,
  });

  useEffect(() => {
    setTime(formData.time);
  }, []);

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
      };

      delete formData.businessName;
      delete formData.skillSet;
      delete formData.rating;
      delete formData.location;

  //     const submitData = { ...formData, artisanData };
  //     const data = await runFetch(submitData);

  //     setMessage("Registration successful! Redirecting to login...");
  //     setMessageType("success");

  //     setTimeout(() => navigate("/login"), 2000);
  //   } catch (error) {
  //     setMessage("An error occurred during registration.");
  //     setMessageType("error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const submitData = { ...formData, artisanData };
    console.log("Submitting data:", submitData);
    const data = await runFetch(submitData);
    setMessage("Registration successful! Redirecting to login...");
      setMessageType("success");
    console.log("Data received:", data);
    navigate("/login");
  } catch (error) {
    setMessage("An error occurred during registration.");
      setMessageType("error");
    console.error("Error during registration:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 bg-[#A1B7F2] flex flex-col justify-center items-center p-8">
        <img
          src={BackgroundImage}
          alt="Background"
          className="absolute inset-0 w-1/3 object-cover opacity-80"
        />
        <img src={ArtisanImage} alt="Artisan" className="h-4xl mt-10 ml-10" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h2 className="text-2xl text-[#110000C2] font-semibold mb-4">
          Artisan Registration
        </h2>

        {/* Feedback message */}
        {message && (
          <div
            className={`mb-4 text-center px-4 py-2 rounded w-full max-w-sm ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <form className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              setFullName(e.target.value);
            }}
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Password
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
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
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full p-2 border border-[#94B0F8] rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-[#113ca8]"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
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
                skillSet: e.target.value.split(","),
              })
            }
            placeholder="Enter skills separated by commas"
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
              setLocation(e.target.value);
            }}
            className="w-full p-2 mb-6 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handleArtisanSignUp}
              disabled={loading}
              className={`w-3/4 h-10 rounded-md font-medium text-xl transition-all flex justify-center items-center bg-[#A1B7F2] text-white ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#90a4d4]"
              }`}
            >
              {loading ? (
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
              ) : (
                "Sign Up"
              )}
            </button>

            <button
              type="button"
              className="w-16 h-10 ml-4 flex items-center justify-center gap-2 rounded-md shadow hover:bg-red-200 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>

          <p className="text-sm mt-4 text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
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

