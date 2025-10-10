import {  useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import GuestImage from "../../assets/uploads/Guest_Image.png";
import { useNavigate } from "react-router-dom";
import Loader from "../../assets/Loaders/Loader";

const GuestSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENT',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    servicePreferences: ['General'],
  });

  const navigate = useNavigate();

  const runFetch = async (submitData) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + '/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        }
      );

      if (!response.ok) {
        const errorDetails = await response.json().catch(() => ({}));
        console.log('Error details:', errorDetails);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleGuestSignUp = async () => {
    try {
      setLoading(true);
      setMessage('');
      setMessageType('');
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      const submitData = {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        clientData: {
          deliveryAddress: formData.deliveryAddress,
          servicePreferences: formData.servicePreferences,
        },
      };

      const data = await runFetch(submitData);
      console.log('Guest Sign Up Data:', data);
      setMessage('✅ Registration successful! Please verify your email.');
      setMessageType('success');
      navigate('/auth/email-verification', {
        state: { email: formData.email },
      });
    } catch (error) {
      console.error('Error during guest sign up:', error);
      setMessage('❌ Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center md:flex-row">
      {/* Left Panel - hidden on small and medium screens */}
      <div className="hidden md:flex md:w-1/3 bg-[#A1B7F2] justify-center items-center">
        <img
          src={GuestImage}
          alt="Guest"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Panel - full width on small screens */}
      <div className="w-full md:w-2/3 flex flex-col justify-center items-center px-4 py-8 md:px-6">
        <div className="flex flex-col items-start w-full max-w-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-xl text-[#110000C2] font-semibold mb-4">
            Client Registration
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
          className="w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            handleGuestSignUp();
          }}
        >
          {/* First Name */}
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Phone Number */}
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">
            Phone Number
          </label>
          <input
            type="text"
            value={formData.phoneNumber || ''}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />

          {/* Email */}
          <label className="block mb-2 text-sm font-medium text-[#110000C2]">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          />

          {/* Password */}
          <label className="block mb-2 text-sm font-medium text-[#110000C2]">
            Password
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-2 pr-10 border border-[#94B0F8] rounded"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <label className="block mb-2 text-sm font-medium text-[#110000C2]">
            Confirm Password
          </label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full p-2 pr-10 border border-[#94B0F8] rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Service Preferences */}
          {/* <label className="block mb-2 text-sm font-medium text-[#110000C2]">
            Service Preferences
          </label>
          <input
            type="text"
            placeholder="Enter your services separated by commas"
            value={formData.servicePreferences.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                servicePreferences: e.target.value
                  .split(',')
                  .map((pref) => pref.trim()),
              })
            }
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
          /> */}

          {/* Address Fields */}
          {['street', 'city', 'state', 'country', 'postalCode'].map((field) => (
            <div key={field}>
              <label className="block mb-2 text-sm font-medium text-[#110000C2]">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                value={formData.deliveryAddress[field]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deliveryAddress: {
                      ...formData.deliveryAddress,
                      [field]: e.target.value,
                    },
                  })
                }
                className="w-full p-2 mb-4 border border-[#94B0F8] rounded"
              />
            </div>
          ))}

          {/* Submit Buttons */}
          <div className="flex flex-col gap-3 items-center justify-start mb-2">
            <button
              type="submit"
              // onClick={handleGuestSignUp}
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

            {/* <button
              type="button"
              className="w-full h-10 flex items-center justify-center gap-2 rounded-md shadow hover:bg-red-200 transition"
            >
              <span>Continue with</span>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button> */}
          </div>

          <p className="text-sm mt-4 text-center">
            Already have an account?{' '}
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
              type="button"
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

export default GuestSignUp;
