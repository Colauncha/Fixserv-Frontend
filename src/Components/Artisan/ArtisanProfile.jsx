import React from "react";

const ArtisanProfile = () => {
  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Top Profile Card */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-start p-6 relative">
        {/* Left Profile Section */}
        <div className="flex-shrink-0">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            // src="ProfileImage"
            alt="Artisan"
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        {/* Middle Info Section */}
        <div className="flex-1 md:ml-6 mt-4 md:mt-0">
          <h2 className="text-2xl font-semibold">Abbas Akande</h2>
          <p className="text-gray-600">★ 4.5 (15)</p>
          <p className="text-sm text-gray-500 mb-4">📍 Ikeja, Lagos State</p>
          {/* </div> */}

          {/* <div className="" > */}
          <h3 className="font-semibold mb-1">About me</h3>
          <p className="text-sm text-gray-700 mb-4">
            Convallis, dolor non, convallis. non quam urna, facilisis dui nisl. adipiscing
            Nunc elit ullamcorper at, odio Praesent lobortis, gravida nulla, turpis nec
            non placerat viverra vehicula, hendrerit amet, in in malesuada quis.
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
        <div className="absolute top-6 right-6 bg-white shadow-md rounded-xl px-4 py-2 flex items-center space-x-2">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Artisan"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">Abbas Akande</p>
            <div className="flex items-center space-x-1">
              <span className="text-green-500 text-xs">●</span>
              <span className="text-xs text-gray-600">Available</span>
            </div>
            <div className="flex mt-1 space-x-2 text-xs">
              <button className="bg-gray-200 rounded-full px-2 py-1">Unavailable</button>
              <button className="bg-blue-500 text-white rounded-full px-2 py-1">Available</button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className=" mt-6 w-full max-w-4xl p-6">
        <h3 className="font-semibold mb-2">Contact info</h3>
        <p className="text-sm text-gray-700">
          <strong>Phone:</strong> +234 904454667 <br />
          <strong>Email:</strong> abbasakande233@gmail.com <br />
          <strong>Address:</strong> Mr Daniel Izuchukwu Nwoye, 8|, My Street, Ilasan Lekki, Lagos
          <br />
          <strong>Available Work Locations:</strong> Anywhere in Lagos
        </p>
      </div>

      {/* Works Section */}
      <div className=" mt-6 rounded shadow-sm w-full max-w-4xl p-6">
        <h3 className="font-semibold mb-2">Works</h3>
        <div className="flex items-center space-x-3">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-gray-700 font-bold">
            K
          </div>
          <p className="text-sm text-gray-700">Kunle Juwon</p>
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfile;
