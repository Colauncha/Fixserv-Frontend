import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import BackgroundImage from '../assets/uploads/Welcome_bg.png' 
import ArtisanImage from '../assets/uploads/Artisan_Image.png' 


const ArtisanSignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
      email: "", fullName: "", password: "", confirmPassword: "", skillSet:[], 
      businessName: "", role:"ARTISAN", location: "", rating: 0
    });

    const [businessHours, setBusinessHours] = useState({
      monday: { open: "09:00", close: "17:00" },
      tuesday: { open: "09:00", close: "17:00" }
    })

    // useEffect(() => {
    //   console.log("Form Data:", formData);

    // }, [formData]);

    const runFetch = async (submitData) => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/api/users/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            submitData
            // Add your form data here
          ),
        });

        if (!response.ok) {
          console.log("Response not ok:", response);
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        return data;
        
      } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for further handling if needed
        
      }
    }
    const handleArtisanSignUp = async () => {
      try {
        if (formData.password !== formData.confirmPassword) {
          console.error("Passwords do not match");
          return; // Handle password mismatch, e.g., show an error message
        }

        const artisanData = {
          businessName : formData.businessName,
          businessHours: businessHours,
          skillSet : formData.skillSet,
          location : formData.location,
          rating : formData.rating,
        }

        delete formData.businessName;
        delete formData.skillSet;
        delete formData.rating;
        delete formData.location;
        delete formData.confirmPassword;

        const submitData = {...formData , artisanData};
        console.log("Submitting data:", submitData);
        const data = await runFetch(submitData);
        console.log("Data received:", data);
        // Handle successful registration, e.g., navigate to another page or show a success message
      } catch (error) {
        console.error("Error during registration:", error);
        // Handle error, e.g., show an error message to the user
      }
    };

  return (
    <div className="min-h-screen flex">
        {/* Left Panel */}
      <div className="w-1/3 bg-[#A1B7F2] flex flex-col justify-center items-center p-8">
      <img src={BackgroundImage} alt="Background" className="absolute inset-0 w-1/3 object-cover opacity-80" />
        <img src={ArtisanImage} alt="Artisan" className="h-4xl mt-10 ml-10" />       
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center ">
        <h2 className="text-2xl text-[#110000C2] font-semibold mb-6">Artisan Registration</h2>

        <form className="w-full max-w-sm">
          
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Full Name</label>
          <input
            type="text"
            input={formData.fullName || ""}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full flex p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
  

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Email</label>
          <input
            type="email"
            input={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Password</label>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              input={formData.password || ""}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Confirm Password</label>
          <div className="relative mb-2">
            <input
              type={showConfirmPassword ? "text" : "Confirmpassword"}
              input={formData.confirmPassword || ""}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">SkillSet</label>
          <input
            type="text"
            input={formData.skillSet || ""}
            onChange={(e) => setFormData({ ...formData, skillSet: e.target.value.split(',') })}
            placeholder='Enter your skills separated by commas'
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Business Name</label>
          <input
            type="text"
            input={formData.businessName || ""}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full p-2 mb-4 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <label className="block mb-2 text-sm text-[#110000C2] font-medium">Location</label>
          <input
            type="text"
            input={formData.location || ""}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-2 mb-15 border border-[#94B0F8] rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

        <div className="flex relative h-12 mb-2"> 
            <button
                type="button"
                onClick={handleArtisanSignUp}
                className='w-75 h-10 py-2 rounded-md font-medium text-xl transition-all flex
                justify-center bg-[#A1B7F2] text-white '>
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
          <p className="text-sm px-20 ">
            Already have an account?{" "}
            <button className="text-[#000000] font-semibold">
                Log in
            </button>
          </p>

          
        </form>
      </div>
      
    </div>
  )
}

export default ArtisanSignUp







  
