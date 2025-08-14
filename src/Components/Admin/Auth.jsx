import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from "../../Auth/useAuth";
import { setIdentity } from '../../Auth/tokenStorage';
import Fetch from '../../util/Fetch';
import Loader from '../../assets/Loaders/Loader';

const Auth = () => {
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
      const {data, error, success} = await Fetch({
        url: import.meta.env.VITE_API_URL + "/api/admin/login",
        method: 'POST',
        requestData: { email, password }
      });

      if (!success) {
        setMessage(`Invalid credentials or login failed, ${error}`);
        setMessageType("error");
        setLoading(false);
        return;
      }

      login(data?.data?.BearerToken);
      setIdentity(data?.data?.response)

      const role = data.data.response.role
      if (role === 'CLIENT' || role === 'ARTISAN') {
        setMessage("Unauthorized. Please use regular login.");
        setMessageType("error");
        setTimeout(() => {
          navigate('/auth/login')
        }, 1000)
      } else {
        setMessage("Login successful!");
        setMessageType("success");
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1000)
      }

    } catch (error) {
      console.error('Error during login:', error);
      setMessage("An error occurred. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[100dvh] w-full p-10' >
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-10">
        <h2 className="text-xl sm:text-2xl text-[#110000C2] font-semibold mb-6">Admin Log in</h2>
  
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
  
          <div className="flex relative w-full justify-between mb-6">
            {/* Login Button with Spinner */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={`flex items-center justify-center w-[100%] h-10 rounded-2xl px-4 py-2 transition cursor-pointer shadow-md ${
                loading ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#ECF1FC] hover:bg-[#A1B7F2] text-black"
              }`}
            >
              {loading ? (
                <Loader size={'5'} />
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth