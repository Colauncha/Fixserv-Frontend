import { useEffect, useState } from "react";
import DashboardNavbar from "../Navbar/DashboardNavbar";
import Footer from "../Footer";

const ArtisanHistory = () => {
  const artisanId = "a118a5ff-39b0-4d76-86d0-b2de3dae9c16";
  const HISTORY_API_URL = `https://your-api.com/api/bookings?artisanId=${artisanId}`;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(HISTORY_API_URL);
        const data = await res.json();
        console.log(data);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen px-6 md:px-16 py-12">
        <h2 className="text-2xl font-semibold mb-6">All Booking History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          history.map((job) => (
            <div
              key={job.id}
              className="mb-6 p-4 border border-gray-200 rounded-md shadow-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ECF1FC] text-[#110000C2] font-bold flex items-center justify-center rounded-full">
                  {job.clientName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-[#000000]">{job.clientName}</p>
                  <p className="text-xs text-gray-500">{job.status}</p>
                </div>
              </div>

              <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-700 ml-12">
                <div className="space-y-1">
                  <p>
                    <span className="font-medium">Repair Type:</span> {job.serviceType}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {job.location}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p>
                    <span className="font-medium">Duration:</span> {job.duration || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Price:</span> {job.price}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default ArtisanHistory;
