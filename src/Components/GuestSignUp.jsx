import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GuestImage from "../assets/uploads/Guest_Image.png";
import { useNavigate } from "react-router-dom";

const GuestSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
    servicePreferences: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Form Data:", formData);
  }, [formData]);

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
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error for further handling if needed
    }
  };

  const handleGuestSignUp = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        console.error("Passwords do not match");
        return; // Handle password mismatch, e.g., show an error message
      }

      const clientData = {
        deliveryAddress: formData.deliveryAddress,
        servicePreferences: formData.servicePreferences,
      };

      const submitData = { ...formData, clientData };
      const data = await runFetch(submitData);
      console.log("Guest Sign Up Data:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error during guest sign up:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-1/3 bg-[#A1B7F2] flex flex-col justify-center items-center p-8">
        <img src={GuestImage} alt="Guest" className="h-full w-full" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        <h2 className="text-2xl text-[#110000C2] font-semibold mb-6">
          Client Registration
        </h2>

        <form className="w-full max-w-sm">
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Full Name
          </label>
          <input
            type="text"
            input={formData.fullName || ""}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full flex p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Email
          </label>
          <input
            type="email"
            input={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Password
          </label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              input={formData.password || ""}
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
          <div className="relative mb-2">
            <input
              type={showConfirmPassword ? "text" : "Confirmpassword"}
              input={formData.confirmPassword || ""}
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
            Service Preferences
          </label>
          <input
            type="text"
            value={formData.servicePreferences.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicePreferences: e.target.value
                  .split(",")
                  .map((pref) => pref.trim()),
              })
            }
            className="w-full p-2 mb-15 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Street Address
          </label>
          <input
            type="text"
            value={formData.deliveryAddress.street}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryAddress: {
                  ...formData.deliveryAddress,
                  street: e.target.value,
                },
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            City
          </label>
          <input
            type="text"
            value={formData.deliveryAddress.city}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryAddress: {
                  ...formData.deliveryAddress,
                  city: e.target.value,
                },
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            State
          </label>
          <input
            type="text"
            value={formData.deliveryAddress.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryAddress: {
                  ...formData.deliveryAddress,
                  state: e.target.value,
                },
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Country
          </label>

          <input
            type="text"
            value={formData.deliveryAddress.country}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryAddress: {
                  ...formData.deliveryAddress,
                  country: e.target.value,
                },
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Postal Code
          </label>
          <input
            type="text"
            value={formData.deliveryAddress.postalCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                deliveryAddress: {
                  ...formData.deliveryAddress,
                  postalCode: e.target.value,
                },
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />

          <div className="flex relative h-12 mb-2">
            <button
              type="button"
              onClick={handleGuestSignUp}
              className="w-75 h-10 py-2 rounded-md font-medium text-xl transition-all flex
                justify-center bg-[#A1B7F2] text-white"
            >
              Sign Up
            </button>

            <button
              type="button"
              className="flex items-center justify-center w-20 h-10 gap-6 rounded-md shadow-lg hover:bg-red-200 transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-15 h-6 gap-6"
              />
            </button>
          </div>
          <p className="text-sm px-20">
            Already have an account?{" "}
            <button className="text-[#000000] font-semibold">Log in</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default GuestSignUp;
