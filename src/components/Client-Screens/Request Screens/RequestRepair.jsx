import React, { useState } from "react";
import upload from "../../../assets/client images/client-home/referal part/upload.png";

const RequestRepair = () => {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const [formData, setFormData] = useState({
  title: "",
  description: "",
  price: "",
  estimatedDuration: "",
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async () => {
  setError("");

  const { title, description, price, estimatedDuration } = formData;

  if (!title || !description || !price || !estimatedDuration) {
    setError("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      "https://service-management-1tz6.onrender.com/api/service/createService",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("fixserv_token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          estimatedDuration,
          rating: 0,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create service");
    }

    alert("Service created successfully 🎉");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="w-full">

      <section className="w-full flex align-center justify-center py-14 mt-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-2 md:px-6">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-xl font-semibold mb-1">Request Repair</h1>
            <p className="text-sm text-gray-500">
              Tell us what needs fixing and we’ll connect you with the right technician for the job.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-3xl space-y-5">

{/* Simple fields */}
{["Device Type", "Location", "Service Required"].map((item) => (
  <input
    key={item}
    type="text"
    placeholder={item}
    className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
  />
))}

{/* Controlled form inputs */}
<input
  name="title"
  value={formData.title}
  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
  placeholder="Service Title"
  className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
/>

<input
  name="estimatedDuration"
  value={formData.estimatedDuration}
  onChange={(e) =>
    setFormData({ ...formData, estimatedDuration: e.target.value })
  }
  placeholder="Estimated Duration"
  className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
/>

<input
  type="number"
  name="price"
  value={formData.price}
  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
  placeholder="Service Price"
  className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
/>


            {/* Upload */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Upload image of Damaged Device
              </p>

              <label className="border-2 border-dashed border-gray-300 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition hover:border-blue-400">

                {preview ? (
                  <img src={preview} className="max-h-full object-contain" />
                ) : (
                  <>
                    <img src={upload} className="w-10 mb-3 opacity-70" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>

            {/* Issue & Notes */}
            <div className="mt-8 space-y-5 max-w-3xl">

              <textarea
  rows={5}
  name="description"
  value={formData.description}
  onChange={(e) =>
    setFormData({ ...formData, description: e.target.value })
  }
  placeholder="Service Description"
  className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm"
/>


              <textarea
                rows={3}
                placeholder="Additional Notes"
                className="w-full border border-blue-300 rounded-md px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {/* Continue Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition"
                >
                  Continue
                </button>
                <button
  onClick={handleSubmit}
  disabled={loading}
  className="bg-[#3E83C4] hover:bg-[#2d75b8] text-white px-16 py-2.5 rounded-md text-sm font-medium transition"
>
  {loading ? "Creating..." : "Create Service"}
</button>

{error && (
  <p className="text-red-500 text-sm text-center mt-3">
    {error}
  </p>
)}

              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default RequestRepair;
