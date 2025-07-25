import FixservLogo from '../assets/uploads/FS_Logo.png';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleArtisan = () => {
    navigate("/auth/artisan-signup");
  };

  const handleGuest = () => {
    navigate("/auth/client-signup");
  };

  return (
    <div className="min-h-[80dvh] bg-white flex flex-col justify-center px-4 lg:py-8">
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full gap-8">

        {/* Left Illustration */}
        <div className="hidden lg:flex w-1/3 justify-center items-center">
          <img
            src={FixservLogo}
            alt="fixserv-logo"
            className="max-w-[80%] h-auto"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl lg:text-7xl font-bold">
            Welcome <span className="text-[#7A9DF7]">to</span><br /> Fixserv
          </h1>

          <p className="text-md text-[#110000C2]">Get Started</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
            <button
              type="button"
              onClick={handleArtisan}
              className="text-white px-6 py-2 w-44 rounded-md bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out"
            >
              Artisan SignUp
            </button>

            <button
              type="button"
              onClick={handleGuest}
              className="text-white px-6 py-2 w-44 rounded-md bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] shadow-lg hover:shadow-md hover:from-[#7a9ed7d9] hover:to-[#7a9df7d9] transition duration-300 ease-in-out"
            >
              Client SignUp
            </button>
          </div>

          <div className="text-lg lg:text-sm text-[#110000C2] space-y-2 mt-4">
            <p>
              👋 New here? <br />
              Create an account (Sign Up) to join us.
            </p>
            <p>
              🔑 Already a member? Welcome back!
              <a
                href="/auth/logIn"
                className="text-[#A1B7F2] underline ml-1 hover:text-[#6f93d1]"
              >
                Log in
              </a>{' '}
              to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
