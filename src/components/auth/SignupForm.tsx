import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Chrome, Facebook } from 'lucide-react';
import { Button, Input } from '../ui';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthDispatch } from './authReducer';
import { SignupData } from './types';

interface SignupFormProps {
  onSwitchMode: () => void;
  onSignup: (data: SignupData) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  onFacebookLogin: () => Promise<void>;
  loading: boolean;
  error: string | null;
  dispatch: AuthDispatch;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchMode,
  onSignup,
  onGoogleLogin,
  onFacebookLogin,
  loading,
  error,
  dispatch,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik<SignupData>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        dispatch({ type: 'SET_EMAIL', payload: values.email });
        try {
            await onSignup(values);
            dispatch({ type: 'SET_MODE', payload: 'otp' });
        } catch (err: unknown) {
            if (err instanceof Error) {
                dispatch({ type: 'SET_ERROR', payload: err.message || 'Signup failed' });
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join SaveMoney</h2>
        <p className="text-gray-600">Create your account and start earning cashback</p>
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
          className="border-2 hover:border-blue-500 hover:text-blue-600"
        >
          Sign up with Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          icon={Facebook}
          onClick={onFacebookLogin}
          loading={loading}
          className="border-2 hover:border-blue-600 hover:text-blue-600"
        >
          Sign up with Facebook
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">Or sign up with email</span>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          placeholder="Enter your full name"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && formik.errors.name}
        />
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="Enter your email"
          {...formik.getFieldProps('email')}
          error={formik.touched.email && formik.errors.email}
        />
        <Input
          label="Phone Number"
          type="tel"
          icon={Phone}
          placeholder="+91 9876543210"
          {...formik.getFieldProps('phone')}
          error={formik.touched.phone && formik.errors.phone}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Create a strong password"
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

        <Input
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="Confirm your password"
          {...formik.getFieldProps('confirmPassword')}
          error={formik.touched.confirmPassword && formik.errors.confirmPassword}
        />

        <div className="flex items-start">
            <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 mt-1"
                {...formik.getFieldProps('acceptTerms')}
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
        {formik.touched.acceptTerms && formik.errors.acceptTerms && <p className="text-red-500 text-sm">{formik.errors.acceptTerms}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={loading || !formik.values.acceptTerms}
          className="bg-orange-500 hover:bg-orange-600 font-bold"
        >
          Create Account
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchMode}
            className="text-orange-600 hover:text-orange-500 font-semibold"
          >
            Sign In
          </button>
        </p>
      </div>
    </motion.div>
  );
};