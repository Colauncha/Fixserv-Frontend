import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import BackgroundImage from '../../assets/uploads/Welcome_bg.png';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from "../../Auth/useAuth";
import { setIdentity } from '../../Auth/tokenStorage';

const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/admin/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setMessage("Invalid credentials or login failed.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const data = await response.json();
      login(data?.data?.BearerToken);
      setIdentity(data?.data?.response)

      setMessage("Login successful!");
      setMessageType("success");

      setTimeout(() => {
        if (data.data.response.role === 'CLIENT') {
          navigate("/client/home");
        } else if (data.data.response.role === 'ARTISAN') {
          navigate("/artisans/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      }, 500);
    } catch (error) {
      console.error('Error during login:', error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:flex-row">
      {/* Left Panel - hidden on small screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#A1B7F2] relative items-center justify-center p-8">
        <img src={BackgroundImage} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="relative z-10 text-center px-10">
          <h1 className="text-4xl lg:text-7xl font-bold mb-4 text-[#110000C2]">Welcome Back!</h1>
          <p className="text-lg lg:text-xl text-[#110000C2]">
            Get connected with professional<br /> artisans
          </p>
          <p className="text-lg mt-4 lg:text-sm text-[#110000C2]">
            New here? 
            <span 
              onClick={() => navigate("/welcome")}
              className='text-[#000000] font-semibold underline hover:text-blue-500 cursor-pointer ml-1'
            >
                Sign Up
              </span>
          </p>
        </div>
      </div>
  
      {/* Right Panel */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-10">
        {/* <h2 className="text-xl sm:text-2xl text-[#110000C2] font-semibold mb-6">Log in</h2> */}
        <div className="flex flex-col items-start w-full max-w-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-xl text-[#110000C2] font-semibold mb-4">
            Login
          </h2>
        </div>
  
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
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
  
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  
          <p className="text-sm text-left mb-4">
            <button
            onClick={() => navigate("/auth/forgot-password")} 
            className="text-[#000000] font-semibold underline hover:text-blue-500"
            >
               Forgot Password?
            </button>
          </p> 
  
          <div className="flex relative w-full justify-between mb-6">
            {/* Login Button with Spinner */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`flex items-center justify-center w-[70%] h-10 rounded-2xl px-4 py-2 transition cursor-pointer shadow-md ${
                loading ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#ECF1FC] hover:bg-[#A1B7F2] text-black"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-black"
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
                "Login"
              )}
            </button>
  
            {/* Google Button */}
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-md px-2 py-2 shadow-xl hover:bg-gray-300 transition cursor-pointer ml-2"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default LogIn;

