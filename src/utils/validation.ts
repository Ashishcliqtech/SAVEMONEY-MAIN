// Validation utilities for production-ready forms

export const ValidationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
    }
  },
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters long'
    },
    pattern: {
      value: /^[a-zA-Z\s]+$/,
      message: 'Name can only contain letters and spaces'
    }
  },
  phone: {
    pattern: {
      value: /^\+?[\d\s-()]{10,}$/,
      message: 'Please enter a valid phone number'
    }
  },
  otp: {
    required: 'OTP is required',
    pattern: {
      value: /^\d{6}$/,
      message: 'OTP must be exactly 6 digits'
    }
  }
};

export const validateEmail = (email: string): string | null => {
  if (!email) return ValidationRules.email.required;
  if (!ValidationRules.email.pattern.value.test(email)) {
    return ValidationRules.email.pattern.message;
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return ValidationRules.password.required;
  if (password.length < ValidationRules.password.minLength.value) {
    return ValidationRules.password.minLength.message;
  }
  if (!ValidationRules.password.pattern.value.test(password)) {
    return ValidationRules.password.pattern.message;
  }
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return ValidationRules.name.required;
  if (name.length < ValidationRules.name.minLength.value) {
    return ValidationRules.name.minLength.message;
  }
  if (!ValidationRules.name.pattern.value.test(name)) {
    return ValidationRules.name.pattern.message;
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (phone && !ValidationRules.phone.pattern.value.test(phone)) {
    return ValidationRules.phone.pattern.message;
  }
  return null;
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) return ValidationRules.otp.required;
  if (!ValidationRules.otp.pattern.value.test(otp)) {
    return ValidationRules.otp.pattern.message;
  }
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Add +91 if it's a 10-digit Indian number
  if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    return `+91${cleaned}`;
  }
  
  return cleaned;
};