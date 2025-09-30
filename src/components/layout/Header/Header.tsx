import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, Globe, ShoppingBag, Wallet, CircleUser as UserCircle, LogOut, Settings, Loader, Search, X } from 'lucide-react';
import { Button, SearchBar } from '../../ui';
import { useLanguage } from '../../../hooks';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../constants';

interface HeaderProps {
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  showSidebarToggle = true
}) => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const location = useLocation();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll for elevated header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile search on route change
  useEffect(() => {
    setIsMobileSearchOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile search is open
  useEffect(() => {
    if (isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSearchOpen]);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  const userMenuItems = [
    { href: ROUTES.DASHBOARD, label: t('navigation.dashboard'), icon: UserCircle },
    { href: ROUTES.WALLET, label: t('navigation.wallet'), icon: Wallet },
    { href: ROUTES.REFERRALS, label: t('navigation.referrals'), icon: ShoppingBag },
    { href: ROUTES.PROFILE, label: t('navigation.profile'), icon: Settings },
  ];

  // Pages that should show search bar
  const shouldShowSearch = ['/', '/stores', '/categories', '/offers'].includes(location.pathname);

  return (
    <>
      <header 
        className={`sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b transition-shadow duration-200 ${
          isScrolled ? 'shadow-md border-gray-300' : 'border-gray-200'
        }`}
      >
        <div className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink-0">
              {/* Hamburger Menu */}
              {showSidebarToggle && (
                <button
                  onClick={onSidebarToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 flex-shrink-0 touch-manipulation"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              
              {/* Logo */}
              <Link
                to={ROUTES.HOME}
                className="flex items-center space-x-2 flex-shrink-0 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">
                  SaveMoney
                </span>
              </Link>
            </div>

            {/* Center - Desktop Search Bar */}
            {shouldShowSearch && (
              <div className="hidden lg:flex flex-1 max-w-xl xl:max-w-2xl mx-4 xl:mx-8">
                <SearchBar
                  placeholder={t('home.searchPlaceholder')}
                  onSearch={(_query) => {
                    // Perform search
                  }}
                  className="w-full"
                />
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
              {/* Mobile Search Toggle */}
              {shouldShowSearch && (
                <button
                  onClick={() => setIsMobileSearchOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
              )}

              {/* Language Selector - Hidden on small screens */}
              <div className="relative hidden md:block" ref={languageMenuRef}>
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center space-x-1 px-2 lg:px-3 py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
                  aria-label="Change language"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    {language?.toUpperCase()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                </button>
                
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                    >
                      {['en', 'hi'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            changeLanguage(lang);
                            toggleLanguageMenu();
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                            language === lang 
                              ? 'bg-purple-50 text-purple-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {lang === 'en' ? 'English' : 'हिन्दी'}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu or Auth Buttons */}
              {isLoading ? (
                <div className="flex items-center space-x-2 px-2">
                  <Loader className="w-4 h-4 animate-spin text-orange-500" />
                  <span className="text-sm text-gray-600 hidden sm:inline">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 lg:space-x-3 px-2 lg:px-3 py-1.5 lg:py-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 touch-manipulation"
                    aria-label="User menu"
                  >
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || ''}&background=f97316&color=fff`}
                      alt={user?.name || 'User Avatar'}
                      className="w-8 h-8 lg:w-9 lg:h-9 rounded-full object-cover ring-2 ring-white"
                    />
                    <div className="hidden md:block text-left max-w-[120px] lg:max-w-[150px]">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">Premium</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                  </button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                      >
                        {/* Mobile user info */}
                        <div className="md:hidden px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user?.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>

                        {userMenuItems.map((item) => (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={toggleUserMenu}
                            className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150"
                          >
                            <item.icon className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                        
                        <hr className="my-1 border-gray-100" />
                        
                        <button
                          onClick={() => {
                            toggleUserMenu();
                            logout();
                          }}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-150 w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">{t('navigation.logout')}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link to={ROUTES.LOGIN}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex px-3 lg:px-4 font-medium"
                    >
                      {t('navigation.login')}
                    </Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 font-semibold px-3 sm:px-4 lg:px-5 shadow-sm"
                    >
                      <span className="hidden xs:inline">{t('navigation.signup')}</span>
                      <span className="xs:hidden">Join</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && shouldShowSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-white lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Search Header */}
              <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-200">
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 -ml-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  <SearchBar
                    placeholder={t('home.searchPlaceholder')}
                    onSearch={(_query) => {
                      // Perform search
                      setIsMobileSearchOpen(false);
                    }}
                    className="w-full"
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Search Results/Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-sm text-gray-500 text-center mt-8">
                  Start typing to search...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};