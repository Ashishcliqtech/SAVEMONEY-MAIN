import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Chrome, Facebook } from 'lucide-react';
import { Button, Input } from '../ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthDispatch } from './authReducer';

interface LoginFormProps {
  onSwitchMode: () => void;
  onForgotPassword: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
  dispatch: AuthDispatch;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchMode,
  onForgotPassword,
  onLogin,
  onGoogleLogin,
  onFacebookLogin,
  loading,
  error,
  dispatch,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        await onLogin(values.email, values.password);
      } catch (err: unknown) {
        if (err instanceof Error) {
            dispatch({ type: 'SET_ERROR', payload: err.message || 'Login failed' });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">Sign in to your account to continue saving</p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          icon={Chrome}
          onClick={onGoogleLogin}
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
          onClick={onFacebookLogin}
          loading={loading}
          disabled={loading}
          className="border-2 hover:border-blue-600 hover:text-blue-600"
        >
          Continue with Facebook
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter your email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Enter your password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && formik.errors.password}
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
              {...formik.getFieldProps('rememberMe')}
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
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
            onClick={onSwitchMode}
            className="text-orange-600 hover:text-orange-500 font-semibold"
          >
            Create Account
          </button>
        </p>
      </div>
    </motion.div>
  );
};