import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Gift, CheckCircle, XCircle, Sparkles, Shield, Zap } from 'lucide-react';
import { Button, Input, Card, LoadingSpinner } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';

export const Signup: React.FC = () => {
  const { t } = useTranslation();
  const { signup, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    referredByCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  // Password strength calculator
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (password.length >= 12) strength++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[^a-zA-Z0-9]/.test(password)) strength++;
      return strength;
    };
    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!formData.acceptTerms) {
      toast.error('You must accept the terms and conditions');
      return;
    }
    if (passwordStrength < 3) {
      toast.error('Please use a stronger password');
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        referredByCode: formData.referredByCode,
      });
      setShowOtp(true);
      setResendTimer(60);
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ email: formData.email, otp });
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // The API client's error interceptor will handle the toast notification.
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        referredByCode: formData.referredByCode,
      });
      setResendTimer(60);
      toast.success('OTP resent successfully');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Good';
    return 'Strong';
  };

  if (showOtp) {
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
            className="absolute -top-24 -right-24 w-96 h-96 bg-purple-300 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-fuchsia-300 rounded-full blur-3xl"
          />
        </div>

        {loading && (
          <LoadingSpinner
            key="loading-spinner-otp"
            size="xl"
            text="Verifying OTP..."
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
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Mail className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Verify Your Email
              </h2>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm sm:text-base font-semibold text-purple-600 mt-1 break-all px-2">
                {formData.email}
              </p>
            </div>

            <div className="mb-8">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="w-1 sm:w-2 md:w-3"></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '100%',
                  height: '3rem',
                  fontSize: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                containerStyle="flex justify-center gap-1 sm:gap-2 md:gap-3"
                inputType="tel"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleOtpSubmit}
              loading={loading}
              disabled={otp.length !== 6 || loading}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 font-bold mb-4 shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Verify & Create Account
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className={`text-sm font-medium ${
                  resendTimer > 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-purple-600 hover:text-purple-700'
                } transition-colors`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <button
              onClick={() => setShowOtp(false)}
              className="mt-6 w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Change email address
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

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
      </div>

      {loading && (
        <LoadingSpinner
          key="loading-spinner-signup"
          size="xl"
          text="Creating your account..."
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
          <Link
            to={ROUTES.HOME}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {t('auth.signupTitle')}
              </h1>
              <Sparkles className="w-6 h-6 text-fuchsia-600" />
            </motion.div>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              {t('auth.signupSubtitle')}
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
              <p className="text-xs sm:text-sm font-medium text-gray-700">Trusted</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Input
                label={t('auth.name')}
                type="text"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Input
                label={t('auth.email')}
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Input
                label={t('auth.phone')}
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="relative"
            >
              <Input
                label={t('auth.password')}
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              {/* Password Strength Indicator */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 8+ characters with uppercase, lowercase, numbers & symbols
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Input
                label={t('auth.confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-4 top-[38px] -translate-y-full -mt-12"
                >
                  {formData.password === formData.confirmPassword ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="relative"
            >
              <Input
                label="Referral Code (Optional)"
                type="text"
                icon={Gift}
                value={formData.referredByCode}
                onChange={(e) => setFormData({ ...formData, referredByCode: e.target.value })}
                className="transition-all duration-200 focus-within:scale-[1.01]"
              />
              {formData.referredByCode && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-xs text-purple-600 flex items-center gap-1"
                >
                  <Gift className="w-3 h-3" />
                  You'll receive bonus rewards!
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start"
            >
              <input
                id="acceptTerms"
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1 cursor-pointer transition-all hover:scale-110"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-xs sm:text-sm text-gray-600 cursor-pointer">
                I agree to the{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2">
                  Privacy Policy
                </Link>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!formData.acceptTerms || loading}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-lg"
              >
                {t('auth.signupButton')}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm sm:text-base text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-purple-600 hover:text-purple-700 font-semibold underline underline-offset-2 transition-colors"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </motion.div>
        </Card>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500 mb-2">Trusted by thousands of users worldwide</p>
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <Shield className="w-5 h-5" />
            <span className="text-xs">256-bit SSL Secure</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};