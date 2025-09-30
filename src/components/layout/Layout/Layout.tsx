import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  const shouldShowFooter = [
    '/',
    '/stores',
    '/categories',
    '/offers',
    '/how-it-works',
    '/blog',
    '/help',
    '/dashboard',
    '/wallet',
    '/referrals',
    '/profile',
    '/notifications',
    '/support',
  ].includes(location.pathname);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className="flex flex-col min-h-screen flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen && !isMobile ? '280px' : '0px',
        }}
      >
        <Header
          onSidebarToggle={toggleSidebar}
          showSidebarToggle={!isSidebarOpen || isMobile}
        />
        <main className="flex-1 overflow-x-hidden w-full">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
        {shouldShowFooter && <Footer />}
      </div>
    </div>
  );
};
