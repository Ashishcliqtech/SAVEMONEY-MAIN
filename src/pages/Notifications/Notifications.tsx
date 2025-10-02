import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Bell,
  Filter,
  Search,
  Check,
  CheckCheck,
  Gift,
  Wallet,
  Users,
  AlertCircle,
  Info,
  Settings,
  Trash2,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Card, Button, Badge, SearchBar, LoadingSpinner, ErrorState } from '../../components/ui';
import { useUserNotifications } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Main component for the Notifications page
export const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  // State management for filters and search
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Fetching notification data using a custom hook
  const { 
    notifications: notificationsData, 
    isLoading: isNotificationsLoading, 
    isError, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useUserNotifications(user?._id);
  
  // Processing notification data
  const notifications = notificationsData || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Helper function to get an icon based on notification type
  const getNotificationIcon = (type: string) => {
    const iconClasses = "w-6 h-6";
    switch (type) {
      case 'deal': return <Gift className={`${iconClasses} text-orange-500`} />;
      case 'cashback': return <Wallet className={`${iconClasses} text-green-500`} />;
      case 'withdrawal': return <Wallet className={`${iconClasses} text-blue-500`} />;
      case 'referral': return <Users className={`${iconClasses} text-purple-500`} />;
      case 'support': return <AlertCircle className={`${iconClasses} text-red-500`} />;
      default: return <Info className={`${iconClasses} text-gray-500`} />;
    }
  };

  // Helper function to get background color based on notification type
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'deal': return 'bg-orange-100/80';
      case 'cashback': return 'bg-green-100/80';
      case 'withdrawal': return 'bg-blue-100/80';
      case 'referral': return 'bg-purple-100/80';
      case 'support': return 'bg-red-100/80';
      default: return 'bg-gray-100/80';
    }
  };

  // Filtering logic for notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'read' && notification.isRead) || (statusFilter === 'unread' && !notification.isRead);
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesSearch = searchQuery === '' || notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Data for filter buttons
  const statusFilters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'read', label: 'Read', count: notifications.length - unreadCount },
  ];

  const notificationTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'deal', label: 'Deals' },
    { id: 'cashback', label: 'Cashback' },
    { id: 'withdrawal', label: 'Withdrawals' },
    { id: 'referral', label: 'Referrals' },
    { id: 'support', label: 'Support' },
  ];

  // Loading state UI
  if (isAuthLoading || isNotificationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" text="Loading notifications..." />
      </div>
    );
  }

  // Error state UI
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <ErrorState 
          title="Failed to load notifications"
          message={error?.message || 'An unexpected error occurred. Please try again later.'}
        />
      </div>
    );
  }

  // Filter sidebar component
  const FilterSidebar = () => (
    <aside className="space-y-6">
      {/* Search bar */}
      <Card withShadow>
        <h3 className="font-semibold text-gray-800 mb-3">Search</h3>
        <SearchBar placeholder="Search..." onSearch={setSearchQuery} />
      </Card>

      {/* Status filter */}
      <Card withShadow>
        <h3 className="font-semibold text-gray-800 mb-4">Filter by Status</h3>
        <div className="flex flex-col space-y-2">
          {statusFilters.map(item => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                statusFilter === item.id 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <span className="font-medium">{item.label}</span>
              <Badge variant={statusFilter === item.id ? 'light' : 'secondary'}>{item.count}</Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Type filter */}
      <Card withShadow>
        <h3 className="font-semibold text-gray-800 mb-3">Filter by Type</h3>
        <div className="space-y-2">
          {notificationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                typeFilter === type.id 
                  ? 'bg-blue-100 text-blue-800 font-semibold' 
                  : 'hover:bg-gray-50 text-gray-600'
              }`}>
              {type.label}
            </button>
          ))}
        </div>
      </Card>
    </aside>
  );

  // Main JSX for the page
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header section */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 lg:hidden">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="primary"
                  icon={CheckCheck}
                  onClick={() => markAllAsRead()}
                >
                  Mark All as Read
                </Button>
              )}
              <Button
                variant="outline"
                icon={Filter}
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                className="lg:hidden"
              >
                Filters
              </Button>
            </div>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Sidebar (Drawer) */}
          {isFilterSidebarOpen && (
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsFilterSidebarOpen(false)}></div>
          )}
          <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* Notifications List */}
          <main className="lg:col-span-3">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07, duration: 0.3 }}
                  >
                    <Card 
                      withShadow 
                      className={`transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${
                        !notification.isRead ? 'bg-white border-l-4 border-blue-500' : 'bg-white/70'
                      }`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-semibold text-base ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1 mb-3 leading-relaxed text-sm">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" size="sm" className="capitalize">{notification.type}</Badge>
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm" 
                                  icon={Check}
                                  onClick={() => markAsRead(notification._id)}
                                  className="text-blue-600 hover:bg-blue-50 text-xs"
                                >
                                  Mark as Read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon_sm"
                                icon={Trash2}
                                onClick={() => deleteNotification(notification._id)}
                                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-20" withShadow>
                <Bell className="w-20 h-20 text-gray-300 mx-auto mb-5" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? 'No Matching Notifications' : 'No Notifications Yet'}
                </h2>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filter settings to find what you\'re looking for.'
                    : 'New notifications from deals, cashback, and updates will appear here.'
                  }
                </p>
                {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};