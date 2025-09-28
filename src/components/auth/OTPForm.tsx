import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '../ui';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';
import { AuthDispatch } from './authReducer';

interface OTPFormProps {
  email: string;
  onVerify: (email: string, otp: string) => Promise<void>;
  onResend: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  dispatch: AuthDispatch;
}

export const OTPForm: React.FC<OTPFormProps> = ({
  email,
  onVerify,
  onResend,
  loading,
  error,
  dispatch,
}) => {
  const [otp, setOtp] = useState('');

  const handleVerification = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await onVerify(email, otp);
    } catch (err: unknown) {
        if (err instanceof Error) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'OTP verification failed' });
        } else {
            dispatch({ type: 'SET_ERROR', payload: 'An unknown error occurred' });
        }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleResend = async () => {
    try {
      await onResend(email);
      toast.success('OTP resent successfully');
    } catch (err: unknown) {
        if (err instanceof Error) {
            toast.error(`Failed to resend OTP: ${err.message}`);
        } else {
            toast.error('Failed to resend OTP');
        }
    }
  };

  return (
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
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-6">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="mx-2"></span>}
          renderInput={(props) => <input {...props} />}
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
        />
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleVerification}
        loading={loading}
        disabled={otp.length !== 6}
        className="bg-orange-500 hover:bg-orange-600 font-bold mb-4"
      >
        Verify Email
      </Button>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
        <Button variant="ghost" size="sm" onClick={handleResend} loading={loading} disabled={loading}>
          Resend Code
        </Button>
      </div>
    </motion.div>
  );
};