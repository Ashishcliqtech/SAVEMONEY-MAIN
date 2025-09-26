import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
        details: error.details,
      });
    }
    
    next();
  };
};

// Validation schemas
export const authSchemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/).optional(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      }),
    referralCode: Joi.string().optional(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  sendOTP: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(50).required(),
    signupData: Joi.object().optional(),
  }),

  verifyOTP: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^\d+$/).required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .required(),
  }),
};

export const userSchemas = {
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]{10,}$/).optional(),
    avatar_url: Joi.string().uri().optional(),
  }),
};

export const walletSchemas = {
  withdraw: Joi.object({
    amount: Joi.number().min(10).max(100000).required(),
    method: Joi.string().valid('upi', 'bank', 'paytm', 'voucher').required(),
    accountDetails: Joi.object().required(),
  }),
};

export const storeSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    logo_url: Joi.string().uri().optional(),
    banner_url: Joi.string().uri().optional(),
    website_url: Joi.string().uri().optional(),
    cashback_rate: Joi.number().min(0).max(100).required(),
    category_id: Joi.string().uuid().optional(),
    is_popular: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    commission_rate: Joi.number().min(0).max(100).optional(),
    tracking_url: Joi.string().uri().optional(),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    slug: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(500).optional(),
    logo_url: Joi.string().uri().optional(),
    banner_url: Joi.string().uri().optional(),
    website_url: Joi.string().uri().optional(),
    cashback_rate: Joi.number().min(0).max(100).optional(),
    category_id: Joi.string().uuid().optional(),
    is_popular: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
    is_active: Joi.boolean().optional(),
    commission_rate: Joi.number().min(0).max(100).optional(),
    tracking_url: Joi.string().uri().optional(),
  }),
};

export const offerSchemas = {
  create: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().max(1000).optional(),
    store_id: Joi.string().uuid().required(),
    category_id: Joi.string().uuid().optional(),
    cashback_rate: Joi.number().min(0).max(100).required(),
    original_price: Joi.number().min(0).optional(),
    discounted_price: Joi.number().min(0).optional(),
    coupon_code: Joi.string().max(50).optional(),
    offer_type: Joi.string().valid('cashback', 'coupon', 'deal').required(),
    image_url: Joi.string().uri().optional(),
    terms: Joi.array().items(Joi.string()).optional(),
    min_order_value: Joi.number().min(0).optional(),
    expiry_date: Joi.date().optional(),
    is_exclusive: Joi.boolean().optional(),
    is_trending: Joi.boolean().optional(),
    is_featured: Joi.boolean().optional(),
  }),
};

export const supportSchemas = {
  createTicket: Joi.object({
    subject: Joi.string().min(5).max(200).required(),
    message: Joi.string().min(10).max(2000).required(),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent').required(),
    category: Joi.string().valid('cashback', 'withdrawal', 'account', 'technical', 'general').required(),
    attachments: Joi.array().items(Joi.string().uri()).optional(),
  }),

  addResponse: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
    attachments: Joi.array().items(Joi.string().uri()).optional(),
  }),
};