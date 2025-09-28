import { AuthMode, SignupData } from './types';

export interface AuthState {
  mode: AuthMode;
  loading: boolean;
  error: string | null;
  email: string;
  signupData: SignupData | null;
}

export const initialState: AuthState = {
  mode: 'login',
  loading: false,
  error: null,
  email: '',
  signupData: null,
};

export type AuthAction = 
  | { type: 'SET_MODE', payload: AuthMode }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'SET_EMAIL', payload: string }
  | { type: 'SET_SIGNUP_DATA', payload: SignupData | null };

export type AuthDispatch = React.Dispatch<AuthAction>;

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_EMAIL':
        return { ...state, email: action.payload };
    case 'SET_SIGNUP_DATA':
        return { ...state, signupData: action.payload };
    default:
      return state;
  }
};