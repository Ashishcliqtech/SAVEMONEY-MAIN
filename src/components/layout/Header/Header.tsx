import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Wallet, User, LogOut, X, Currency } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { walletApi } from '../../../api';
import { Wallet as WalletType } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui';
import { ROUTES } from '../../../constants';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [walletData, setWalletData] = useState<WalletType | null>(null);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWalletData = async () => {
      if (isAuthenticated) {
        setIsWalletLoading(true);
        try {
          const data = await walletApi.getWalletDetails();
          setWalletData(data);
        } catch (error) {
          console.error('Failed to fetch wallet data for header:', error);
        } finally {
          setIsWalletLoading(false);
        }
      } else {
        setWalletData(null);
      }
    };
    fetchWalletData();
  }, [isAuthenticated]);

  const formatBalance = () => {
    if (isWalletLoading) {
      return <span className="h-4 w-12 bg-gray-200 rounded animate-pulse inline-block"></span>;
    }
    if (walletData?.availableCashback != null) {
      return `₹${walletData.availableCashback.toLocaleString()}`;
    }
    return '₹0';
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileMenuVariants = {
    open: { opacity: 1, y: 0, transition: { ease: "easeOut" } },
    closed: { opacity: 0, y: "-100%", transition: { ease: "easeIn" } },
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <button
              onClick={onSidebarToggle}
              className={`-ml-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to={ROUTES.HOME} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Currency className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-xl font-bold text-gray-900">SaveMoney</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="border border-gray-200 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">
                      {formatBalance()}
                    </span>
                  </div>

                  <button onClick={() => navigate(ROUTES.PROFILE)} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <img
                      className="h-9 w-9 rounded-full object-cover"
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`}
                      alt={user?.name}
                    />
                  </button>

                  <button onClick={logout} className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100" aria-label="Logout">
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="outline" size="sm">Login</Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP}>
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:hidden flex items-center space-x-2">
              <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100" onClick={() => setIsMobileSearchOpen(prev => !prev)}>
                {isMobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </button>
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.WALLET} className="flex items-center space-x-1 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                    <Wallet className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-semibold text-gray-800">
                      {formatBalance()}
                    </span>
                  </Link>

                  <button onClick={() => navigate(ROUTES.PROFILE)} className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=f97316&color=fff`}
                      alt={user?.name}
                    />
                  </button>

                  <button onClick={logout} className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100" aria-label="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Link to={ROUTES.LOGIN}>
                    <Button variant="outline" size="sm" className="px-3">Login</Button>
                  </Link>
                  <Link to={ROUTES.SIGNUP}>
                    <Button variant="primary" size="sm" className="px-3">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg p-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};