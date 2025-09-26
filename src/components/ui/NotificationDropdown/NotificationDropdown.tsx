import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Bell,
  X,
  Check,
  Gift,
  Wallet,
  Users,
  AlertCircle,
  Info,
  CheckCheck,
  Eye,
} from 'lucide-react';
import { Button, Badge } from '../';
import { useNotifications } from '../../../hooks/useSupabase';
import { useAuth } from '../../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: notificationsData, markAsRead, markAllAsRead } = useNotifications(user?.id);

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;
  const recentNotifications = notifications.slice(0, 8);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (type) {
      case 'deal':
        return <Gift {...iconProps} className={`${iconProps.className} text-orange-500`} />;
      case 'cashback':
        return <Wallet {...iconProps} className={`${iconProps.className} text-green-500`} />;
      case 'withdrawal':
        return <Wallet {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      case 'referral':
        return <Users {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      case 'support':
        return <AlertCircle {...iconProps} className={`${iconProps.className} text-red-500`} />;
      default:
        return <Info {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'deal':
        return 'bg-orange-50';
      case 'cashback':
        return 'bg-green-50';
      case 'withdrawal':
        return 'bg-blue-50';
      case 'referral':
        return 'bg-purple-50';
      case 'support':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed sm:absolute bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden
                       top-16 left-1/2 transform -translate-x-1/2 w-[calc(100vw-2rem)] max-w-sm
                       sm:top-full sm:right-0 sm:left-auto sm:transform-none sm:w-96 sm:mt-2"
            style={{ maxHeight: '70vh' }}
          >
            {/* Desktop Arrow */}
            <div className="hidden sm:block absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <Badge variant="danger" size="sm">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs px-2 py-1"
                    icon={CheckCheck}
                  >
                    <span className="hidden sm:inline">Mark all read</span>
                    <span className="sm:hidden">All</span>
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 120px)' }}>
              {recentNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getNotificationBgColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <p className={`text-sm font-medium leading-tight ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                </p>
                                <Badge variant="secondary" size="sm" className="text-xs">
                                  {notification.type}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <>
                                  <button
                                    onClick={(e) => handleMarkAsRead(notification.id, e)}
                                    className="p-1 rounded-full hover:bg-blue-100 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4 text-blue-600" />
                                  </button>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    You're all caught up! Check back later for new updates.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={Eye}
                    className="text-sm font-medium"
                  >
                    View All Notifications
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};