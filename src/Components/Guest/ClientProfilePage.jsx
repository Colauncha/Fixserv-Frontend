import React from "react";
import { Star, MapPin, PhoneCall } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../../Components/Footer";
import ArrowUp from "../../assets/uploads/ArrowUp.png";

const ClientProfilePage = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const artisan = {
    name: "Abbas Akande",
    rating: 4.5,
    reviews: 15,
    location: "Ikeja, Lagos State",
    about:
      "Convallis. dolor non, convallis. non quam urna. facilisis dui nisl. adipiscing Nunc elit ullamcorper at, odio Praesent lobortis, gravida nulla, turpis nec non placerat viverra vehicula, hendrerit amet, in In malesuada quis.",
    skills: ["Refrigerator repair", "Television repair", "Microwave"],
    available: true,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  };
  

  const profileImage = artisan.image;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 mt-4 bg-gray-50">
        <div className="flex flex-col md:flex-row items-start gap-10 max-w-7xl w-full">
          {/* Left Profile Section */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-54 h-54 rounded-full object-cover"
              />
              <div className="flex flex-col items-start gap-2">
                <h2 className="text-2xl font-semibold">{artisan.name}</h2>

                <div className="flex items-center text-sm text-gray-600">
                  <Star fill="#000" size={16} />
                  <span className="ml-1">{artisan.rating}</span>
                  <span className="ml-1 text-gray-400">
                    ({artisan.reviews})
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-1" />
                  <span>{artisan.location}</span>
                </div>

                <button className="bg-blue-400 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded mt-2">
                  Book Me
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">About me</h3>
              <p className="text-sm text-gray-700 w-150">{artisan.about}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Skills</h3>
              <p className="text-sm text-gray-700">
                {artisan.skills.join(", ")}
              </p>
            </div>
          </div>

          {/* Right Contact Section */}
          <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow text-center mt-20">
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <h4 className="text-lg font-semibold">{artisan.name}</h4>
            <p className="text-sm text-gray-500 mb-4">
              {artisan.available ? "Available •" : "Unavailable"}
            </p>

            <button className="bg-blue-400 hover:bg-blue-500 text-white w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow">
              <PhoneCall size={16} />
              Contact me
            </button>

            {/* Socials or tags */}
            <div className="flex justify-center mt-3 space-x-2">
              <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold shadow">
                G
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shadow">
                S
              </div>
            </div>
          </div>
        </div>

        {/* Extra Contact Box (bottom) */}

        <div className="w-full max-w-7xl ">
            <h2 className="text-2xl font-semibold mt-30 mb-20">Reviews</h2>
        </div>
        

        {/* Review Card */}
        <div className="mb-10">
  <div className="border border-gray-200 rounded-lg mt-10 flex flex-col px-10 py-8 shadow-sm w-full max-w-7xl">
    {/* Header Section */}
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold flex items-center justify-center rounded-full">
        K
      </div>
      <div>
        <p className="font-medium">Kunle Juwon</p>
        <p className="text-xs text-green-600 font-medium">🇳🇬 Nigeria</p>
      </div>
    </div>

    {/* Border top line above star rating */}
    <div className="border-t border-gray-200 mt-3 pt-4">
      <div className="flex items-center text-sm text-gray-600 mb-10 tracking-wide">
        {"★".repeat(5)}
        <span className="ml-2 font-medium">5</span>
        <span className="ml-2 text-gray-400">A month ago</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-800 text-xl leading-relaxed mb-2">
        Convallis. dolor non, convallis. non quam urna. facilisis dui nisl.
        adipiscing Nunc elit ullamcorper at, odio Praesent lobortis.
      </p>
    </div>
  </div>

  {/* Helpful Buttons */}
  <div className="text-sm text-gray-600 mt-3 flex gap-4">
    <p>Helpful?</p>
    <button className="flex items-center gap-1 hover:text-black cursor-pointer">
      👍 Yes
    </button>
    <button className="flex items-center gap-1 hover:text-black cursor-pointer">
      👎 No
    </button>
  </div>
</div>

 <div className="mb-40">
  <div className="border border-gray-200 rounded-lg mt-30 flex flex-col px-10 py-8 shadow-sm w-full max-w-7xl">
    {/* Header Section */}
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold flex items-center justify-center rounded-full">
        K
      </div>
      <div>
        <p className="font-medium">Kunle Juwon</p>
        <p className="text-xs text-green-600 font-medium">🇳🇬 Nigeria</p>
      </div>
    </div>

    {/* Border top line above star rating */}
    <div className="border-t border-gray-200 mt-3 pt-4">
      <div className="flex items-center text-sm text-gray-600 mb-10 tracking-wide">
        {"★".repeat(5)}
        <span className="ml-2 font-medium">5</span>
        <span className="ml-2 text-gray-400">A month ago</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-800 text-xl leading-relaxed mb-2">
        Convallis. dolor non, convallis. non quam urna. facilisis dui nisl.
        adipiscing Nunc elit ullamcorper at, odio Praesent lobortis.
      </p>
    </div>
  </div>

  {/* Helpful Buttons */}
  <div className="text-sm text-gray-600 mt-3 flex gap-4">
    <p>Helpful?</p>
    <button className="flex items-center gap-1 hover:text-black cursor-pointer">
      👍 Yes
    </button>
    <button className="flex items-center gap-1 hover:text-black cursor-pointer">
      👎 No
    </button>
  </div>
</div>


        {/* Arrow image - above Footer */}
        <div className="w-full flex justify-end -mb-10 px-8 mt-10 z-100">
          <img
            src={ArrowUp}
            alt="Back to Top"
            className="w-20 h-20 text-[#110000C2] cursor-pointer hover:scale-110 transition duration-300"
            onClick={scrollToTop}
          />
        </div>
        <Footer />

      </div>
    </>
  );
};

export default ClientProfilePage;
