import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchLogo from '../assets/icons/search.png';
import Loader from '../assets/Loaders/Loader';
import { ExternalLink } from 'lucide-react';

const Filter = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState({
    artisans: [],
    services: [],
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef();
  const suggestionRef = useRef();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const keyword = searchTerm.trim();
      if (keyword.length > 0) {
        setLoading(true);
        setShowSuggestions(true);

        fetch(
          `${import.meta.env.VITE_API_SEARCH_URL}/search?keyword=${keyword}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error('Network response was not ok');
            }
            return res.json();
          })
          .then((data) => {
            // More flexible response handling
            let artisansList = [];
            let servicesList = [];

            if (data.success) {
              // Handle different possible response structures
              if (data.data?.artisans?.data) {
                artisansList = data.data.artisans.data;
              } else if (data.data?.artisans) {
                artisansList = data.data.artisans;
              } else if (data.artisans) {
                artisansList = data.artisans;
              }

              if (data.data?.services?.data) {
                servicesList = data.data.services.data;
              } else if (data.data?.services) {
                servicesList = data.data.services;
              } else if (data.services) {
                servicesList = data.services;
              }
            }

            setSuggestions({
              artisans: Array.isArray(artisansList) ? artisansList : [],
              services: Array.isArray(servicesList) ? servicesList : [],
            });
          })
          .catch((err) => {
            console.error('Search error:', err);
            setSuggestions({ artisans: [], services: [] });
          })
          .finally(() => setLoading(false));
      } else {
        setSuggestions({ artisans: [], services: [] });
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSuggestions &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        console.log(e.target, suggestionRef.current);
        console.log(suggestionRef.current.contains(e.target));
        setShowSuggestions(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSuggestions]);

  const renderSuggestions = () => (
    <div
      ref={suggestionRef}
      className="absolute top-14 w-full bg-white shadow-md rounded-lg border border-gray-200 z-50 max-h-64 overflow-auto"
    >
      {loading && (
        <div className="flex items-center justify-center gap-3 text-sm text-center py-4 text-gray-500">
          Searching...{' '}
          <Loader size={'4'} otherStyles={'inline-block text-blue-500'} />
        </div>
      )}

      {suggestions.error ? (
        <div className="text-red-500 text-sm p-3">{suggestions.error}</div>
      ) : (
        <>
          <div className="p-3">
            <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">
              Artisans
            </h4>
            {suggestions.artisans.length > 0
              ? suggestions.artisans.map((artisan) => (
                  <div
                    key={artisan._id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-400 text-sm"
                    onMouseDown={() => {
                      setShowSuggestions(false);
                      setSearchTerm('');
                      navigate(
                        `/client/selection?artisanId=${
                          artisan._id || artisan.id
                        }`
                      );
                    }}
                  >
                    👤 {artisan.fullName || 'Unnamed'}{' '}
                    <span className="text-gray-400 text-xs">
                      ({artisan.businessName || 'Unnamed business'})
                    </span>
                  </div>
                ))
              : !loading && (
                  <div className="text-gray-400 text-sm px-3 py-2">
                    No artisans found
                  </div>
                )}
          </div>

          <div className="border-t border-gray-100 p-3">
            <h4 className="text-xs text-gray-400 font-semibold uppercase mb-1">
              Services
            </h4>
            {suggestions.services.length > 0
              ? suggestions.services.map((service) => (
                  <div
                    key={service._id}
                    className="px-3 py-2 hover:bg-gray-100 text-gray-400 cursor-pointer text-sm"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchTerm('');
                      navigate(
                        `/client/selection?artisanId=${service.artisanId}&serviceId=${service._id}`
                      );
                    }}
                  >
                    🛠️ {service.title || 'Untitled Service'}{' '}
                    <span className="text-gray-400 text-xs">
                      ({service.description?.slice(0, 30)}...)
                    </span>
                  </div>
                ))
              : !loading && (
                  <div className="text-gray-400 text-sm px-3 py-2">
                    No services found
                  </div>
                )}
          </div>

          <div className="border-t border-gray-100 p-3">
            <p
              className="relative group flex items-center justify-center gap-2 text-xs text-gray-500 cursor-pointer hover:underline transition-all duration-300"
              onClick={() => {
                setShowSuggestions(false);
                setSearchTerm('');
                navigate('/client/home');
              }}
            >
              <span>View all</span>
              <ExternalLink className="w-3 h-3 group-hover:scale-110 transition-all duration-300" />
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-[#7A9DF7] to-[#7A9Dd7] w-full text-white py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center font-JejuMyeongjo">
          Explore
        </h2>

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 relative">
          <div className="flex items-center w-full relative">
            <img
              src={SearchLogo}
              alt="search"
              className="absolute left-4 w-5 h-5"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Service Names, Service Categories or Location"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gradient-to-l from-[#7a9df7] to-[#7a9ed7] border border-[#656eebd0] text-white placeholder-white text-sm md:text-base outline-none"
            />
          </div>

          <button className="w-full sm:w-auto h-12 px-6 bg-white text-black font-semibold rounded-full hover:bg-[#E0E0E0] transition-colors duration-300">
            Enter
          </button>
          {showSuggestions && renderSuggestions()}
        </div>
      </div>
    </div>
  );
};

export default Filter;
