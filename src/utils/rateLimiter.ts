// Rate limiting and failed login tracking for security
// HIPAA Compliance: Prevents brute force attacks and unauthorized access attempts

interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ipAddress?: string;
}

interface LockoutInfo {
  email: string;
  lockedUntil: number;
  attemptCount: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // Track attempts in 15-minute window
const STORAGE_KEY_ATTEMPTS = 'login_attempts';
const STORAGE_KEY_LOCKOUTS = 'account_lockouts';

/**
 * Get all login attempts from storage
 */
function getAttempts(): LoginAttempt[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save login attempts to storage
 */
function saveAttempts(attempts: LoginAttempt[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
  } catch (error) {
    console.error('Failed to save login attempts:', error);
  }
}

/**
 * Get lockout information from storage
 */
function getLockouts(): LockoutInfo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LOCKOUTS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save lockout information to storage
 */
function saveLockouts(lockouts: LockoutInfo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_LOCKOUTS, JSON.stringify(lockouts));
  } catch (error) {
    console.error('Failed to save lockouts:', error);
  }
}

/**
 * Clean up old attempts and expired lockouts
 */
function cleanup(): void {
  const now = Date.now();
  
  // Remove attempts older than the window
  const attempts = getAttempts().filter(
    attempt => now - attempt.timestamp < ATTEMPT_WINDOW_MS
  );
  saveAttempts(attempts);
  
  // Remove expired lockouts
  const lockouts = getLockouts().filter(
    lockout => lockout.lockedUntil > now
  );
  saveLockouts(lockouts);
}

export const rateLimiter = {
  /**
   * Check if an email is currently locked out
   */
  isLockedOut(email: string): boolean {
    cleanup();
    const lockouts = getLockouts();
    const lockout = lockouts.find(l => l.email.toLowerCase() === email.toLowerCase());
    
    if (!lockout) return false;
    
    const now = Date.now();
    return lockout.lockedUntil > now;
  },

  /**
   * Get remaining lockout time in seconds
   */
  getLockoutTimeRemaining(email: string): number {
    const lockouts = getLockouts();
    const lockout = lockouts.find(l => l.email.toLowerCase() === email.toLowerCase());
    
    if (!lockout) return 0;
    
    const now = Date.now();
    const remaining = lockout.lockedUntil - now;
    
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  },

  /**
   * Get number of failed attempts for an email in the current window
   */
  getFailedAttemptCount(email: string): number {
    cleanup();
    const attempts = getAttempts();
    const now = Date.now();
    
    return attempts.filter(
      attempt =>
        attempt.email.toLowerCase() === email.toLowerCase() &&
        !attempt.success &&
        now - attempt.timestamp < ATTEMPT_WINDOW_MS
    ).length;
  },

  /**
   * Record a login attempt
   */
  recordAttempt(email: string, success: boolean): void {
    cleanup();
    
    const attempt: LoginAttempt = {
      email: email.toLowerCase(),
      timestamp: Date.now(),
      success,
    };
    
    const attempts = getAttempts();
    attempts.push(attempt);
    saveAttempts(attempts);
    
    // If failed, check if we need to lock out
    if (!success) {
      const failedCount = this.getFailedAttemptCount(email);
      
      if (failedCount >= MAX_FAILED_ATTEMPTS) {
        this.lockoutAccount(email, failedCount);
      }
    } else {
      // Successful login - clear any lockout
      this.clearLockout(email);
    }
  },

  /**
   * Lock out an account
   */
  lockoutAccount(email: string, attemptCount: number): void {
    const lockouts = getLockouts();
    const existingIndex = lockouts.findIndex(
      l => l.email.toLowerCase() === email.toLowerCase()
    );
    
    const lockout: LockoutInfo = {
      email: email.toLowerCase(),
      lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
      attemptCount,
    };
    
    if (existingIndex >= 0) {
      lockouts[existingIndex] = lockout;
    } else {
      lockouts.push(lockout);
    }
    
    saveLockouts(lockouts);
    
    // Log security event
    console.warn(`Account locked due to ${attemptCount} failed login attempts:`, email);
  },

  /**
   * Clear lockout for an email (after successful login)
   */
  clearLockout(email: string): void {
    const lockouts = getLockouts().filter(
      l => l.email.toLowerCase() !== email.toLowerCase()
    );
    saveLockouts(lockouts);
    
    // Also clear failed attempts for this email
    const attempts = getAttempts().filter(
      a => a.email.toLowerCase() !== email.toLowerCase() || a.success
    );
    saveAttempts(attempts);
  },

  /**
   * Clear all lockouts and attempts (admin function)
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCKOUTS);
  },

  /**
   * Get all lockouts (for admin dashboard)
   */
  getAllLockouts(): LockoutInfo[] {
    cleanup();
    return getLockouts();
  },

  /**
   * Get statistics for security monitoring
   */
  getStats() {
    cleanup();
    const attempts = getAttempts();
    const lockouts = getLockouts();
    
    const failedAttempts = attempts.filter(a => !a.success);
    const successfulAttempts = attempts.filter(a => a.success);
    
    return {
      totalAttempts: attempts.length,
      failedAttempts: failedAttempts.length,
      successfulAttempts: successfulAttempts.length,
      activeLockouts: lockouts.length,
      uniqueEmailsAttempted: new Set(attempts.map(a => a.email)).size,
    };
  },
};

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  cleanup();
}
