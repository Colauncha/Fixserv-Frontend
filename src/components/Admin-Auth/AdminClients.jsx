import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(
          "https://user-management-h4hg.onrender.com/api/admin/getAll",
          {
            params: { role: "CLIENT" },
            // headers: { Authorization: `Bearer ${token}` } // later
          }
        );

        setClients(res.data.users);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading clients...</p>;

  return (
    <div>
      <h2>All Clients</h2>

      {clients.length === 0 ? (
        <p>No clients found</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <strong>{client.fullName}</strong> — {client.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminClients;
