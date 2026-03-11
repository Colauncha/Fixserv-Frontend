import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArtisanHeader from "../Artisan Pages/ArtisanHeader";
import {
  getArtisanHistory,
  acceptOrder,
  rejectOrder,
} from "../../api/order.api";

const AcceptRequest = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getArtisanHistory();
        const data = res?.orders || res?.data?.orders || [];

        setOrders(Array.isArray(data) ? data : []);

        if (orderId) {
          const selected = data.find(
            (o) => o?.id === orderId || o?._id === orderId
          );
          setOrder(selected || null);
        }
      } catch (err) {
        console.log("FETCH ERROR:", err);
        setOrders([]);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderId]);

  const clientName = (o) =>
    o?.clientName || o?.client?.fullName || o?.client?.name || "Client";

  const serviceName = (o) =>
    o?.serviceName || o?.service?.name || o?.deviceType || "Service";

  const location = (o) =>
    o?.location || o?.address || o?.serviceAddress || "—";

  const price = (o) => o?.price ?? o?.amount ?? o?.totalAmount ?? 0;

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "—");

  const handleAccept = async () => {
    try {
      setActionLoading("accept");
      await acceptOrder(orderId);
      alert("Job accepted");
      navigate("/artisan");
    } catch (err) {
      console.log(err);
      alert("Unable to accept job");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async () => {
    try {
      setActionLoading("reject");
      await rejectOrder(orderId);
      alert("Job rejected");
      navigate("/artisan");
    } catch (err) {
      console.log(err);
      alert("Unable to reject job");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!orderId) {
    const requests = orders.filter(
      (o) => o?.status === "PENDING_ARTISAN_RESPONSE"
    );

    return (
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ArtisanHeader title="Job Requests" />

        <div className="mt-6 space-y-4">
          {requests.length === 0 && (
            <p className="text-gray-500">No job requests yet.</p>
          )}

          {requests.map((o) => (
            <div
              key={o?.id || o?._id}
              className="border border-blue-200 p-4 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white"
            >
              <div className="min-w-0">
                <p className="font-semibold break-words">{clientName(o)}</p>

                <p className="text-sm text-gray-500 break-words">
                  {serviceName(o)} • {location(o)}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/artisan/accept-request/${o?.id || o?._id}`)
                }
                className="w-full sm:w-auto bg-[#3E83C4] text-white px-4 py-2 rounded-md"
              >
                View Request
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ArtisanHeader title="Job Request" />
        <div className="mt-6">
          <p className="text-gray-500">Request not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ArtisanHeader title="Job Request" />

      <div className="mt-8 border border-blue-200 rounded-xl p-4 sm:p-6 bg-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#3E83C4] text-white flex items-center justify-center font-semibold shrink-0">
              {clientName(order)?.charAt(0)}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-base sm:text-lg break-words">
                {clientName(order)}
              </p>

              <p className="text-sm text-gray-400 break-words">
                {formatDate(order?.createdAt)}
              </p>
            </div>
          </div>

          <span className="text-gray-500 text-sm break-words">
            {order?.status?.replaceAll("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-sm">
          <div className="space-y-2">
            <p className="break-words">
              <b>Repair Type:</b> {serviceName(order)}
            </p>
            <p className="break-words">
              <b>Location:</b> {location(order)}
            </p>
          </div>

          <div className="space-y-2">
            <p className="break-words">
              <b>Duration:</b> {order?.duration || "—"}
            </p>
            <p className="break-words">
              <b>Price:</b> NGN {price(order)}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleAccept}
            disabled={actionLoading === "accept" || actionLoading === "reject"}
            className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoading === "accept" ? "Accepting..." : "Accept Job"}
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading === "accept" || actionLoading === "reject"}
            className="w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading === "reject" ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcceptRequest;