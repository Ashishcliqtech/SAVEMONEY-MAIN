import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';
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
  });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

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
    setLoading(true);
    try {
      await signup({ 
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
       });
      setShowOtp(true);
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

  if (showOtp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {loading && (
          <LoadingSpinner 
            key="loading-spinner-otp"
            size="xl" 
            text="Verifying OTP..." 
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to <strong>{formData.email}</strong>
              </p>
            </div>

            <div className="mb-6 flex justify-center">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span className="mx-1 sm:mx-2"></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '3rem',
                  height: '3rem',
                  fontSize: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center',
                  outline: 'none',
                }}
                containerStyle="justify-center"
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleOtpSubmit}
              loading={loading}
              disabled={otp.length !== 6 || loading}
              className="bg-orange-500 hover:bg-orange-600 font-bold mb-4"
            >
              Verify & Create Account
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {loading && (
        <LoadingSpinner 
          key="loading-spinner-signup"
          size="xl" 
          text="Creating your account..." 
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
          <Link to={ROUTES.HOME} className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.signupTitle')}</h1>
            <p className="text-gray-600">{t('auth.signupSubtitle')}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.name')}
              type="text"
              icon={User}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label={t('auth.email')}
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label={t('auth.phone')}
              type="tel"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            <div className="relative">
              <Input
                label={t('auth.confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-purple-600 hover:text-purple-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={!formData.acceptTerms || loading}
            >
              {t('auth.signupButton')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to={ROUTES.LOGIN} className="text-purple-600 hover:text-purple-500 font-medium">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};