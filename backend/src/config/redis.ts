import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL environment variable is required');
}

export const redis = new Redis(redisUrl, {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

// Redis helper functions
export const redisHelpers = {
  // Store OTP with expiry
  async storeOTP(email: string, otp: string, expiryMinutes: number = 10) {
    const key = `otp:${email}`;
    await redis.setex(key, expiryMinutes * 60, otp);
  },

  // Get and verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const key = `otp:${email}`;
    const storedOTP = await redis.get(key);
    
    if (!storedOTP || storedOTP !== otp) {
      return false;
    }
    
    // Delete OTP after successful verification
    await redis.del(key);
    return true;
  },

  // Store signup data temporarily
  async storeSignupData(email: string, signupData: any, expiryMinutes: number = 30) {
    const key = `signup:${email}`;
    await redis.setex(key, expiryMinutes * 60, JSON.stringify(signupData));
  },

  // Get signup data
  async getSignupData(email: string): Promise<any | null> {
    const key = `signup:${email}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Delete signup data
  async deleteSignupData(email: string) {
    const key = `signup:${email}`;
    await redis.del(key);
  },

  // Store session data
  async storeSession(userId: string, sessionData: any, expiryHours: number = 24) {
    const key = `session:${userId}`;
    await redis.setex(key, expiryHours * 3600, JSON.stringify(sessionData));
  },

  // Get session data
  async getSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Delete session
  async deleteSession(userId: string) {
    const key = `session:${userId}`;
    await redis.del(key);
  },

  // Rate limiting
  async checkRateLimit(key: string, maxAttempts: number, windowMinutes: number): Promise<boolean> {
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, windowMinutes * 60);
    }
    
    return current <= maxAttempts;
  },

  // Cache data
  async cache(key: string, data: any, expiryMinutes: number = 60) {
    await redis.setex(key, expiryMinutes * 60, JSON.stringify(data));
  },

  // Get cached data
  async getCached(key: string): Promise<any | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  // Delete cached data
  async deleteCached(key: string) {
    await redis.del(key);
  },
};