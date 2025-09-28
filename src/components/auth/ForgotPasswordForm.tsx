import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button, Input } from '../ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthDispatch } from './authReducer';

interface ForgotPasswordFormProps {
  onSwitchMode: () => void;
  onResetPassword: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  dispatch: AuthDispatch;
}

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchMode,
  onResetPassword,
  loading,
  error,
  dispatch,
}) => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        await onResetPassword(values.email);
        dispatch({ type: 'SET_MODE', payload: 'login' });
      } catch (err: unknown) {
        if (err instanceof Error) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to send reset email' });
        } else {
            dispatch({ type: 'SET_ERROR', payload: 'An unknown error occurred' });
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to receive a reset link</p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter your email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
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
          onClick={onSwitchMode}
          className="text-orange-600 hover:text-orange-500 font-medium"
        >
          Back to Sign In
        </button>
      </div>
    </motion.div>
  );
};