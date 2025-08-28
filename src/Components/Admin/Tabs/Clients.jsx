import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, X, Save, AlertTriangle } from 'lucide-react';
import useAuth from '../../../Auth/useAuth';

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const { state } = useAuth();
  const token = state.token;

  const searchClients = useCallback(async () => {
    if (!searchTerm.trim()) {
      setClients([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SEARCH_URL}/search?keyword=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search clients');
      }

      const resp = await response.json();
      setClients(resp.data?.clients?.data || []);
    } catch (err) {
      setError(err.message);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleEdit = (client) => {
    setEditingClient({
      ...client,
      clientData: {
        deliveryAddress: {
          street: client.clientData?.deliveryAddress?.street || '',
          city: client.clientData?.deliveryAddress?.city || '',
          postalCode: client.clientData?.deliveryAddress?.postalCode || '',
          state: client.clientData?.deliveryAddress?.state || '',
          country: client.clientData?.deliveryAddress?.country || 'Nigeria'
        },
        servicePreferences: client.clientData?.servicePreferences || []
      }
    });
  };

  const handleSaveEdit = async () => {
    if (!editingClient) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${editingClient.id || editingClient._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingClient)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      // Update the client in the list
      setClients(prev => 
        prev.map(c => c.id === editingClient.id ? editingClient : c)
      );
      setEditingClient(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${clientId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete client');
      }

      setClients(prev => prev.filter(c => c.id !== clientId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (role) => {
    const roleStyles = {
      CLIENT: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-red-100 text-red-800',
      ARTISAN: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${roleStyles[role] || roleStyles.CLIENT}`}>
        {role || 'CLIENT'}
      </span>
    );
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchClients();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchClients]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
          <p className="text-gray-600">Search, edit, and manage client profiles</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {isLoading && (
            <div className="mt-4 flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {clients.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({clients.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {clients.map((client, index) => (
                <div key={client.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <User className="text-gray-400 mr-2" size={20} />
                          <h3 className="text-lg font-medium text-gray-900">
                            {client.fullName || 'N/A'}
                          </h3>
                        </div>
                        {client.role && (
                          <div className="ml-4">
                            {getStatusBadge(client.role)}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        <div className="flex items-center text-gray-600">
                          <Mail className="mr-2" size={16} />
                          <span className="font-medium">Email:</span>
                          <span className="ml-1 truncate">{client.email || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Phone className="mr-2" size={16} />
                          <span className="font-medium">Phone:</span>
                          <span className="ml-1">{client.phoneNumber || client.phone || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="mr-2" size={16} />
                          <span className="font-medium">Location:</span>
                          <span className="ml-1">{client.location || client.address || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-2" size={16} />
                          <span className="font-medium">Joined:</span>
                          <span className="ml-1">{formatDate(client.dateJoined || client.createdAt)}</span>
                        </div>

                        {client.company && (
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">Company:</span>
                            <span>{client.company}</span>
                          </div>
                        )}

                        {client.totalOrders !== undefined && (
                          <div className="flex items-center text-gray-600">
                            <span className="font-medium mr-2">Orders:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {client.totalOrders}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Client"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(client)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchTerm && !isLoading && clients.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit Client</h3>
                <button
                  onClick={() => setEditingClient(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editingClient.fullName || ''}
                    onChange={(e) => setEditingClient({...editingClient, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingClient.email || ''}
                    onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editingClient.phoneNumber || ''}
                    onChange={(e) => setEditingClient({...editingClient, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editingClient.role || 'CLIENT'}
                    onChange={(e) => setEditingClient({...editingClient, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ARTISAN">Artisan</option>
                  </select>
                </div>

                {/* Delivery Address Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Delivery Address</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      <input
                        type="text"
                        value={editingClient.clientData?.deliveryAddress?.street || ''}
                        onChange={(e) => setEditingClient({
                          ...editingClient, 
                          clientData: {
                            ...editingClient.clientData,
                            deliveryAddress: {
                              ...editingClient.clientData.deliveryAddress,
                              street: e.target.value
                            }
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 123 Lagos St"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={editingClient.clientData?.deliveryAddress?.city || ''}
                          onChange={(e) => setEditingClient({
                            ...editingClient, 
                            clientData: {
                              ...editingClient.clientData,
                              deliveryAddress: {
                                ...editingClient.clientData.deliveryAddress,
                                city: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Lagos"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={editingClient.clientData?.deliveryAddress?.state || ''}
                          onChange={(e) => setEditingClient({
                            ...editingClient, 
                            clientData: {
                              ...editingClient.clientData,
                              deliveryAddress: {
                                ...editingClient.clientData.deliveryAddress,
                                state: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Lagos"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={editingClient.clientData?.deliveryAddress?.postalCode || ''}
                          onChange={(e) => setEditingClient({
                            ...editingClient, 
                            clientData: {
                              ...editingClient.clientData,
                              deliveryAddress: {
                                ...editingClient.clientData.deliveryAddress,
                                postalCode: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 100001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <input
                          type="text"
                          value={editingClient.clientData?.deliveryAddress?.country || 'Nigeria'}
                          onChange={(e) => setEditingClient({
                            ...editingClient, 
                            clientData: {
                              ...editingClient.clientData,
                              deliveryAddress: {
                                ...editingClient.clientData.deliveryAddress,
                                country: e.target.value
                              }
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Nigeria"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Preferences Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Service Preferences</h4>
                  <input
                    type="text"
                    value={editingClient.clientData?.servicePreferences ? editingClient.clientData.servicePreferences.join(', ') : ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient, 
                      clientData: {
                        ...editingClient.clientData,
                        servicePreferences: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., phone-repair, laptop-repair (comma-separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter services separated by commas</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="text-red-500 mr-3" size={24} />
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{deleteConfirm.fullName}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;