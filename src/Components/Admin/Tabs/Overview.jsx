import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield, Users, Wrench, ShoppingCart, Eye, Briefcase, IdCard, TrafficCone, ChartGantt } from 'lucide-react';
import { getIdentity } from '../../../Auth/tokenStorage';

const Overview = () => {
  const identity = getIdentity();
  const [stats, setStats] = useState({
    visitors: null,
    nuVisitors: null,
    clients: null,
    artisans: null,
    services: null,
    orders: null
  });
  const [loading, setLoading] = useState({
    visitors: false,
    clients: false,
    artisans: false,
    services: false,
    orders: false
  });
  const [error, setError] = useState('');

  const [trafficSectionToggle, setTrafficSectionToggle] = useState(false);


  const fetchVisitorsCount = async () => {
    setLoading(prev => ({ ...prev, visitors: true }));
    try {
      const response = await fetch(
        `${import.meta.env.VITE_NEWS_LETTER_URL}/api/tracking/visitors/count`,
        {
          method: 'GET',
          headers: {
            'x-clientname': 'FIXSERV'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch visitors count');
      }

      const data = await response.json();
      setStats(prev => ({ ...prev,
        visitors: data.count || 0 ,
        nuVisitors: data.nonunique_count || 0
      }));
    } catch (err) {
      console.error('Error fetching visitors count:', err);
      setError('Failed to load some statistics');
    } finally {
      setLoading(prev => ({ ...prev, visitors: false }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      ADMIN: 'bg-red-100 text-red-800',
      CLIENT: 'bg-blue-100 text-blue-800',
      ARTISAN: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[role] || roleStyles.CLIENT}`}>
        {role}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, loading, color = 'blue', onClick = null }) => {
    const colorStyles = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    };

    return (
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                <span className="ml-2 text-gray-500">Loading...</span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {value !== null ? value.toLocaleString() : '--'}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${colorStyles[color]}`}>
            <Icon size={24} alt={Icon} />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Fetch visitors count
    fetchVisitorsCount();
  }, []);

  if (!identity) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with Fixserv.</p>
        </div>

        {/* Admin Identity Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Profile</h2>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <User className="text-gray-400 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{identity.fullName}</h3>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
                <div className="ml-4">
                  {getRoleBadge(identity.role)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mt-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2" size={16} />
                  <span className="font-medium">Email:</span>
                  <span className="ml-1 truncate text-sm">{identity.email}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2" size={16} />
                  <span className="font-medium">Phone:</span>
                  <span className="ml-1 text-sm">{identity.phoneNumber}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={16} />
                  <span className="font-medium">Created:</span>
                  <span className="ml-1 truncate text-sm">{formatDate(identity.createdAt)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <IdCard className="mr-2" size={16} />
                  <span className="font-medium mr-2">ID:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {identity._id}
                  </span>
                </div>

                {identity.permissions && identity.permissions.length > 0 && (
                  <div className="flex items-start text-gray-600 md:col-span-2">
                    <Shield className="mr-2 mt-0.5" size={16} />
                    <div className='flex gap-2 flex-wrap items-center'>
                      <span className="font-medium mr-3">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {identity.permissions.map((permission, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {permission.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {formatDate(identity.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <StatCard
              title="Visitors"
              value={stats.visitors}
              icon={Eye}
              loading={loading.visitors}
              color="blue"
              onClick={() => setTrafficSectionToggle(!trafficSectionToggle)}
            />
            
            <StatCard
              title="Clients"
              value={stats.clients}
              icon={Users}
              loading={loading.clients}
              color="green"
            />
            
            <StatCard
              title="Artisans"
              value={stats.artisans}
              icon={Wrench}
              loading={loading.artisans}
              color="purple"
            />
            
            <StatCard
              title="Services"
              value={stats.services}
              icon={Briefcase}
              loading={loading.services}
              color="orange"
            />
            
            <StatCard
              title="Orders"
              value={stats.orders}
              icon={ShoppingCart}
              loading={loading.orders}
              color="indigo"
            />
          </div>
        </div>

        {/* Traffic section */}
        {trafficSectionToggle && (
          <div className="bg-white rounded-lg mb-8 shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Traffic and Visitors count
            </h3>
            <div className="flex flex-col">
              <div className="flex items-center text-gray-600 mb-2">
                <TrafficCone className="mr-2" size={16} />
                <span className="font-medium">Unique Visitors:</span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.visitors !== null
                    ? stats.visitors.toLocaleString()
                    : '--'}
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <ChartGantt className="mr-2" size={16} />
                <span className="font-medium">Non-Unique Visitors:</span>
                <span className="ml-1 text-sm">
                  {loading.visitors
                    ? 'Loading...'
                    : stats.nuVisitors !== null
                    ? stats.nuVisitors.toLocaleString()
                    : '--'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions or Recent Activity could go here */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="text-blue-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">Manage Clients</h4>
              <p className="text-sm text-gray-600">View and edit client profiles</p>
            </button>
            
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Wrench className="text-green-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">Manage Artisans</h4>
              <p className="text-sm text-gray-600">View and edit artisan profiles</p>
            </button>
            
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingCart className="text-purple-600 mb-2" size={20} />
              <h4 className="font-medium text-gray-900">View Orders</h4>
              <p className="text-sm text-gray-600">Monitor platform orders</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;