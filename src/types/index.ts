// Base User Type
export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    referralCode?: string;
    referredBy?: string;
    createdAt: string;
    updatedAt: string;
}

// Category Type
export interface Category {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

// Store Type
export interface Store {
    id: string;
    name: string;
    description: string;
    url: string;
    logo: string;
    category: string; // Or Category if populated
    isPopular: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

// Offer Type
export interface Offer {
    id: string;
    title: string;
    description: string;
    offerType: 'coupon' | 'deal';
    couponCode?: string;
    store: string; // Or Store if populated
    category: string; // Or Category if populated
    imageUrl: string;
    startDate: string;
    endDate: string;
    isTrending: boolean;
    isFeatured: boolean;
    isExclusive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Wallet & Transaction Types
export interface Wallet {
    id: string;
    user: string; // Or User if populated
    balance: number;
    pendingBalance: number;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    user: string; // Or User if populated
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
}

export interface Withdrawal {
    id: string;
    user: string; // Or User if populated
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
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
    title: string;
    page: string;
    content: any; // JSON object
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}
