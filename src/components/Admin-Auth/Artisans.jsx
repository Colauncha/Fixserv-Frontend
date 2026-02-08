// src/pages/admin/Artisans.jsx
import React, { useEffect, useState } from "react";

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      const res = await fetch(
        "https://user-management-h4hg.onrender.com/api/admin/getAll?role=ARTISAN"
      );
      const data = await res.json();
      setArtisans(data.users);
    } catch (err) {
      console.error("Failed to fetch artisans", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading artisans...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">All Artisans</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 text-left">Rating</th>
          </tr>
        </thead>
        <tbody>
          {artisans.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-2">{a.fullName}</td>
              <td className="p-2">{a.email}</td>
              <td className="p-2">{a.location || "—"}</td>
              <td className="p-2">{a.rating ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Artisans;
