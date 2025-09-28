export type AuthMode = 'login' | 'signup' | 'otp' | 'forgot-password';

export interface SignupData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}