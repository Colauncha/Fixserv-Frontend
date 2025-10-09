import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../Auth/useAuth';
import Fetch from '../../util/Fetch';
import { getIdentity } from '../../Auth/tokenStorage';
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  CreditCard,
  Eye,
  MessageSquare,
} from 'lucide-react';
import CharProfilePic from '../CharProfilePic';
import { toast } from 'react-toastify';
import Loader from '../../assets/Loaders/Loader';

const OrderDetails = () => {
  const location = useLocation();
  const orderId = location.pathname.split('/').pop();
  const navigate = useNavigate();
  const { state } = useAuth();

  const [order, setOrder] = useState(null);
  const [client, setClient] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loaders, setLoaders] = useState({
    cancel: false,
    complete: false,
  });

  useEffect(() => {
    const storedUser = getIdentity();
    setCurrentUser(storedUser);

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // First, fetch the order details (you'll need to replace this with your actual order endpoint)
        const { data: orderData, error: orderError } = await Fetch({
          url: `${
            import.meta.env.VITE_API_ORDER_URL
          }/orders/${orderId}/getOrder`,
          token: state.token,
        });

        if (orderError) {
          throw new Error(`Failed to fetch order: ${orderError.message}`);
        }

        setOrder(orderData);

        // Fetch client details
        const { data: clientData, error: clientError } = await Fetch({
          url: `${import.meta.env.VITE_API_URL}/api/admin/user/${
            orderData.clientId
          }`,
          token: state.token,
        });

        if (clientError) {
          console.error('Error fetching client:', clientError);
        } else {
          setClient(clientData);
        }

        // Fetch artisan details
        const { data: artisanData, error: artisanError } = await Fetch({
          url: `${import.meta.env.VITE_API_URL}/api/admin/user/${
            orderData.artisanId
          }`,
          token: state.token,
        });

        if (artisanError) {
          console.error('Error fetching artisan:', artisanError);
        } else {
          setArtisan(artisanData);
        }

        // Fetch service details
        if (orderData.serviceId) {
          const { data: serviceData, error: serviceError } = await Fetch({
            url: `${import.meta.env.VITE_API_SERVICE_URL}/service/${
              orderData.serviceId
            }`,
            token: state.token,
          });

          if (serviceError) {
            console.error('Error fetching service:', serviceError);
          } else {
            setService(serviceData);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, state.token]);

  const getStatusDisplay = (status) => {
    const statusConfig = {
      COMPLETED: {
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <CheckCircle className="w-5 h-5" />,
        text: 'Completed',
      },
      PENDING: {
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <AlertCircle className="w-5 h-5" />,
        text: 'Pending',
      },
      PENDING_ARTISAN_RESPONSE: {
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <AlertCircle className="w-5 h-5" />,
        text: 'Pending artisan acceptance',
      },
      IN_PROGRESS: {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <Clock className="w-5 h-5" />,
        text: 'In Progress',
      },
      ACCEPTED: {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <Clock className="w-5 h-5" />,
        text: 'In Progress',
      },
      CANCELLED: {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="w-5 h-5" />,
        text: 'Cancelled',
      },
    };

    return statusConfig[status] || statusConfig['PENDING'];
  };

  const getEscrowStatusDisplay = (escrowStatus) => {
    const escrowConfig = {
      PAID: {
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <Shield className="w-4 h-4" />,
        text: 'Funds Secured',
      },
      NOT_PAID: {
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <CreditCard className="w-4 h-4" />,
        text: 'Payment Pending',
      },
      RELEASED: {
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Funds Released',
      },
      REFUNDED: {
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        icon: <ArrowLeft className="w-4 h-4" />,
        text: 'Refunded',
      },
    };

    return escrowConfig[escrowStatus] || escrowConfig['NOT_PAID'];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCancelOrder = async () => {
    try {
      setLoaders({ ...loaders, cancel: true });
      const { resp, error, success } = Fetch({
        url: `${import.meta.env.VITE_API_ORDER_URL}/orders/${orderId}/cancel`,
        token: state.token,
        method: 'POST',
      });

      if (!success) {
        throw new Error(`Error: ${error}`);
      }
      toast.success('Job cancelled successfully');
      console.log(resp);
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoaders({ cancel: false, complete: false });
    }
  };

  const handleCompleteOrder = async () => {
    try {
      setLoaders({ ...loaders, complete: true });
      const { resp, error, success } = Fetch({
        url: `${
          import.meta.env.VITE_API_ORDER_URL
        }/orders/${orderId}/release-payment`,
        token: state.token,
        method: 'POST',
      });

      if (!success) {
        throw new Error(`Error: ${error}`);
      }
      toast.success('Job completed successfully');
      console.log(resp);
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoaders({ cancel: false, complete: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);
  const escrowDisplay = getEscrowStatusDisplay(order.escrowStatus);
  const isClient = currentUser?.role === 'CLIENT';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/80 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">Order #{order.id.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Overview */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Overview
                  </h2>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusDisplay.color}`}
                    >
                      {statusDisplay.icon}
                      {statusDisplay.text}
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${escrowDisplay.color}`}
                    >
                      {escrowDisplay.icon}
                      {escrowDisplay.text}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatPrice(order.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Created: {formatDate(order.createdAt)}
                  </div>
                </div>
              </div>

              {/* Service Information */}
              {service && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Service Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">
                        Base Price: {formatPrice(service.details.price)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Duration: {service.estimatedDuration}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Products/Problem Description */}
            {order.uploadedProducts && order.uploadedProducts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Problem Details
                </h2>
                <div className="grid gap-6">
                  {order.uploadedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.objectName || 'Problem image'}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {product.objectName}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(product.uploadedAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">
                            {product.description}
                          </p>
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View Full Size
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Address */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Service Location
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    {order.clientAddress.street}
                  </p>
                  <p className="text-gray-600">
                    {order.clientAddress.city}, {order.clientAddress.state}{' '}
                    {order.clientAddress.postalCode}
                  </p>
                  <p className="text-gray-600">{order.clientAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons for Artisan */}
            {isClient && currentUser.id === order.clientId && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  {order.status.startsWith('PENDING') && (
                    <button
                      onClick={handleCancelOrder}
                      className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium"
                    >
                      {loaders.cancel ? (
                        <Loader size={6} otherStyles={'text-white'} />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          Cancel Order
                        </>
                      )}
                    </button>
                  )}
                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={handleCompleteOrder}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      {loaders.cancel ? (
                        <Loader size={6} otherStyles={'text-white'} />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Mark as Complete
                        </>
                      )}
                    </button>
                  )}
                  {isClient ? (
                    <button
                      // onClick={() => navigate(`/chat/${order.id}`)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Chat with Artisan
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium">
                      <MessageSquare className="w-5 h-5" />
                      Contact Client
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Client Information */}
            {client && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Client Information
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  {client.profilePicture ? (
                    <img
                      src={client.profilePicture}
                      alt={client.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <CharProfilePic size="16" username={client.fullName} />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {client.fullName}
                    </h4>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {client.deliveryAddress.state +
                        ', ' +
                        client.deliveryAddress.street || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Artisan Information (for clients) */}
            {artisan && isClient && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Artisan Information
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  {artisan.profilePicture ? (
                    <img
                      src={artisan.profilePicture}
                      alt={artisan.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <CharProfilePic size="16" username={artisan.fullName} />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {artisan.fullName}
                    </h4>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {artisan.rating || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {artisan.location || 'N/A'}
                    </span>
                  </div>
                </div>
                {artisan.skillSet && artisan.skillSet.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {artisan.skillSet.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                      {artisan.skillSet.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{artisan.skillSet.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Information */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Amount:</span>
                  <span className="font-semibold">
                    {formatPrice(order.price)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Escrow Status:</span>
                  <span
                    className={`text-sm font-medium ${
                      escrowDisplay.color.split(' ')[0]
                    }`}
                  >
                    {escrowDisplay.text}
                  </span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Ref:</span>
                    <span className="text-sm font-mono">
                      {order.paymentReference}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Order Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order Created
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                {/* Add more timeline items based on order status */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;