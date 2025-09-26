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
} from 'lucide-react';
import { Card, Button, Badge, SearchBar, LoadingSpinner } from '../../components/ui';
import { useNotifications } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const Notifications: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: notificationsData, isLoading, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return <Gift className="w-6 h-6 text-orange-500" />;
      case 'cashback':
        return <Wallet className="w-6 h-6 text-green-500" />;
      case 'withdrawal':
        return <Wallet className="w-6 h-6 text-blue-500" />;
      case 'referral':
        return <Users className="w-6 h-6 text-purple-500" />;
      case 'support':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'deal':
        return 'bg-orange-100';
      case 'cashback':
        return 'bg-green-100';
      case 'withdrawal':
        return 'bg-blue-100';
      case 'referral':
        return 'bg-purple-100';
      case 'support':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const filteredNotifications = notifications?.filter(notification => {
    const matchesFilter = filter === 'all' || 
      (filter === 'read' && notification.isRead) || 
      (filter === 'unread' && !notification.isRead);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesType && matchesSearch;
  });

  const notificationTypes = [
    { id: 'all', label: 'All Types', count: notifications?.length || 0 },
    { id: 'deal', label: 'Deals', count: notifications?.filter(n => n.type === 'deal').length || 0 },
    { id: 'cashback', label: 'Cashback', count: notifications?.filter(n => n.type === 'cashback').length || 0 },
    { id: 'withdrawal', label: 'Withdrawals', count: notifications?.filter(n => n.type === 'withdrawal').length || 0 },
    { id: 'referral', label: 'Referrals', count: notifications?.filter(n => n.type === 'referral').length || 0 },
    { id: 'support', label: 'Support', count: notifications?.filter(n => n.type === 'support').length || 0 },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <Button
                variant="primary"
                icon={CheckCheck}
                onClick={markAllAsRead}
                size="sm"
              >
                <span className="hidden sm:inline">Mark All as Read</span>
                <span className="sm:hidden">Mark All</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Search - Top */}
          <div className="mb-6">
            <SearchBar
              placeholder="Search notifications..."
              onSearch={setSearchQuery}
            />
          </div>

          {/* Mobile Filters - Middle */}
          <div className="mb-8 space-y-6">
            {/* Status Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-base">Filter by Status</h3>
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {[
                  { id: 'all', label: 'All', count: notifications?.length || 0 },
                  { id: 'unread', label: 'Unread', count: unreadCount },
                  { id: 'read', label: 'Read', count: (notifications?.length || 0) - unreadCount },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id as any)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm whitespace-nowrap ${
                      filter === item.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      filter === item.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-base">Filter by Type</h3>
              <div className="flex overflow-x-auto space-x-3 pb-2">
                {notificationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTypeFilter(type.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors text-sm whitespace-nowrap ${
                      typeFilter === type.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{type.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      typeFilter === type.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {type.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Notifications List - Bottom */}
          <div className="space-y-3">
            {filteredNotifications && filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`} padding="sm">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBgColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2 leading-relaxed text-sm">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            <Badge variant="secondary" size="sm">
                              {notification.type}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm" 
                                icon={Check}
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1"
                              />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={Trash2}
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 text-xs px-2 py-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all' 
                    ? 'No matching notifications' 
                    : 'No notifications yet'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'You\'ll see notifications here when you have updates'
                  }
                </p>
                {(searchQuery || filter !== 'all' || typeFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Search */}
              <Card padding="sm">
                <SearchBar
                  placeholder="Search notifications..."
                  onSearch={setSearchQuery}
                />
              </Card>

              {/* Status Filter */}
              <Card padding="sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Status</h3>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All', count: notifications?.length || 0 },
                    { id: 'unread', label: 'Unread', count: unreadCount },
                    { id: 'read', label: 'Read', count: (notifications?.length || 0) - unreadCount },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFilter(item.id as any)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
                        filter === item.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      <Badge variant={filter === item.id ? 'primary' : 'secondary'} size="sm">
                        {item.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Type Filter */}
              <Card padding="sm">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Type</h3>
                <div className="space-y-1">
                  {notificationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setTypeFilter(type.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
                        typeFilter === type.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">{type.label}</span>
                      <Badge variant={typeFilter === type.id ? 'primary' : 'secondary'} size="sm">
                        {type.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3">
            {filteredNotifications && filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`} padding="sm">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 mb-2 leading-relaxed text-sm">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span>
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </span>
                                <Badge variant="secondary" size="sm">
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 mt-2 sm:mt-0 sm:ml-3">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm" 
                                  icon={Check}
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1"
                                >
                                  <span className="hidden sm:inline">Read</span>
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={Trash2}
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700 text-xs px-2 py-1"
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
              <Card className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all' 
                    ? 'No matching notifications' 
                    : 'No notifications yet'
                  }
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'You\'ll see notifications here when you have updates'
                  }
                </p>
                {(searchQuery || filter !== 'all' || typeFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};