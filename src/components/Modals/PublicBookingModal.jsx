import { useState, useEffect} from 'react';
import { getIdentity } from '../../Auth/tokenStorage';
import { ExternalLink, GitPullRequestCreateArrowIcon } from "lucide-react";
import useAuth from '../../Auth/useAuth';

const PrivateBookingModal = ({ closeModal }) => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [submitData, setSubmitData] = useState({
    clientId: "",
    serviceId: ""
  });
  const { state } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = getIdentity();
        if (storedUser) {
          setUser(storedUser);
          setSubmitData(prevData => ({
            ...prevData,
            clientId: storedUser.id || storedUser._id
          }))
        } else {
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`https://service-management-1tz6.onrender.com/api/service/services`, {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${state.token}`,
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
        console.log('Fetched services:', data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchServices();
  }, [state]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://order-management-hm08.onrender.com/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit repair request');
      }

      const data = await response.json();
      console.log('Repair request submitted successfully:', data);
      closeModal();
    } catch (error) {
      console.error('Error submitting repair request:', error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700 opacity-80"
        onClick={closeModal}
      ></div>

      <div className="relative z-10 bg-white w-[90vw] max-w-2xl h-[80vh] rounded-xl shadow-lg flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b-1 border-gray-200">
          <GitPullRequestCreateArrowIcon className='w-5 h-5'/>
          <h2 className="text-lg font-semibold text-gray-800">Repair Form</h2>
          <button
            onClick={closeModal}
            className="text-2xl text-gray-600 hover:text-gray-800 transition"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.fullName || '—'}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || '—'}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={user?.phoneNumber || 'Not Provided'}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={user?.deliveryAddress?.country + ', ' + user?.deliveryAddress?.state  + ', ' +  user?.deliveryAddress?.city || '—'}
                  readOnly
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Service Type
                </label>
                <select
                  className="w-full px-4 py-2 bg-white border border-gray-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={submitData.serviceId}
                  onChange={(e) => setSubmitData({ ...submitData, serviceId: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  className="w-full flex items-center justify-center gap-4 mb-10 py-2 px-4 rounded-xl cursor-pointer text-sm font-light transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-102"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <ExternalLink className="w-5 h-5" />
                  Submit Repair Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateBookingModal;
