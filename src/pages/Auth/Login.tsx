import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Facebook, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth(); 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password); 
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {loading && (
        <LoadingSpinner 
          key="loading-spinner"
          size="xl" 
          text="Signing you in..." 
          fullScreen 
          color="text-orange-500"
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card padding="lg">
          {/* Back Button */}
          <Link to={ROUTES.HOME} className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-gray-600">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon={Chrome}
              onClick={() => loginWithGoogle()}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon={Facebook}
              onClick={() => loginWithFacebook()}
            >
              Continue with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.email')}
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span className="ml-2 text-sm text-gray-600">
                  {t('auth.rememberMe')}
                </span>
              </label>
              <Link
                to="#"
                className="text-sm text-purple-600 hover:text-purple-500"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {t('auth.loginButton')}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="text-purple-600 hover:text-purple-500 font-medium"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};