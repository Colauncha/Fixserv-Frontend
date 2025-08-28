import { useEffect, useState } from 'react';
import { getIdentity } from '../../Auth/tokenStorage';
import { useNavigate } from 'react-router-dom';
import Fetch from '../../util/Fetch';
import { 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Filter,
  Calendar,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';

function ArtisanHome() {
  const [artisan, setArtisan] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Load artisan data from localStorage
  useEffect(() => {
    const storedData = getIdentity();
    console.log(storedData)
    if (storedData) {
      try {
        setArtisan(storedData);
      } catch (error) {
        console.error("Failed to parse artisan data:", error);
      }
    } else {
      console.warn("No artisanData found in localStorage");
    }
  }, []);

  // Fetch orders from API
  useEffect(() => {
    setSearchTerm('');
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const {data, success, error} = await Fetch({
          url: `${import.meta.env.VITE_API_ORDER_URL}/orders/public`
        });
        
        if (!success) {
          throw new Error(`Failed to fetch orders: ${error}`);
        }
        
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [retryCount]);

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      'COMPLETED': {
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Completed'
      },
      'PENDING': {
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Pending'
      },
      'IN_PROGRESS': {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <Clock className="w-4 h-4" />,
        text: 'In Progress'
      },
      'CANCELLED': {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="w-4 h-4" />,
        text: 'Cancelled'
      }
    };

    return statusConfig[status] || statusConfig['PENDING'];
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.uploadedProducts?.some(product => 
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || order.clientAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilter === 'all' || order.status.toLowerCase() === activeFilter.toLowerCase() || order.artisanId === artisan.id;

    return matchesSearch && matchesFilter;
  });

  // Get filter counts
  const filterCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    in_progress: orders.filter(o => o.status === 'IN_PROGRESS').length,
    mine: orders.filter(o => o.artisanId === artisan.id).length,
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleViewOrderDetails = (orderId) => {
    console.log('Viewing order details:', orderId);
    navigate(`/artisans/job/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {[
              { key: 'all', label: 'All Orders', count: filterCounts.all },
              { key: 'pending', label: 'Pending', count: filterCounts.pending },
              { key: 'in_progress', label: 'In Progress', count: filterCounts.in_progress },
              { key: 'completed', label: 'Completed', count: filterCounts.completed },
              { key: 'mine', label: 'Mine', count: filterCounts.mine },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeFilter === filter.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Available Orders</h2>
            </div>
            {error && (
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load orders</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || activeFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'New orders will appear here when available.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredOrders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status, order.escrowStatus);
                
                return (
                  <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      
                      {/* Order Images */}
                      <div className="flex-shrink-0">
                        {order.uploadedProducts?.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {order.uploadedProducts.slice(0, 3).map((product, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={product.imageUrl}
                                  alt={product.description}
                                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                                />
                                {idx === 2 && order.uploadedProducts.length > 3 && (
                                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                      +{order.uploadedProducts.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.id.slice(0, 8)}...
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color}`}>
                                {statusDisplay.icon}
                                {statusDisplay.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {formatPrice(order.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              Escrow: {order.escrowStatus?.replace('_', ' ') || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {/* Problem Description */}
                        {order.uploadedProducts?.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Problem Description:</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {order.uploadedProducts[0].description}
                            </p>
                          </div>
                        )}

                        {/* Location & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {order.clientAddress?.city}, {order.clientAddress?.state}, {order.clientAddress?.country}
                            </span>
                          </div>
                          
                          <div className="flex gap-3">
                            <button 
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
                              onClick={() => handleViewOrderDetails(order.id)}
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            {order.status === 'PENDING' && (
                              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
                                Accept Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtisanHome;