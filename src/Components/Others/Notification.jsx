import { useEffect, useState, useCallback } from "react";
import { Bell, ChevronLeft, ChevronRight, Eye, Trash2 } from "lucide-react";
import useAuth from "../../Auth/useAuth";

const tabs = ['All', 'Unread'];

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('All');
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const {state} = useAuth()

  const token = state.token

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * limit;
      const statusFilter = activeTab === 'Unread' ? '&status=unread' : '';
      
      const response = await fetch(
        `https://notifications-service-9dn1.onrender.com/api/notifications?limit=${limit}&offset=${offset}${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      
      setNotifications(data.data || []);
      setUnreadCount(data.meta.unreadCount || 0);
      setTotal(data.pagination.total || 0);
      setTotalPages(Math.ceil((data.pagination.total || 0) / limit));
      
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, limit, activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        "https://notifications-service-9dn1.onrender.com/api/notifications/mark-all-read",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        // Refresh notifications after marking all as read
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `https://notifications-service-9dn1.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        // Update the specific notification in the list
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'read' }
              : notif
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(
        `https://notifications-service-9dn1.onrender.com/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.ok) {
        // Remove the notification from the list
        const deletedNotification = notifications.find(notif => notif.id === notificationId);
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        
        // Update unread count if the deleted notification was unread
        if (deletedNotification && deletedNotification.status === 'unread') {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        // Update total count
        setTotal(prev => prev - 1);
        
        // If current page becomes empty and it's not the first page, go to previous page
        if (notifications.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        } else {
          // Refresh to get updated data
          fetchNotifications();
        }
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="">
        <div className="max-w-full h-[100dvh] bg-white drop-shadow-xl overflow-hidden">
          <div className="flex items-center justify-between py-5 px-4 bg-gray-100 font-semibold text-gray-700">
            <span>Notification Center</span>
            <span 
              className="font-light text-sm cursor-pointer hover:text-blue-600 transition-colors"
              onClick={markAllAsRead}
            >
              Mark all as read
            </span>
          </div>
          
          {/* Tabs */}
          <div className="flex px-10 space-x-6 items-center gap-4 bg-gray-100">
            {tabs.map(tab => ( 
              <span 
                key={tab}
                className={`pb-2 text-sm cursor-pointer flex items-center gap-1 ${
                  activeTab === tab
                  ? "border-b-2 border-[#7a9df7d5] font-medium"
                  : "text-gray-500"
                }`}
                onClick={() => handleTabChange(tab)}
                >
                  {tab}
                  {tab === 'Unread' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
              </span>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-72 space-y-4 overflow-y-auto m-5">
            {!loading && notifications.length > 0 ? (
              notifications.map((note) => (
                <div
                  key={note.id}
                  className="bg-blue-50 p-4 rounded-md flex items-start gap-4 relative group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mr-3">
                    {note.title?.charAt(0) || "N"}
                  </div>
                  <div className="flex-1 text-sm text-gray-700">
                    <p className="font-medium">{note.title || "Notification"}</p>
                    <p className="text-xs text-gray-500">{note.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    {note.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(note.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Mark as read"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(note.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    {note.status === 'unread' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            ) : !loading ? (
              <div className="px-4 py-4 text-sm text-gray-500">
                {activeTab === 'Unread' ? 'No unread notifications found.' : 'No notifications found.'}
              </div>
            ) : null}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages} ({total} total)
              </div>

              <div className="flex gap-3 text-sm text-gray-700 items-center">
                <label htmlFor="perPage">Per Page</label>
                <select
                  name="perPage"
                  value={limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default Notification;