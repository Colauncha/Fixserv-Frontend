import { useState, useEffect, useCallback } from "react";
import useAuth from "../../../Auth/useAuth";

const Services = () => {
  const { state } = useAuth();
  const token = state?.token;

  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Pagination and listing states
  const [allServices, setAllServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  // Edit mode states
  const [editingService, setEditingService] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [error, setError] = useState("");

  // Fetch all services
  const fetchAllServices = useCallback(async () => {
    setLoadingServices(true);
    setError('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVICE_URL}/service/admin/getAll`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch services');

      const data = await res.json();
      setAllServices(data?.data || []);
    } catch (err) {
      setError('Failed to fetch services');
      console.error(err);
    } finally {
      setLoadingServices(false);
    }
  }, [token]);

  // Fetch all services on component mount
  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  // Search service
  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoadingSearch(true);
    setError('');
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_SEARCH_URL
        }/search?keyword=${encodeURIComponent(keyword)}`
      );
      const data = await res.json();
      setSearchResults(data?.data?.services?.data || []);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Create service
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoadingCreate(true);
    setError('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVICE_URL}/service/admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!res.ok) throw new Error('Failed to create service');

      setTitle('');
      setDescription('');
      alert('Service created successfully!');
      fetchAllServices(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCreate(false);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?'))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVICE_URL}/service/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to delete service');

      // Remove from both search results and all services
      setSearchResults((prev) => prev.filter((s) => s.id !== id));
      setAllServices((prev) => prev.filter((s) => s.id !== id));
      alert('Service deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  // Start editing
  const handleEdit = (service) => {
    setEditingService(service.id);
    setEditTitle(service.title);
    setEditDescription(service.description);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingService(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Update service
  const handleUpdate = async (id) => {
    if (!editTitle.trim() || !editDescription.trim()) return;

    setLoadingEdit(true);
    setError('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_SERVICES_URL}/service/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to update service');

      // Update in both lists
      const updateService = (service) =>
        service.id === id
          ? { ...service, title: editTitle, description: editDescription }
          : service;

      setAllServices((prev) => prev.map(updateService));
      setSearchResults((prev) => prev.map(updateService));

      cancelEdit();
      alert('Service updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allServices.length / servicesPerPage);
  const startIndex = (currentPage - 1) * servicesPerPage;
  const paginatedServices = allServices.slice(startIndex, startIndex + servicesPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const ServiceItem = ({ service, showEditDelete = true }) => (
    <li key={service.id} className="p-4 border rounded-lg bg-white shadow-sm">
      {editingService === service.id ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border rounded px-3 py-2 w-full font-medium"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdate(service.id)}
              disabled={loadingEdit}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {loadingEdit ? "Saving..." : "Save"}
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-medium text-gray-800">{service.title}</p>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Created by: {service.createdBy} | Status: {service.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          {showEditDelete && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(service)}
                className="text-blue-500 hover:text-blue-700 p-1"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Services Management</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

      {/* Search */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Services</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
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
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Search Results ({searchResults.length})</h4>
            <ul className="space-y-3">
              {searchResults.map((service) => (
                <ServiceItem key={service.id} service={service} />
              ))}
            </ul>
          </div>
        )}

        {keyword && searchResults.length === 0 && !loadingSearch && (
          <p className="text-gray-500 text-center py-4">No search results found</p>
        )}
      </section>

      {/* Create Service */}
      <section className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Service</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Service Title"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Service Description"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loadingCreate}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loadingCreate ? "Creating..." : "Create Service"}
          </button>
        </form>
      </section>


      {/* All Services with Pagination */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">All Services</h3>
          <button
            onClick={fetchAllServices}
            disabled={loadingServices}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {loadingServices ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loadingServices ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading services...</p>
          </div>
        ) : (
          <>
            {allServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No services found</p>
            ) : (
              <>
                <ul className="space-y-3 mb-6">
                  {paginatedServices.map((service) => (
                    <ServiceItem key={service.id} service={service} />
                  ))}
                </ul>

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

export default Services;