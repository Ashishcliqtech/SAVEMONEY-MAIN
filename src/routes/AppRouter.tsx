import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '../components/layout';
import { LoadingSpinner } from '../components/ui';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';

// More granular lazy loading for better performance
const Home = lazy(() => import('../pages/Home/Home').then(module => ({ default: module.Home })));
const Login = lazy(() => import('../pages/Auth/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('../pages/Auth/Signup').then(module => ({ default: module.Signup })));
const Stores = lazy(() => import('../pages/Stores/Stores').then(module => ({ default: module.Stores })));
const Categories = lazy(() => import('../pages/Categories/Categories').then(module => ({ default: module.Categories })));
const Offers = lazy(() => import('../pages/Offers/Offers').then(module => ({ default: module.Offers })));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const Wallet = lazy(() => import('../pages/Wallet/Wallet').then(module => ({ default: module.Wallet })));
const Referrals = lazy(() => import('../pages/Referrals/Referrals').then(module => ({ default: module.Referrals })));
const Profile = lazy(() => import('../pages/Profile/Profile').then(module => ({ default: module.Profile })));
const Support = lazy(() => import('../pages/Support/Support').then(module => ({ default: module.Support })));
const HowItWorks = lazy(() => import('../pages/HowItWorks/HowItWorks').then(module => ({ default: module.HowItWorks })));
const Blog = lazy(() => import('../pages/Blog/Blog').then(module => ({ default: module.Blog })));
const Help = lazy(() => import('../pages/Help/Help').then(module => ({ default: module.Help })));
const Notifications = lazy(() => import('../pages/Notifications/Notifications').then(module => ({ default: module.Notifications })));
const CategoryPage = lazy(() => import('../pages/Categories/CategoryPage').then(module => ({ default: module.CategoryPage })));
const StorePage = lazy(() => import('../pages/Stores/StorePage').then(module => ({ default: module.StorePage })));
const StoreOffersPage = lazy(() => import('../pages/Stores/StoreOffersPage').then(module => ({ default: module.StoreOffersPage })));
const AIChatbotPage = lazy(() => import('../pages/Support/AIChatbotPage').then(module => ({ default: module.AIChatbotPage })));


// Granular lazy loading for Admin pages
const AdminDashboard = lazy(() => import('../pages/Admin/Dashboard').then(module => ({ default: module.AdminDashboard })));
const UserManagement = lazy(() => import('../pages/Admin/Users/UserManagement').then(module => ({ default: module.UserManagement })));
const StoreManagement = lazy(() => import('../pages/Admin/Stores/StoreManagement').then(module => ({ default: module.StoreManagement })));
const CategoryManagement = lazy(() => import('../pages/Admin/Categories/CategoryManagement').then(module => ({ default: module.CategoryManagement })));
const OfferManagement = lazy(() => import('../pages/Admin/Offers/OfferManagement').then(module => ({ default: module.OfferManagement })));
const WithdrawalManagement = lazy(() => import('../pages/Admin/Withdrawals/WithdrawalManagement').then(module => ({ default: module.WithdrawalManagement })));
const ContentManagement = lazy(() => import('../pages/Admin/Content/ContentManagement').then(module => ({ default: module.ContentManagement })));
const NotificationManagement = lazy(() => import('../pages/Admin/Notifications/NotificationManagement').then(module => ({ default: module.NotificationManagement })));
const ReportManagement = lazy(() => import('../pages/Admin/Reports/ReportManagement').then(module => ({ default: module.ReportManagement })));
const SupportManagement = lazy(() => import('../pages/Admin/Support/SupportManagement').then(module => ({ default: module.SupportManagement })));
const Analytics = lazy(() => import('../pages/Admin/Analytics/Analytics').then(module => ({ default: module.Analytics })));
const AdminSettings = lazy(() => import('../pages/Admin/Settings/Settings').then(module => ({ default: module.AdminSettings })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const UserProtectedRoute: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <LoadingSpinner size="xl" text="Checking authentication..." fullScreen />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
};

const AdminProtectedRoute: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <LoadingSpinner size="xl" text="Checking authentication..." fullScreen />;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to={ROUTES.LOGIN} replace />;
  return <Outlet />;
};

export const AppRouter: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense 
        fallback={
          <LoadingSpinner 
            key="loading-spinner-app"
            size="xl" 
            text="Loading page..." 
            fullScreen 
            color="text-orange-500"
          />
        }
      >
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />

          <Route element={<Layout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.STORES} element={<Stores />} />
            <Route path={ROUTES.CATEGORIES} element={<Categories />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/stores/:id" element={<StorePage />} />
            <Route path="/stores/:id/offers" element={<StoreOffersPage />} />
            <Route path={ROUTES.OFFERS} element={<Offers />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path={ROUTES.LIVE_CHAT} element={<AIChatbotPage />} />

            <Route element={<UserProtectedRoute />}>
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.WALLET} element={<Wallet />} />
              <Route path={ROUTES.REFERRALS} element={<Referrals />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.SUPPORT} element={<Support />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            <Route element={<AdminProtectedRoute />}>
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
          
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
};
