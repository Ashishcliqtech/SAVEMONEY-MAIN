import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { Home } from '../pages/Home';
import { Login, Signup } from '../pages/Auth';
import { Stores } from '../pages/Stores';
import { Categories } from '../pages/Categories';
import { Offers } from '../pages/Offers';
import { Dashboard } from '../pages/Dashboard';
import { Wallet } from '../pages/Wallet';
import { Referrals } from '../pages/Referrals';
import { Profile } from '../pages/Profile';
import { Support } from '../pages/Support';
import { HowItWorks } from '../pages/HowItWorks';
import { Blog } from '../pages/Blog';
import { Help } from '../pages/Help';
import { Notifications } from '../pages/Notifications';
import { ROUTES } from '../constants';
import { 
  AdminDashboard, 
  UserManagement, 
  StoreManagement, 
  CategoryManagement,
  OfferManagement, 
  WithdrawalManagement, 
  ContentManagement,
  NotificationManagement,
  ReportManagement,
  SupportManagement,
  Analytics, 
  Settings as AdminSettings 
} from '../pages/Admin';
import { useAuth } from '../hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// A component to protect routes that require admin privileges
const ProtectedRoute: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingSpinner size="xl" text="Checking authentication..." fullScreen />;
  }

  // If user is authenticated and is an admin, allow access. Otherwise, redirect.
  if (!isAuthenticated) {
     return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (user?.role !== 'admin') {
     return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return <Outlet />;
};

export const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <React.Suspense 
          fallback={
            <LoadingSpinner 
              size="xl" 
              text="Loading page..." 
              fullScreen 
              color="text-orange-500"
            />
          }
        >
          <Routes>
            {/* Auth Routes (without layout) */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />

            {/* Main App Routes (with layout) */}
            <Route element={<Layout />}>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.STORES} element={<Stores />} />
              <Route path={ROUTES.CATEGORIES} element={<Categories />} />
              <Route path={ROUTES.OFFERS} element={<Offers />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<Help />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.WALLET} element={<Wallet />} />
              <Route path={ROUTES.REFERRALS} element={<Referrals />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.SUPPORT} element={<Support />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Admin Routes (with layout and protection) */}
            <Route element={<ProtectedRoute />}>
               <Route element={<Layout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/stores" element={<StoreManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/offers" element={<OfferManagement />} />
                <Route path="/admin/withdrawals" element={<WithdrawalManagement />} />
                <Route path="/admin/content" element={<ContentManagement />} />
                <Route path="/admin/notifications" element={<NotificationManagement />} />
                <Route path="/admin/reports" element={<ReportManagement />} />
                <Route path="/admin/support" element={<SupportManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </QueryClientProvider>
  );
};

