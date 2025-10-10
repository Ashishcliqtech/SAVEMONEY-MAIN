import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Shield, Zap, CheckCircle, LogIn } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth(); 
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-purple-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-32 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-fuchsia-300 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-200 rounded-full blur-3xl"
        />
      </div>

      {loading && (
        <LoadingSpinner 
          key="loading-spinner"
          size="xl" 
          text="Signing you in..." 
          fullScreen 
          color="text-purple-600"
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <Card padding="lg" className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
          {/* Back Button */}
          <Link
            to={ROUTES.HOME}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t('auth.loginTitle')}
              </h1>
              <Sparkles className="w-6 h-6 text-fuchsia-600" />
            </motion.div>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Benefits Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8"
          >
            <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-xl">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm font-medium text-gray-700">Secure</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-fuchsia-50 rounded-xl">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-fuchsia-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm font-medium text-gray-700">Fast</p>
            </div>
            <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-xl">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mx-auto mb-1" />
              <p className="text-xs sm:text-sm font-medium text-gray-700">Easy</p>
            </div>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Input
                label={t('auth.email')}
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
              {emailFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-5 left-0 text-xs text-purple-600 flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Enter your registered email
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-all hover:scale-110"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {passwordFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-5 left-0 text-xs text-purple-600 flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  Enter your password
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between pt-2"
            >
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all cursor-pointer hover:scale-110"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                />
                <span className="ml-2 text-xs sm:text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {t('auth.rememberMe')}
                </span>
              </label>
              <Link
                to={ROUTES.FORGOT_PASSWORD || '#'}
                className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                {t('auth.loginButton')}
              </Button>
            </motion.div>
          </form>

          {/* Quick Login Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl border border-purple-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Welcome Back!</h3>
                <p className="text-xs text-gray-600">
                  Log in to access your dashboard, track your progress, and manage your account.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 text-center"
          >
            <p className="text-sm sm:text-base text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to={ROUTES.SIGNUP}
                className="text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2 transition-colors"
              >
                {t('auth.createAccount')}
              </Link>
            </p>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Your data is protected with 256-bit SSL encryption</span>
            </div>
          </motion.div>
        </Card>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center space-y-3"
        >
          <p className="text-xs text-gray-500">
            Trusted by thousands of users worldwide
          </p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs">Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="text-xs">Fast</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">Reliable</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};