import { useState } from "react";
import Footer from "../Footer";
import ArrowUp from "../../assets/uploads/ArrowUp.png";
import DashboardNavbar from "./DashboardNavbar";

const ArtisanDashboard = () => {
  const [availability, setAvailability] = useState("Available");

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: { open: "10:00", close: "14:00" },
    sunday: { open: "Closed", close: "" },
  });

  const handleHourChange = (day, type, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const toggleAvailability = (status) => {
    setAvailability(status);
  };

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
      <DashboardNavbar />
      <div className="min-h-screen flex flex-col px-16 py-12">
        {/* Profile Section */}
        <div className="w-full max-w-6xl p-6 rounded-xl">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Artisan"
                className="w-48 h-48 rounded-full object-cover"
              />
            </div>

            {/* Name + Rating + Location */}
            <div className="flex-1 mt-8">
              <h2 className="text-3xl font-semibold">Abbas Akande</h2>
              <p className="text-[#110000C2] text-2xl">★ 4.5 (15)</p>
              <p className="text-2xl text-gray-500">📍 Ikeja, Lagos State</p>
            </div>

            {/* Availability Card (placed here to align properly) */}
            <div className="ml-auto bg-white px-6 py-6 rounded-lg shadow-md w-96 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Artisan"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-md font-bold">Abbas Akande</p>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <span>{availability}</span>
                    <span className="text-[#110000C2] text-xs">●</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  className={`rounded-full px-3 py-1 text-sm ${
                    availability === "Unavailable"
                      ? "bg-[#A1B7F2] text-white"
                      : "bg-[#ECF1FC]"
                  }`}
                  onClick={() => toggleAvailability("Unavailable")}
                >
                  Unavailable
                </button>
                <button
                  className={`rounded-full px-3 py-1 text-sm ${
                    availability === "Available"
                      ? "bg-[#A1B7F2] text-white"
                      : "bg-[#ECF1FC]"
                  }`}
                  onClick={() => toggleAvailability("Available")}
                >
                  Available
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-xs mb-2 text-[#110000C2]">
                  Business Hours
                </h4>
                <ul className="text-xs text-gray-700 space-y-2">
                  {Object.entries(businessHours).map(([day, hours]) => (
                    <li key={day} className="flex justify-between gap-2">
                      <span className="capitalize">{day}:</span>
                      {hours.open === "Closed" ? (
                        <span>Closed</span>
                      ) : (
                        <div className="flex gap-1">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              handleHourChange(day, "open", e.target.value)
                            }
                            className="text-xs border rounded px-1"
                          />
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              handleHourChange(day, "close", e.target.value)
                            }
                            className="text-xs border rounded px-1"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* About Me + Skills */}
          <div className="mt-10 ml-2 md:ml-4">
            <h3 className="font-semibold text-2xl mb-1">About me</h3>
            <p className="text-md text-gray-700 mb-4">
              Convallis, dolor non, convallis. non quam urna, facilisis dui nisl.
              adipiscing Nunc elit ullamcorper at, odio Praesent lobortis, gravida
              nulla, turpis nec non placerat viverra vehicula, hendrerit amet.
            </p>

            <h3 className="font-semibold mb-1 text-2xl">Skills</h3>
            <p className="text-md text-gray-700">
              Refrigerator repair, Television repair and Microwave
            </p>

            <button className="mt-4 px-4 py-2 text-md bg-blue-500 text-white rounded hover:bg-blue-600">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 w-full max-w-4xl p-6">
          <h3 className="font-semibold text-lg mb-2 text-[#110000C2]">Contact info</h3>
          <p className="text-md text-[#000000]">
            <strong>Phone:</strong> +234 904454667 <br />
            <strong>Email:</strong> abbasakande233@gmail.com <br />
            <strong>Address:</strong> Mr Daniel Izuchukwu Nwoye, 8, My Street,
            Ilasan Lekki, Lagos <br />
            <strong>Available Work Locations:</strong> Anywhere in Lagos
          </p>
        </div>

        {/* Works Section */}
        <div className="mt-6 w-full max-w-4xl p-6 bg-white shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-4">History</h3>

          {works.map((repair) => (
            <div key={repair.id} className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 ${repair.bgColor} text-[#110000C2] font-bold flex items-center justify-center rounded-full`}
                >
                  {repair.initial}
                </div>
                <div>
                  <p className="font-medium text-[#000000]">{repair.name}</p>
                  <p className="text-xs text-gray-500">{repair.status}</p>
                </div>
              </div>

              <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Repair Type:</span>{" "}
                    {repair.type}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {repair.location}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {repair.duration}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> {repair.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Top */}
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

export default ArtisanDashboard;

