// Export all Supabase services
export { authService } from './auth';
export { userService } from './users';
export { storeService } from './stores';
export { offerService } from './offers';
export { categoryService } from './categories';
export { walletService } from './wallet';
export { notificationService } from './notifications';
export { contentService } from './content';
export { supportService } from './support';
export { analyticsService } from './analytics';

// Re-export Supabase client and types
export { supabase, type Database, type Tables, type Inserts, type Updates } from '../../lib/supabase';