import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, Wallet, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useWallet } from '../../../hooks/useSupabase';
import { motion } from 'framer-motion';

interface HeaderProps {
  onSidebarToggle: () => void;
  showSidebarToggle: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSidebarToggle, showSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { data: wallet, isLoading } = useWallet(user?.id);

  const formatBalance = () => {
    if (isLoading) {
      return <span className="h-4 w-16 bg-gray-200 rounded animate-pulse"></span>;
    }
    if (wallet?.balance != null) {
      return `₹${wallet.balance.toLocaleString()}`;
    }
    return 'N/A';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onSidebarToggle}
              className={`${showSidebarToggle ? 'block' : 'hidden'} -ml-2 mr-2 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex items-center space-x-2">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="border-none focus:ring-0 p-0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
              <Wallet className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">
                {formatBalance()}
              </span>
            </div>

            <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </button>

            {user && (
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`}
                    alt={user.name}
                  />
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 group-hover:opacity-100 group-hover:block hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2 inline"/>
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2 inline" />
                    Logout
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
