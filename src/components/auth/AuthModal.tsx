import React, { useReducer } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { OTPForm } from './OTPForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { authReducer, initialState } from './authReducer';
import { AuthMode } from './types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [state, dispatch] = useReducer(authReducer, { ...initialState, mode: initialMode });
  const { login, signup, loginWithGoogle, loginWithFacebook, sendOTP, resetPassword, completeSignupAfterOTP } = useAuth();

  const handleModeChange = (mode: AuthMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  const renderContent = () => {
    switch (state.mode) {
      case 'login':
        return (
          <LoginForm
            onSwitchMode={() => handleModeChange('signup')}
            onForgotPassword={() => handleModeChange('forgot-password')}
            onLogin={login}
            onGoogleLogin={loginWithGoogle}
            onFacebookLogin={loginWithFacebook}
            loading={state.loading}
            error={state.error}
            dispatch={dispatch}
          />
        );
      case 'signup':
        return (
          <SignupForm
            onSwitchMode={() => handleModeChange('login')}
            onSignup={signup}
            onGoogleLogin={loginWithGoogle}
            onFacebookLogin={loginWithFacebook}
            loading={state.loading}
            error={state.error}
            dispatch={dispatch}
          />
        );
      case 'otp':
        return (
          <OTPForm
            email={state.email}
            onVerify={completeSignupAfterOTP}
            onResend={sendOTP}
            loading={state.loading}
            error={state.error}
            dispatch={dispatch}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSwitchMode={() => handleModeChange('login')}
            onResetPassword={resetPassword}
            loading={state.loading}
            error={state.error}
            dispatch={dispatch}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
    </Modal>
  );
};