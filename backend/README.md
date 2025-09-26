# SaveMoney Backend API

A comprehensive Node.js backend service for the SaveMoney cashback platform, built with Express, TypeScript, Supabase, Redis, and Brevo email service.

## 🚀 Features

### 🔐 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Email OTP verification for signup
- Password reset functionality
- Rate limiting and security headers
- Role-based access control (User, Admin, Moderator)

### 💰 **Core Platform Features**
- User management and profiles
- Store and offer management
- Cashback tracking and calculations
- Wallet and withdrawal processing
- Referral system with bonus tracking
- Notification system
- Support ticket management

### 📧 **Email Integration**
- Brevo (Sendinblue) for transactional emails
- Beautiful HTML email templates
- OTP verification emails
- Welcome and notification emails
- Password reset emails

### 💾 **Data & Caching**
- Supabase as primary database
- Redis (Upstash) for caching and sessions
- OTP storage and verification
- Session management
- Rate limiting storage

### 🛡️ **Security & Validation**
- Input validation with Joi
- SQL injection prevention
- XSS protection with Helmet
- CORS configuration
- Request rate limiting
- Password hashing with bcrypt

## 🏗️ **Tech Stack**

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Cache/Sessions**: Redis (Upstash)
- **Email**: Brevo (Sendinblue)
- **Authentication**: JWT + Supabase Auth
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## 📁 **Project Structure**

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Supabase configuration
│   │   ├── redis.ts         # Redis/Upstash configuration
│   │   └── email.ts         # Brevo email configuration
│   ├── middleware/
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── validation.ts    # Request validation
│   │   ├── errorHandler.ts  # Error handling
│   │   └── notFound.ts      # 404 handler
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   ├── users.ts         # User management
│   │   ├── stores.ts        # Store management
│   │   ├── offers.ts        # Offer management
│   │   ├── categories.ts    # Category management
│   │   ├── wallet.ts        # Wallet & withdrawals
│   │   ├── referrals.ts     # Referral system
│   │   ├── notifications.ts # Notification system
│   │   ├── support.ts       # Support tickets
│   │   └── admin.ts         # Admin analytics
│   ├── utils/
│   │   ├── jwt.ts           # JWT utilities
│   │   └── validation.ts    # Validation helpers
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── server.ts            # Main server file
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔧 **Setup Instructions**

### 1. **Environment Setup**

```bash
# Clone and install dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env
```

### 2. **Configure Environment Variables**

Edit `.env` file with your credentials:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Redis (Upstash)
REDIS_URL=your_upstash_redis_url

# Brevo Email
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. **Database Setup**

The backend expects the following Supabase tables to exist:
- `users` - User profiles and wallet data
- `stores` - Partner stores
- `offers` - Cashback offers and deals
- `categories` - Product categories
- `transactions` - Purchase tracking
- `withdrawals` - Withdrawal requests
- `referrals` - Referral tracking
- `notifications` - User notifications
- `support_tickets` - Support system
- `support_responses` - Ticket responses

### 4. **Development**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📚 **API Documentation**

### **Authentication Endpoints**

#### `POST /api/auth/send-otp`
Send OTP for email verification during signup.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "signupData": {
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+91 9876543210",
    "password": "SecurePass123!",
    "referralCode": "SAVE123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

#### `POST /api/auth/verify-otp`
Verify OTP and complete user registration.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

#### `POST /api/auth/login`
User login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

### **Store Endpoints**

#### `GET /api/stores`
Get all stores with filtering and pagination.

**Query Parameters:**
- `category` - Filter by category ID
- `search` - Search by name or description
- `isPopular` - Filter popular stores
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sortBy` - Sort field (name, cashback_rate, created_at)
- `sortOrder` - Sort order (asc, desc)

#### `GET /api/stores/featured/popular`
Get popular stores (cached).

#### `POST /api/stores/:id/track`
Track store click for analytics.

### **Offer Endpoints**

#### `GET /api/offers`
Get all offers with filtering and pagination.

#### `GET /api/offers/featured/trending`
Get trending offers (cached).

#### `GET /api/offers/featured/featured`
Get featured offers (cached).

#### `GET /api/offers/featured/exclusive`
Get exclusive offers (cached).

### **Wallet Endpoints**

#### `GET /api/wallet`
Get user wallet data.

#### `GET /api/wallet/transactions`
Get user transaction history.

#### `POST /api/wallet/withdraw`
Create withdrawal request.

**Request:**
```json
{
  "amount": 1000,
  "method": "upi",
  "accountDetails": {
    "upiId": "user@paytm"
  }
}
```

### **Admin Endpoints**

#### `GET /api/admin/stats`
Get admin dashboard statistics.

#### `GET /api/admin/analytics/users`
Get user analytics data.

#### `GET /api/admin/analytics/revenue`
Get revenue analytics data.

## 🔒 **Security Features**

### **Authentication**
- JWT tokens with expiration
- Refresh token rotation
- Password hashing with bcrypt
- Email verification required

### **Rate Limiting**
- Global rate limiting (100 requests per 15 minutes)
- Authentication rate limiting
- OTP request limiting

### **Input Validation**
- Joi schema validation
- SQL injection prevention
- XSS protection
- Input sanitization

### **Headers & CORS**
- Security headers with Helmet
- CORS configuration
- Content Security Policy

## 📧 **Email Templates**

The backend includes beautiful HTML email templates for:

1. **OTP Verification** - Welcome email with verification code
2. **Welcome Email** - Post-signup welcome with getting started guide
3. **Password Reset** - Secure password reset link
4. **Cashback Notifications** - Cashback earned notifications

## 🚀 **Deployment**

### **Environment Variables for Production**

```env
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.savemoney.com

# Use production URLs and keys
SUPABASE_URL=https://your-project.supabase.co
REDIS_URL=redis://your-upstash-redis-url
BREVO_API_KEY=your-production-brevo-key
JWT_SECRET=your-production-jwt-secret

# Security settings
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX_REQUESTS=50
```

### **Production Checklist**

- [ ] Set strong JWT secret
- [ ] Configure production database
- [ ] Set up Redis cache
- [ ] Configure email service
- [ ] Set up monitoring and logging
- [ ] Configure SSL/TLS
- [ ] Set up backup strategy
- [ ] Configure rate limiting
- [ ] Set up health checks

## 🔧 **Development**

### **Adding New Routes**

1. Create route file in `src/routes/`
2. Add validation schemas in `middleware/validation.ts`
3. Import and use in `server.ts`
4. Add TypeScript types in `types/index.ts`

### **Database Operations**

Use the Supabase client for all database operations:

```typescript
import { supabase } from '../config/database';

// Example query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### **Caching Strategy**

Use Redis for caching frequently accessed data:

```typescript
import { redisHelpers } from '../config/redis';

// Cache data
await redisHelpers.cache('key', data, 60); // 60 minutes

// Get cached data
const cached = await redisHelpers.getCached('key');
```

## 📊 **Monitoring & Analytics**

The backend provides comprehensive analytics endpoints for:

- User engagement metrics
- Revenue and financial data
- Store performance tracking
- Offer click-through rates
- Conversion analytics
- Support ticket metrics

## 🤝 **Contributing**

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write comprehensive tests
5. Update documentation

## 📞 **Support**

For backend-related questions or issues:
- Email: dev@savemoney.com
- Documentation: [API Docs](https://docs.savemoney.com)
- Issues: [GitHub Issues](https://github.com/savemoney/backend/issues)

---

Built with ❤️ for the SaveMoney platform.