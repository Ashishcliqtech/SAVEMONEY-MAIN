// Base User Type
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    avatar?: string;
    referralCode?: string;
    referredBy?: string;
    createdAt: string;
    updatedAt: string;
    totalCashback?: number;
    availableCashback?: number;
    pendingCashback?: number;
}

// Category Type
export interface Category {
    id?: string; // Mongoose virtual, may not always be present
    _id: string; // The actual MongoDB document ID
    name: string;
    description: string;
    icon: string;
    storeCount?: number;
    offerCount?: number;
    createdAt: string;
    updatedAt: string;
}

// Store Type
export interface Store {
    _id: string; // Use _id from MongoDB
    id: string; // Keep id for compatibility if needed
    name: string;
    description: string;
    url: string;
    logo: string;
    banner_url?: string;
    category: Category; // Should be populated
    isPopular: boolean;
    isFeatured: boolean;
    cashback_rate: number;
    totalOffers?: number; // From virtual
    createdAt: string;
    updatedAt: string;
}

// Offer Type
export interface Offer {
    _id: string;
    id: string;
    title: string;
    description: string;
    url: string; // <-- This field is now added
    offerType: 'coupon' | 'deal' | 'cashback';
    couponCode?: string;
    store: Store; // Assuming it's populated
    category: Category; // Assuming it's populated
    imageUrl: string;
    expiryDate: string;
    isTrending: boolean;
    isFeatured: boolean;
    isExclusive: boolean;
    cashbackRate: number;
    originalPrice?: number;
    discountedPrice?: number;
    terms?: string[];
    minOrderValue?: number;
    createdAt: string;
    updatedAt: string;
}

// Wallet & Transaction Types
export interface Wallet {
    id: string;
    user: string;
    totalCashback: number;
    availableCashback: number;
    pendingCashback: number;
    withdrawnCashback: number;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    user: string;
    orderId: string;
    store: { name: string; logo: string };
    date: string;
    amount: number;
    cashbackEarned: number;
    status: 'pending' | 'confirmed' | 'failed';
    createdAt: string;
}

export interface Withdrawal {
    id: string;
    user: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
    paymentDetails: {
        method: string;
        [key: string]: any;
    };
    createdAt: string;
    updatedAt: string;
}

// Content Section Type
export interface ContentSection {
    id: string;
    name: string;
    type: 'hero' | 'featured' | 'highlighted' | 'banner' | 'testimonial';
    status: 'active' | 'inactive' | 'scheduled';
    position: number;
    devices: ('desktop' | 'tablet' | 'mobile')[];
    lastModified: string;
    page: string;
    content: any; // JSON object
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export type Language = 'en' | 'hi';
