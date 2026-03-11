import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import profileImage from "../../../assets/client images/client-home/profile.png";
import mark from "../../../assets/client images/client-home/mark.png";
import star from "../../../assets/client images/client-home/star.png";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
};

const ViewRepair = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const repair = location.state?.repair || null;

  if (!repair) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-black mb-2">
            No repair details found
          </h2>
          <p className="text-sm text-[#656565] mb-6">
            Please go back and select a repair history item.
          </p>
          <button
            onClick={() => navigate("/client/repair")}
            className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-6 py-3 rounded-md text-sm font-medium transition"
          >
            Back to Repair History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <section className="w-full py-10 sm:py-14 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-12">
            <button
              onClick={() => navigate("/client/repair")}
              className="text-sm text-[#3e83c4] mb-6 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <div className="text-center">
              <h1 className="text-base sm:text-lg font-semibold text-black break-words">
                Request Summary - {repair.id}
              </h1>
              <p className="text-sm text-[#656565] mt-1">
                View the full repair request details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[290px_1fr] gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
            {/* LEFT CARD */}
            <div className="bg-[#EEF6FF] rounded-xl p-4 w-full xl:w-[290px]">
              <div className="flex flex-col">
                <img
                  src={repair.artisanImage || repair.uploadedImage || profileImage}
                  alt="artisan"
                  className="w-full h-[220px] sm:h-[260px] xl:w-[250px] xl:h-[220px] rounded-xl object-cover mb-4"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-black text-xl sm:text-2xl break-words">
                    {repair.artisanName || "Unknown Technician"}
                  </h2>
                  <img src={mark} alt="verified" className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <p className="text-sm sm:text-base text-[#656565] mt-1 break-words">
                  {repair.artisanCategory || "Repair Technician"}
                </p>

                <div className="flex items-center gap-1 mt-2 text-sm sm:text-base flex-wrap">
                  <img src={star} alt="star" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-black">
                    {repair.artisanRating ?? "—"}
                  </span>
                  <span className="text-black break-words">
                    (
                    {repair.artisanReviews === "—" || repair.artisanReviews == null
                      ? "reviews unavailable"
                      : `${repair.artisanReviews} reviews`}
                    )
                  </span>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {(repair.artisanSkills?.length
                    ? repair.artisanSkills
                    : [repair.deviceType]
                  )
                    .filter(Boolean)
                    .slice(0, 5)
                    .map((item, index) => (
                      <span
                        key={`${
                          typeof item === "string"
                            ? item
                            : item?.name || "skill"
                        }-${index}`}
                        className="bg-[#C1DAF3] text-[#3E83C4] px-3 py-1 rounded-lg text-xs sm:text-sm break-words"
                      >
                        {typeof item === "string"
                          ? item
                          : item?.name || item?.label || "Skill"}
                      </span>
                    ))}
                </div>

                <div className="mt-4 text-sm text-[#656565] space-y-2">
                  <p className="break-words">
                    Experience:{" "}
                    <span className="font-medium text-black">
                      {repair.artisanExperience || "—"}
                    </span>
                  </p>
                  <p className="break-words">
                    Location:{" "}
                    <span className="font-medium text-black">
                      {repair.artisanLocation || "—"}
                    </span>
                  </p>
                  <p className="break-words">
                    Order Status:{" "}
                    <span className="font-medium text-black">{repair.progress}</span>
                  </p>
                  <p className="break-words">
                    Payment Status:{" "}
                    <span className="font-medium text-black">{repair.status}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="pt-0 xl:pt-2 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-black mb-6 break-words">
                {repair.serviceRequired}
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-black">
                <p className="break-words">
                  <span className="text-[#656565]">Booking ID:</span> {repair.id}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Technician:</span>{" "}
                  {repair.artisanName || "Unknown Technician"}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Type:</span>{" "}
                  {repair.deviceType}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Brand:</span>{" "}
                  {repair.deviceBrand}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Device Model:</span>{" "}
                  {repair.deviceModel}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Service Required:</span>{" "}
                  {repair.serviceRequired}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Issue Description:</span>{" "}
                  {repair.issueDescription}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Uploaded Item Name:</span>{" "}
                  {repair.objectName}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Client Address:</span>{" "}
                  {repair.location}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Created At:</span>{" "}
                  {formatDate(repair.createdAt)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Uploaded At:</span>{" "}
                  {formatDate(repair.uploadedAt)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Artisan Response Deadline:</span>{" "}
                  {formatDate(repair.artisanResponseDeadline)}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Payment Reference:</span>{" "}
                  {repair.paymentReference}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Artisan ID:</span>{" "}
                  {repair.artisanId}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Service ID:</span>{" "}
                  {repair.serviceId}
                </p>
                <p className="break-words">
                  <span className="text-[#656565]">Escrow Status:</span>{" "}
                  {repair.escrowStatus}
                </p>

                {repair.uploadedImage && (
                  <div className="pt-4">
                    <p className="text-[#656565] mb-2">Uploaded Image:</p>
                    <img
                      src={repair.uploadedImage}
                      alt="uploaded product"
                      className="w-full max-w-[220px] h-[180px] rounded-xl object-cover border"
                    />
                  </div>
                )}

                <div className="pt-6 space-y-2">
                  <p className="break-words">
                    <span className="text-[#656565]">Service Cost:</span>{" "}
                    {repair.cost}
                  </p>
                  <p className="break-words">
                    <span className="text-[#656565]">Platform Fee:</span> ₦0
                  </p>
                  <p className="break-words">
                    <span className="text-[#656565]">Tax Fee:</span> ₦0
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-blue-600 pt-2 break-words">
                    Total Fee: {repair.cost}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 sm:mt-8 lg:mt-16 max-w-4xl mx-auto pb-10 sm:pb-14 px-4 sm:px-6">
        <div className="text-center space-y-4">
          <button
            onClick={() =>
              navigate("/client/view-track-repair", { state: { repair } })
            }
            className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white cursor-pointer w-full sm:w-auto px-8 sm:px-16 py-3 rounded-md text-sm font-medium transition"
          >
            Track Repair
          </button>

          <div>
            <button
              onClick={() => navigate("/client/repair")}
              className="text-sm text-blue-600 cursor-pointer"
            >
              Rate Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewRepair;
