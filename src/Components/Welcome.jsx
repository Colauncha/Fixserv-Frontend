import FixservLogo from '../assets/uploads/FS_Logo.png'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
   const navigate = useNavigate();

  const handleArtisan = () => {
    navigate("/artisan-signup");
  };

  const handleGuest = () => {
    navigate("/client-signup");
  }


  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Main content */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-screen">

        {/* Left Illustration */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={FixservLogo}
            alt="fixserv-logo"
            className="h-3xl mt-10 ml-10"
          />
        </div>

        {/* Right Content */}
        <div className="w-1/2 space-y-6">
        <div className='flex flex-col'> 
          <h1 className="text-8xl font-bold top-0">
            Welcome <span className="text-[#7A9DF7]">to</span><br/> Fixserv
          </h1>

          <div className="space-y-10">
            <p className="text-md py-4 text-[#110000C2]">Get Started</p>
            </div>
         </div>

            <div className='grid grid-col gap-10'> 
            <button 
              type="button"
              onClick={handleArtisan}
              className="bg-[#A1B7F2]  text-white px-4 py-2 w-44 h-10 rounded-md">
              Artisan SignUp
            </button> 

            <button 
              type="button"
              onClick={handleGuest}
              className="bg-[#A1B7F2] text-white px-4 py-2 w-44 h-10 rounded-md">
              Client SignUp
            </button>
            </div>

          <p className="text-sm text-[#110000C2] mt-6">
            Welcome to Fixserv – 👋 New here?
            Create an account(Sign Up) to join us
          </p>
          <p className="text-sm text-[#110000C2] mt-6">
            🔑 Already a member?
            Welcome back!
             <a href='/logIn' className='text-[#A1B7F2] underline px-2' >
            Log in 
            </a> 
            to continue
          </p>
        </div>
      </div>
    </div>
  )
}

export default Welcome

