# SaveMoney - CashKaro-Style Cashback Platform

A modern, responsive cashback and coupon platform built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### 🎨 **CashKaro-Inspired Design**
- Modern, responsive UI with orange/red color scheme
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Beautiful offer carousels and grids

### 🔐 **Complete Authentication System**
- Email/Password authentication
- Google OAuth integration
- Facebook OAuth integration
- OTP verification via email
- Password reset functionality
- Mailtrap email integration

### 💰 **Cashback Platform Features**
- Browse 500+ partner stores
- Discover deals across categories
- Track cashback earnings
- Withdrawal management
- Referral program
- Real-time notifications

### 🛠 **Admin Panel**
- User management
- Store management
- Offer management
- Content management
- Analytics dashboard
- Withdrawal processing

## 🏗️ **Tech Stack**

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: Custom components with Framer Motion
- **Authentication**: Supabase Auth with OAuth
- **Email**: Mailtrap for OTP and notifications
- **Image Upload**: Cloudinary integration
- **State Management**: React Query + Context API

## 📱 **Responsive Design**

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Enhanced for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Optimized for large displays (1440px+)

## 🎯 **Key Components**

### **RecommendedOffersCarousel**
- Backend-driven offer recommendations
- Smooth carousel with navigation
- CashKaro-style offer cards
- Mobile-responsive design

### **AuthModal**
- Unified login/signup modal
- Social OAuth integration
- OTP verification flow
- Password reset functionality

### **NotificationDropdown**
- Real-time notifications
- Mark as read functionality
- Mobile-optimized design
- Notification categories

## 🔧 **Setup Instructions**

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure:
   - Supabase URL and keys
   - Cloudinary credentials
   - Mailtrap credentials

3. **Database Setup**
   - Connect to Supabase
   - Migrations will run automatically
   - Sample data included

4. **OAuth Setup**
   - Configure Google OAuth in Supabase
   - Configure Facebook OAuth in Supabase
   - Add redirect URLs

5. **Email Setup**
   - Create Mailtrap account
   - Add SMTP credentials to environment

## 🚀 **Development**

```bash
npm run dev
```

## 🏗️ **Build**

```bash
npm run build
```

## 📊 **Features Overview**

### **User Features**
- ✅ Browse stores and offers
- ✅ Earn cashback on purchases
- ✅ Track earnings and withdrawals
- ✅ Refer friends for bonuses
- ✅ Real-time notifications
- ✅ Multi-language support (EN/HI)

### **Admin Features**
- ✅ Complete dashboard
- ✅ User management
- ✅ Store/offer management
- ✅ Content management
- ✅ Analytics and reports
- ✅ Notification system

### **Technical Features**
- ✅ Server-side rendering ready
- ✅ SEO optimized
- ✅ PWA ready
- ✅ Image optimization
- ✅ Caching strategies
- ✅ Error boundaries

## 🎨 **Design System**

### **Colors**
- Primary: Orange (#f97316)
- Secondary: Teal (#14b8a6)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

### **Typography**
- Font: Inter (Google Fonts)
- Weights: 400, 500, 600, 700, 800
- Responsive scaling

### **Components**
- Consistent spacing (8px grid)
- Rounded corners (8px, 12px, 16px)
- Subtle shadows and borders
- Smooth hover transitions

## 📱 **Mobile Experience**

- Touch-friendly interface
- Swipe gestures for carousels
- Optimized loading states
- Native-like animations
- Offline support ready

## 🔒 **Security**

- Row Level Security (RLS)
- JWT token authentication
- CSRF protection
- Input validation
- Secure file uploads

## 📈 **Performance**

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle optimization

## 🌐 **Internationalization**

- English and Hindi support
- RTL layout ready
- Currency formatting
- Date/time localization

---

Built with ❤️ for the Indian market, inspired by CashKaro's success.