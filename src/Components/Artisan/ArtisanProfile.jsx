import React from "react";
import Navbar from "../Navbar";
import Footer from "../../Components/Footer";
import ArrowUp from "../../assets/uploads/ArrowUp.png";
// import LocationImage from "../../assets/uploads/location.png"

const ArtisanProfile = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const works = [
    {
      id: 1,
      name: "Kunle Juwon",
      type: "Refrigerator repair",
      location: "7 AM Industry Close, Lagos",
      duration: "2 weeks",
      price: "30 thousand naira",
      status: "Currently in work",
      initial: "K",
      bgColor: "bg-[#7A9DF75C]",
    },
    {
      id: 2,
      name: "Ada Chukwuma",
      type: "Television repair",
      location: "12 Chukwuma Asadu High Way, Lagos",
      duration: "3 weeks",
      price: "25 thousand naira",
      status: "Delivered work",
      initial: "A",
      bgColor: "bg-[#ADC8F7]",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col  px-16 py-12 mt-4">
   {/* Profile Section */}
<div className="w-full max-w-4xl p-6 relative rounded-xl">
  {/* Top row: Image + Name/Rating/Location */}
  <div className="flex flex-row items-start gap-6">
    {/* Profile Image */}
    <div className="flex-shrink-0">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="Artisan"
        className="w-32 h-32 rounded-full object-cover"
      />
    </div>

    {/* Name + Rating + Location */}
    <div className="flex-1">
      <h2 className="text-2xl font-semibold">Abbas Akande</h2>
      <p className="text-gray-600">★ 4.5 (15)</p>
      <p className="text-sm text-gray-500">📍 Ikeja, Lagos State</p>
    </div>
  </div>

  {/* About Me, Skills and Button - starts UNDER the full row above */}
  <div className="mt-6 ml-2 md:ml-4">
    <h3 className="font-semibold mb-1">About me</h3>
    <p className="text-sm text-gray-700 mb-4">
      Convallis, dolor non, convallis. non quam urna, facilisis dui nisl.
      adipiscing Nunc elit ullamcorper at, odio Praesent lobortis, gravida nulla,
      turpis nec non placerat viverra vehicula, hendrerit amet, in in malesuada quis.
    </p>

    <h3 className="font-semibold mb-1">Skills</h3>
    <p className="text-sm text-gray-700">
      Refrigerator repair, Television repair and Microwave
    </p>

    <button className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
      Edit Profile
    </button>
  </div>

  {/* Availability Card */}
  <div className="absolute top-6 right-6 px-8 py-8 flex items-center space-x-2 shadow-md ">
    <img
      src="https://randomuser.me/api/portraits/men/32.jpg"
      alt="Artisan"
      className="w-10 h-10 rounded-full object-cover"
    />
    <div>
      <p className="text-sm font-medium">Abbas Akande</p>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-600">Available</span>
        <span className="text-[#110000C2] text-xs">●</span>
      </div>
      <div className="flex mt-1 space-x-2 text-xs">
        <button className="bg-[#ECF1FC] rounded-full px-2 py-1">Unavailable</button>
        <button className="bg-[#A1B7F2] text-white rounded-full px-2 py-1">Available</button>
      </div>
    </div>
  </div>
</div>
        {/* Contact Info */}
        <div className="mt-6 w-full max-w-4xl p-6">
          <h3 className="font-semibold mb-2 text-[#110000C2]">Contact info</h3>
          <p className="text-sm text-[#000000]">
            <strong>Phone:</strong> +234 904454667 <br />
            <strong>Email:</strong> abbasakande233@gmail.com <br />
            <strong>Address:</strong> Mr Daniel Izuchukwu Nwoye, 8, My Street, Ilasan Lekki, Lagos <br />
            <strong>Available Work Locations:</strong> Anywhere in Lagos
          </p>
        </div>

        {/* Works Section */}
        <div className="mt-6 w-full max-w-4xl p-6 bg-white rounded-md shadow-sm">
          <h3 className="font-semibold mb-4">Works</h3>

          {works.map((repair) => (
            <div key={repair.id} className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 ${repair.bgColor} text-[#110000C2] font-bold flex items-center justify-center rounded-full`}>
                  {repair.initial}
                </div>
                <div>
                  <p className="font-medium text-[#000000]">{repair.name}</p>
                  <p className="text-xs text-gray-500">{repair.status}</p>
                </div>
              </div>

              <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
                <div className="space-y-1">
                  <p><span className="font-medium">Repair Type:</span> {repair.type}</p>
                  <p><span className="font-medium">Location:</span> {repair.location}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><span className="font-medium">Duration:</span> {repair.duration}</p>
                  <p><span className="font-medium">Price:</span> {repair.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

              {/* Scroll to Top Arrow */}
        <div className="w-full flex justify-end -mb-10 px-8 mt-10 z-50">
          <img
            src={ArrowUp}
            alt="Back to Top"
            className="w-16 h-16 cursor-pointer hover:scale-110 transition duration-300"
            onClick={scrollToTop}
          />
        </div>  
      <Footer />
    </>
  );
};

export default ArtisanProfile;

