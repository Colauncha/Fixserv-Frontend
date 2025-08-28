import { useCallback, useState, useEffect } from 'react';
import { Search, Edit, Trash2, User, MapPin, Clock, Briefcase, X, Save, AlertTriangle } from 'lucide-react';
import useAuth from '../../../Auth/useAuth';

const Artisan = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [artisans, setArtisans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingArtisan, setEditingArtisan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const { state } = useAuth();
  const token = state.token;

  const searchArtisans = useCallback(async () => {
    if (!searchTerm.trim()) {
      setArtisans([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SEARCH_URL}/search?keyword=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search artisans');
      }

      const resp = await response.json();
      setArtisans(resp.data?.artisans?.data || []);
    } catch (err) {
      setError(err.message);
      setArtisans([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  const handleEdit = (artisan) => {
    setEditingArtisan({
      ...artisan,
      businessHours: artisan.businessHours || {}
    });
  };

  const handleSaveEdit = async () => {
    if (!editingArtisan) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${editingArtisan.id || editingArtisan._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingArtisan)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update artisan');
      }

      // Update the artisan in the list
      setArtisans(prev => 
        prev.map(a => a.id === editingArtisan.id ? editingArtisan : a)
      );
      setEditingArtisan(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (artisanId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${artisanId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete artisan');
      }

      setArtisans(prev => prev.filter(a => a.id !== artisanId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatBusinessHours = (businessHours) => {
    if (!businessHours || typeof businessHours !== 'object') return 'Not specified';
    
    const days = Object.entries(businessHours);
    if (days.length === 0) return 'Not specified';
    
    return days.map(([day, hours]) => 
      `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${hours.close}`
    ).join(', ');
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchArtisans();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchArtisans]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Artisan Management</h1>
          <p className="text-gray-600">Search, edit, and manage artisan profiles</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artisans by name, business, or skill..."
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
        {artisans.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({artisans.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {artisans.map((artisan, index) => (
                <div key={artisan.id || index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User className="text-gray-400 mr-2" size={20} />
                        <h3 className="text-lg font-medium text-gray-900">
                          {artisan.fullName || 'N/A'}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center text-gray-600">
                          <Briefcase className="mr-2" size={16} />
                          <span className="font-medium">Business:</span>
                          <span className="ml-1">{artisan.businessName || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <MapPin className="mr-2" size={16} />
                          <span className="font-medium">Location:</span>
                          <span className="ml-1">{artisan.location || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-start text-gray-600">
                          <span className="font-medium mr-2">Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {artisan.skillSet && artisan.skillSet.length > 0 ? 
                              artisan.skillSet.map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                  {skill}
                                </span>
                              )) : 
                              <span>Not specified</span>
                            }
                          </div>
                        </div>
                        
                        <div className="flex items-start text-gray-600 md:col-span-1">
                          <Clock className="mr-2 mt-0.5" size={16} />
                          <div>
                            <span className="font-medium">Hours:</span>
                            <p className="text-sm mt-1">{formatBusinessHours(artisan.businessHours)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(artisan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Artisan"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(artisan)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Artisan"
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
        {searchTerm && !isLoading && artisans.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No artisans found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* Edit Modal */}
        {editingArtisan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit Artisan</h3>
                <button
                  onClick={() => setEditingArtisan(null)}
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
                    value={editingArtisan.fullName || ''}
                    onChange={(e) => setEditingArtisan({...editingArtisan, fullName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={editingArtisan.businessName || ''}
                    onChange={(e) => setEditingArtisan({...editingArtisan, businessName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editingArtisan.location || ''}
                    onChange={(e) => setEditingArtisan({...editingArtisan, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={editingArtisan.skillSet ? editingArtisan.skillSet.join(', ') : ''}
                    onChange={(e) => setEditingArtisan({
                      ...editingArtisan, 
                      skillSet: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingArtisan(null)}
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

export default Artisan;