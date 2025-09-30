import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Store, Grid3x3, Tag, Wallet, Users, User, HelpCircle, 
  BookOpen, Settings, ShoppingBag, TrendingUp, MessageCircle, 
  Bell, X, BarChart3, Globe, ChevronDown, ChevronRight 
} from 'lucide-react';
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
  
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Browse']));
  const [touchStart, setTouchStart] = useState<number | null>(null);
  
  // Check if the current user is an admin
  const isAdmin = user?.role === 'admin';

  const navigationItems = [
    {
      section: 'Browse',
      items: [
        { href: ROUTES.HOME, label: 'Home', icon: Home },
        { href: ROUTES.STORES, label: t('navigation.stores'), icon: Store },
        { href: ROUTES.CATEGORIES, label: t('navigation.categories'), icon: Grid3x3 },
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
        { href: ROUTES.SUPPORT, label: 'Support', icon: HelpCircle },
        { href: '/help', label: 'Help Center', icon: MessageCircle },
        { href: '/how-it-works', label: 'How It Works', icon: BookOpen },
      ]
    },
    // Conditionally render the 'Admin' section based on user role
    ...(isAdmin ? [{
      section: 'Admin',
      collapsible: true,
      items: [
        { href: '/admin', label: 'Admin Dashboard', icon: Settings },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/stores', label: 'Stores', icon: Store },
        { href: '/admin/categories', label: 'Categories', icon: Grid3x3 },
        { href: '/admin/offers', label: 'Offers', icon: Tag },
        { href: '/admin/content', label: 'Content', icon: Globe },
        { href: '/admin/notifications', label: 'Notifications', icon: Bell },
        { href: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
        { href: '/admin/support', label: 'Support Tickets', icon: MessageCircle },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
        { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    }] : []),
  ];

  const isActiveRoute = (href: string) => location.pathname === href;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Handle touch gestures for mobile swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !isMobile) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe left to close
    if (diff > 50) {
      onToggle();
      setTouchStart(null);
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const sidebarVariants = {
    open: { 
      x: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: '-100%', 
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 shadow-xl ${
          isMobile ? 'w-[280px] xs:w-[320px]' : 'w-[280px]'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <Link 
              to={ROUTES.HOME} 
              className="flex items-center space-x-2 group"
              onClick={isMobile ? onToggle : undefined}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SaveMoney</span>
            </Link>
            {isMobile && (
              <button 
                onClick={onToggle} 
                className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {navigationItems.map((section) => {
              const isExpanded = expandedSections.has(section.section);
              const hasCollapsible = section.collapsible && section.items.length > 5;
              
              return (
                <div key={section.section} className="mb-6 last:mb-0">
                  {/* Section Header */}
                  <div className="px-4 mb-2">
                    {hasCollapsible ? (
                      <button
                        onClick={() => toggleSection(section.section)}
                        className="flex items-center justify-between w-full text-left group"
                      >
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {section.section}
                        </h3>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                    ) : (
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {section.section}
                      </h3>
                    )}
                  </div>

                  {/* Section Items */}
                  <AnimatePresence initial={false}>
                    {(!hasCollapsible || isExpanded) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-1 px-2 overflow-hidden"
                      >
                        {section.items.map((item) => {
                          const isActive = isActiveRoute(item.href);
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={isMobile ? onToggle : undefined}
                              className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 group touch-manipulation ${
                                isActive
                                  ? 'bg-purple-50 text-purple-700 shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                              }`}
                            >
                              <item.icon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive 
                                    ? 'text-purple-600' 
                                    : 'text-gray-400 group-hover:text-gray-600'
                                }`}
                              />
                              <span className="ml-3 font-medium text-sm">
                                {item.label}
                              </span>
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600"
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          {user && (
            <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-gray-50">
              <Link 
                to={ROUTES.PROFILE}
                onClick={isMobile ? onToggle : undefined}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white active:bg-gray-100 transition-colors touch-manipulation group"
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white group-hover:ring-purple-200 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  {user.role === 'admin' && (
                    <div className="text-xs text-orange-600 font-semibold mt-0.5">
                      Admin
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
              </Link>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};