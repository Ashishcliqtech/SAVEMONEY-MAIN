import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Store, Grid3x3 as Grid3X3, Tag, Wallet, Users, User, HelpCircle, BookOpen, Settings, ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Gift, MessageCircle, Bell, X, BarChart3, Globe } from 'lucide-react';
import { ROUTES } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const navigationItems = [
    {
      section: 'Browse',
      items: [
        { href: ROUTES.HOME, label: 'Home', icon: Home },
        { href: ROUTES.STORES, label: t('navigation.stores'), icon: Store },
        { href: ROUTES.CATEGORIES, label: t('navigation.categories'), icon: Grid3X3 },
        { href: ROUTES.OFFERS, label: t('navigation.offers'), icon: Tag },
      ]
    },
    {
      section: 'Account',
      items: [
        { href: ROUTES.DASHBOARD, label: t('navigation.dashboard'), icon: TrendingUp },
        { href: ROUTES.WALLET, label: t('navigation.wallet'), icon: Wallet },
        { href: ROUTES.REFERRALS, label: t('navigation.referrals'), icon: Users },
        { href: '/notifications', label: 'Notifications', icon: Bell },
        { href: ROUTES.PROFILE, label: t('navigation.profile'), icon: User },
      ]
    },
    {
      section: 'Support',
      items: [
        { href: ROUTES.SUPPORT, label: 'Support', icon: Settings },
        { href: '/help', label: 'Help', icon: MessageCircle },
        { href: '/how-it-works', label: 'How It Works', icon: BookOpen },
      ]
    },
    ...(isAdmin ? [{
      section: 'Admin',
      items: [
        { href: '/admin', label: 'Admin Dashboard', icon: Settings },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/stores', label: 'Stores', icon: Store },
        { href: '/admin/categories', label: 'Categories', icon: Grid3X3 },
        { href: '/admin/offers', label: 'Offers', icon: Tag },
        { href: '/admin/content', label: 'Content Management', icon: Globe },
        { href: '/admin/notifications', label: 'Notifications', icon: Bell },
        { href: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
        { href: '/admin/support', label: 'Support Tickets', icon: MessageCircle },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
        { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    }] : []),
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      x: '-100%',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    closed: {
      opacity: isMobile ? 0 : 1,
      x: isMobile ? -20 : 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 shadow-lg"
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SaveMoney</span>
            </motion.div>
            
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigationItems.map((section) => (
              <div key={section.section} className="mb-6">
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  className="px-4 mb-2"
                >
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.section}
                  </h3>
                </motion.div>
                
                <div className="space-y-1 px-2">
                  {section.items.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={isMobile ? onToggle : undefined}
                        className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
                          }`}
                        />
                        <motion.span
                          variants={contentVariants}
                          initial="closed"
                          animate="open"
                          className="ml-3 font-medium"
                        >
                          {item.label}
                        </motion.span>
                        
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 bg-purple-600 rounded-full"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  className="flex-1 min-w-0"
                >
                  <div className="font-medium text-gray-900 truncate">{user?.name}</div>
                  <div className="text-sm text-gray-500 truncate">{user?.email}</div>
                  {user.role === 'admin' && (
                    <div className="text-xs text-orange-600 font-semibold">Admin</div>
                  )}
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  className="flex-1 min-w-0"
                >
                  <div className="font-medium text-gray-900">Guest User</div>
                  <div className="text-sm text-gray-500">Not logged in</div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};