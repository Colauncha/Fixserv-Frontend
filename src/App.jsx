import "./App.css";
import backgroundImg from "./assets/ab.jpg";
import booking from "./assets/booking.svg";
import location from "./assets/location.svg";
import payment from "./assets/payment.svg";
import notifications from "./assets/notifications.svg";
import ratings from "./assets/ratings.svg";
import time from "./assets/time.svg";
import owners from "./assets/owners.svg";
import drivers from "./assets/drivers.svg";
import managers from "./assets/managers.svg";
import seamless from "./assets/seamless.jpg";
import phone from "./assets/phone.jpg";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative min-h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImg})` }}
        ></div>

        <div
          className="relative z-10 backdrop-blur-xl rounded-lg p-8 md:p-12 max-w-4xl mx-4 text-white border-opacity-30 shadow-2xl"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            Experience Effortless Charging, Anytime, Anywhere
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200">
            Stay powered on every journey. Access real-time station data,
            schedule charges for personal or fleet vehicles, and enjoy a truly
            connected EV charging experience all from one smart platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#3A7750] text-white px-28 py-4 rounded-md transition font-semibold">
              Get Started
            </button>
            <button className="bg-white text-[#3A7750] px-28 py-4 rounded-md transition font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-[#13612E] text-center mb-4">
            Our Services
          </h2>
          <p className="text-[#6B6A6A] text-center max-w-3xl mx-auto mb-12">
            Comprehensive EV charging solutions designed to make electric
            vehicle ownership simple, convenient, and accessible for everyone in
            Nigeria.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={location} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                Station Locator
              </h3>
              <p className="text-[#6B6A6A]">
                Find nearby stations with GPS map, real-time tracking, distance
                info, and quick navigation. View station details and photos
                instantly.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={time} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                Real-time Availability
              </h3>
              <p className="text-[#6B6A6A]">
                Get live charger status every 30 seconds with occupancy
                tracking, wait time estimates, and queue management for a
                smoother charging experience.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={booking} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                Smart Booking System
              </h3>
              <p className="text-[#6B6A6A]">
                Reserve charging slots in advance with flexible scheduling,
                instant confirmation, and QR code access for quick check-in.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={payment} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                Seamless Payment
              </h3>
              <p className="text-[#6B6A6A]">
                Pay securely with cards, bank transfer, USSD, or mobile wallets.
                Get instant confirmations and track your payment history easily.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={ratings} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                User Reviews & Ratings
              </h3>
              <p className="text-[#6B6A6A]">
                Make smarter charging choices with community ratings, reviews,
                and photos. Rely on real user feedback to find the best stations
                faster.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={notifications} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                Smart Notifications
              </h3>
              <p className="text-[#6B6A6A]">
                Get intelligent alerts for bookings, session updates, payments,
                and more. Stay informed with real-time confirmations, completion
                notices, and status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-[#13612E] text-center mb-4">
            Built For Every EV User
          </h2>
          <p className="text-[#6B6A6A] text-center max-w-3xl mx-auto mb-12">
            Are you a vehicle owner, a ride hailing driver, or a fleet manager?
            We have exactly what you need, and more!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={owners} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#0E4121] mb-2">
                Individual EV Owners
              </h3>
              <p className="text-black">
                Perfect for individual EV owners who want fast, reliable
                charging for daily commutes or long trips. Quickly find
                stations, reserve slots, track history, and get cost insights —
                all in one place.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={drivers} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#0E4121] mb-2">
                Ride-Hailing Drivers
              </h3>
              <p className="text-black">
                Ideal for professional EV drivers who need fast, reliable
                charging to stay on the road. Minimize downtime, enjoy priority
                booking, make quick payments, and optimize your routes with
                ease.
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg">
              <img src={managers} alt="" className="w-14 h-14" />
              <h3 className="text-xl font-bold text-[#0E4121] mb-2">
                Fleet Managers
              </h3>
              <p className="text-black">
                Perfect for companies managing EV fleets that need efficient,
                cost-effective charging. Bulk book slots, track fleet analytics,
                manage costs, and coordinate drivers seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                Seamless Station Discovery
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                Tap into the future of EV charging with Evant's Find Station
                gives you real-time station data, smart routing, and a
                frictionless charging experience right at your fingertips.
                Easily book charging slots for unit and/or fleet vehicles and
                stay powered without the wait.
              </p>
              <button className="bg-transparent border-2 border-green-600 text-green-600 px-8 py-3 rounded-md hover:bg-green-600 hover:text-white transition font-semibold">
                Learn More
              </button>
            </div>

            <div className="relative">
              <div
                className="w-full h-[500px] rounded-lg relative overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${seamless})` }}
              >
                <div className="absolute top-4 right-4 bg-green-900 bg-opacity-90 backdrop-blur-sm rounded-lg p-6 max-w-sm w-full">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Book a charging slot
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm mb-2">
                        Vehicle data
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded bg-white text-gray-800"
                        placeholder="Enter vehicle info"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Charger type
                      </label>
                      <select className="w-full px-3 py-2 rounded bg-white text-gray-800">
                        <option>Select charger type</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Select for charging time
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="px-3 py-2 bg-green-600 text-white rounded text-sm">
                          9:00 AM
                        </button>
                        <button className="px-3 py-2 bg-gray-700 text-white rounded text-sm">
                          10:00 AM
                        </button>
                        <button className="px-3 py-2 bg-gray-700 text-white rounded text-sm">
                          11:00 AM
                        </button>
                        <button className="px-3 py-2 bg-gray-700 text-white rounded text-sm">
                          12:00 PM
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm mb-2">
                        Note
                      </label>
                      <textarea
                        className="w-full px-3 py-2 rounded bg-white text-gray-800"
                        rows="3"
                        placeholder="Add a note"
                      ></textarea>
                    </div>

                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold">
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#12543C] my-32">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <img
                src={phone}
                alt="Evant app on phone"
                className="w-64 h-96 object-cover rounded-3xl shadow-2xl transform -rotate-12"
              />
            </div>

            <div className="text-white">
              <h2 className="text-4xl font-bold mb-4">
                Ready To Experience The Future Of EV Charging In Nigeria?
              </h2>
              <p className="text-lg mb-8 text-gray-200">
                Join thousands of EV drivers who are already using Evant to make
                their charging experience seamless and reliable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#3A7750] text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-semibold">
                  Download App
                </button>
                <button className="bg-white text-[#3A7750] px-8 py-3 rounded-md hover:bg-white hover:text-green-600 transition font-semibold">
                  Partner with us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
