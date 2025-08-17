import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../Auth/useAuth";

const Orders = () => {
  const { state } = useAuth();
  const token = state?.token;

  // Search states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Pagination and listing states
  const [allOrders, setAllOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  // Edit mode states
  const [editingOrder, setEditingOrder] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editEscrowStatus, setEditEscrowStatus] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [error, setError] = useState("");

  // Status options for dropdowns
  const statusOptions = ["pending", "in-progress", "completed", "cancelled"];
  const escrowStatusOptions = ["pending", "held", "released", "refunded"];

  // Fetch all orders
  const fetchAllOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError("");
    try {
      const res = await fetch(
        "https://order-management-hm08.onrender.com/api/orders/public",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      setAllOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, [token]);

  // Fetch all orders on component mount
  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  // Search orders
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    setError("");
    
    try {
      // Filter orders based on search keyword (client-side search)
      // You can replace this with an actual search API endpoint if available
      const filtered = allOrders.filter(order => 
        order.clientId?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.artisanId?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.serviceId?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.escrowStatus?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (err) {
      setError("Failed to search orders");
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(
        `https://order-management-hm08.onrender.com/api/orders/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete order");

      // Remove from both search results and all orders
      setSearchResults((prev) => prev.filter((o) => o.id !== id));
      setAllOrders((prev) => prev.filter((o) => o.id !== id));
      alert("Order deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Start editing
  const handleEdit = (order) => {
    setEditingOrder(order.id);
    setEditPrice(order.price.toString());
    setEditStatus(order.status);
    setEditEscrowStatus(order.escrowStatus);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingOrder(null);
    setEditPrice("");
    setEditStatus("");
    setEditEscrowStatus("");
  };

  // Update order
  const handleUpdate = async (id) => {
    if (!editPrice.trim() || !editStatus || !editEscrowStatus) return;

    setLoadingEdit(true);
    setError("");
    try {
      const res = await fetch(
        `https://order-management-hm08.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            price: parseFloat(editPrice), 
            status: editStatus,
            escrowStatus: editEscrowStatus
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update order");

      // Update in both lists
      const updateOrder = (order) => 
        order.id === id 
          ? { 
              ...order, 
              price: parseFloat(editPrice), 
              status: editStatus,
              escrowStatus: editEscrowStatus
            }
          : order;

      setAllOrders((prev) => prev.map(updateOrder));
      setSearchResults((prev) => prev.map(updateOrder));
      
      cancelEdit();
      alert("Order updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN"
    }).format(price || 0);
  };

  // Pagination logic
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = allOrders.slice(startIndex, startIndex + ordersPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "in-progress":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getEscrowStatusBadge = (escrowStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (escrowStatus?.toLowerCase()) {
      case "released":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "held":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "refunded":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const OrderItem = ({ order, showEditDelete = true }) => (
    <div key={order.id} className="bg-white border rounded-lg p-4 shadow-sm">
      {editingOrder === order.id ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escrow Status</label>
              <select
                value={editEscrowStatus}
                onChange={(e) => setEditEscrowStatus(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {escrowStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate(order.id)}
              disabled={loadingEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {loadingEdit ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-800">Order #{order.id}</h4>
              <p className="text-sm text-gray-500">Created: {formatDate(order.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={getStatusBadge(order.status)}>{order.status}</span>
              <span className={getEscrowStatusBadge(order.escrowStatus)}>{order.escrowStatus}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Client ID</p>
              <p className="text-sm text-gray-900">{order.clientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Artisan ID</p>
              <p className="text-sm text-gray-900">{order.artisanId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Service ID</p>
              <p className="text-sm text-gray-900">{order.serviceId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-sm font-semibold text-gray-900">{formatPrice(order.price)}</p>
            </div>
          </div>

          {showEditDelete && (
            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => handleEdit(order)}
                className="text-blue-500 hover:text-blue-700 p-2"
                title="Edit Order"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(order.id)}
                className="text-red-500 hover:text-red-700 p-2"
                title="Delete Order"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search Section */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Orders</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search by ID, client, artisan, service, or status..."
            className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loadingSearch}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loadingSearch ? "Searching..." : "Search"}
          </button>
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword("");
                setSearchResults([]);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Search Results ({searchResults.length})
            </h4>
            <div className="grid gap-4">
              {searchResults.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))}
            </div>
          </div>
        )}

        {searchKeyword && searchResults.length === 0 && !loadingSearch && (
          <p className="text-gray-500 text-center py-4">No search results found</p>
        )}
      </section>

      {/* All Orders with Pagination */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            All Orders ({allOrders.length})
          </h3>
          <button
            onClick={fetchAllOrders}
            disabled={loadingOrders}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {loadingOrders ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <>
            {allOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No orders found</p>
            ) : (
              <>
                <div className="grid gap-4 mb-6">
                  {paginatedOrders.map((order) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-1 rounded border ${
                          currentPage === page
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Orders;