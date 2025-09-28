import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from '../Sidebar';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Auth pages that don't use the layout at all
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  // Pages that should show footer
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

      // On desktop, keep sidebar open by default for better UX
      // On mobile, always start closed to save space
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

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Don't show layout for auth pages
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always available */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div
        className="flex flex-col min-h-screen flex-1 transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarOpen && !isMobile ? '280px' : '0px',
        }}
      >
        {/* Header - Always show hamburger */}
        <Header
          onSidebarToggle={toggleSidebar}
          showSidebarToggle={true} // Always show hamburger
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden w-full">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>

        {/* Footer - Only on specific pages */}
        {shouldShowFooter && <Footer />}
      </div>
    </div>
  );
};