import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Chrome, Facebook } from 'lucide-react';
import { Button, Input, Modal } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot-password'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const { login, signup, loginWithGoogle, loginWithFacebook, verifyOTP, sendOTP, resetPassword } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      onClose();
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signup(signupData);
      setTempEmail(signupData.email);
      await sendOTP(signupData.email, signupData.name);
      setMode('otp');
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    try {
      await verifyOTP(tempEmail, otp);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else {
        await loginWithFacebook();
      }
      onClose();
    } catch (error: any) {
      // Error is already handled in the auth hook
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await resetPassword(tempEmail);
      setMode('login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      await sendOTP(tempEmail);
      toast.success('OTP resent successfully');
    } catch (error: any) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        {/* Login Mode */}
        {mode === 'login' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Sign in to your account to continue saving</p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={Chrome}
                onClick={() => handleSocialLogin('google')}
                loading={loading}
                disabled={loading}
                className="border-2 hover:border-blue-500 hover:text-blue-600"
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={Facebook}
                onClick={() => handleSocialLogin('facebook')}
                loading={loading}
                disabled={loading}
                className="border-2 hover:border-blue-600 hover:text-blue-600"
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
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
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
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-orange-500 hover:bg-orange-600 font-bold"
              >
                Sign In
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-orange-600 hover:text-orange-500 font-semibold"
                >
                  Create Account
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Signup Mode */}
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join SaveMoney</h2>
              <p className="text-gray-600">Create your account and start earning cashback</p>
            </div>

            {/* Social Signup */}
            <div className="space-y-3 mb-6">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={Chrome}
                onClick={() => handleSocialLogin('google')}
                loading={loading}
                className="border-2 hover:border-blue-500 hover:text-blue-600"
              >
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                icon={Facebook}
                onClick={() => handleSocialLogin('facebook')}
                loading={loading}
                className="border-2 hover:border-blue-600 hover:text-blue-600"
              >
                Sign up with Facebook
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with email</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                icon={User}
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                placeholder="+91 9876543210"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="Create a strong password"
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

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                required
              />

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                  checked={signupData.acceptTerms}
                  onChange={(e) => setSignupData({ ...signupData, acceptTerms: e.target.checked })}
                  required
                />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-500 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-500 font-medium">
                    Privacy Policy
                  </a>
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading || !signupData.acceptTerms}
                className="bg-orange-500 hover:bg-orange-600 font-bold"
              >
                Create Account
              </Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-orange-600 hover:text-orange-500 font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* OTP Verification Mode */}
        {mode === 'otp' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to <strong>{tempEmail}</strong>
              </p>
            </div>

            <div className="mb-6">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                separator={<span className="mx-2"></span>}
                inputStyle={{
                  width: '3rem',
                  height: '3rem',
                  margin: '0 0.25rem',
                  fontSize: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #e5e7eb',
                  textAlign: 'center',
                  outline: 'none',
                }}
                focusStyle={{
                  border: '2px solid #f97316',
                  boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)',
                }}
                isInputNum
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleOTPVerification}
              loading={loading}
              disabled={otp.length !== 6}
              className="bg-orange-500 hover:bg-orange-600 font-bold mb-4"
            >
              Verify Email
            </Button>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={resendOTP}
                loading={loading}
                disabled={loading}
              >
                Resend Code
              </Button>
            </div>
          </motion.div>
        )}

        {/* Forgot Password Mode */}
        {mode === 'forgot-password' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600">Enter your email to receive a reset link</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="bg-orange-500 hover:bg-orange-600 font-bold"
              >
                Send Reset Link
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setMode('login')}
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};