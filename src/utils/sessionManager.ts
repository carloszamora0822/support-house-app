// Session management for HIPAA compliance
// Implements automatic session timeout and activity tracking

const SESSION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes of inactivity (HIPAA recommended)
const WARNING_BEFORE_TIMEOUT_MS = 2 * 60 * 1000; // Warn 2 minutes before timeout
const STORAGE_KEY_LAST_ACTIVITY = 'last_activity';
const STORAGE_KEY_SESSION_START = 'session_start';

type SessionTimeoutCallback = () => void;
type SessionWarningCallback = (secondsRemaining: number) => void;

let timeoutCallback: SessionTimeoutCallback | null = null;
let warningCallback: SessionWarningCallback | null = null;
let checkInterval: NodeJS.Timeout | null = null;
let warningShown = false;

/**
 * Update last activity timestamp
 */
function updateActivity(): void {
  localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
  warningShown = false;
}

/**
 * Get last activity timestamp
 */
function getLastActivity(): number {
  const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
  return stored ? parseInt(stored, 10) : Date.now();
}

/**
 * Get session start time
 */
function getSessionStart(): number {
  const stored = localStorage.getItem(STORAGE_KEY_SESSION_START);
  return stored ? parseInt(stored, 10) : Date.now();
}

/**
 * Calculate time until session timeout
 */
function getTimeUntilTimeout(): number {
  const lastActivity = getLastActivity();
  const elapsed = Date.now() - lastActivity;
  const remaining = SESSION_TIMEOUT_MS - elapsed;
  return Math.max(0, remaining);
}

/**
 * Check if session has timed out
 */
function checkTimeout(): void {
  const timeRemaining = getTimeUntilTimeout();
  
  // Session timed out
  if (timeRemaining === 0) {
    if (timeoutCallback) {
      console.warn('Session timed out due to inactivity');
      timeoutCallback();
    }
    return;
  }
  
  // Show warning if approaching timeout
  if (timeRemaining <= WARNING_BEFORE_TIMEOUT_MS && !warningShown && warningCallback) {
    warningShown = true;
    const secondsRemaining = Math.ceil(timeRemaining / 1000);
    warningCallback(secondsRemaining);
  }
}

/**
 * Activity event listeners
 */
const activityEvents = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
];

/**
 * Handle activity event
 */
function handleActivity(): void {
  updateActivity();
}

export const sessionManager = {
  /**
   * Initialize session management
   */
  init(onTimeout: SessionTimeoutCallback, onWarning?: SessionWarningCallback): void {
    // Set callbacks
    timeoutCallback = onTimeout;
    if (onWarning) {
      warningCallback = onWarning;
    }
    
    // Initialize session start time
    if (!localStorage.getItem(STORAGE_KEY_SESSION_START)) {
      localStorage.setItem(STORAGE_KEY_SESSION_START, Date.now().toString());
    }
    
    // Set initial activity
    updateActivity();
    
    // Add activity listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });
    
    // Start checking for timeout every 10 seconds
    checkInterval = setInterval(checkTimeout, 10000);
    
    console.log('Session manager initialized with 15-minute timeout');
  },

  /**
   * Destroy session management (cleanup)
   */
  destroy(): void {
    // Remove activity listeners
    activityEvents.forEach(event => {
      window.removeEventListener(event, handleActivity);
    });
    
    // Clear interval
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
    
    // Clear callbacks
    timeoutCallback = null;
    warningCallback = null;
  },

  /**
   * Reset session (after successful authentication)
   */
  reset(): void {
    localStorage.setItem(STORAGE_KEY_SESSION_START, Date.now().toString());
    updateActivity();
    warningShown = false;
  },

  /**
   * End session (clear all session data)
   */
  end(): void {
    localStorage.removeItem(STORAGE_KEY_LAST_ACTIVITY);
    localStorage.removeItem(STORAGE_KEY_SESSION_START);
    this.destroy();
  },

  /**
   * Extend session (user clicked "Stay logged in")
   */
  extend(): void {
    updateActivity();
    warningShown = false;
  },

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    const start = getSessionStart();
    return Math.floor((Date.now() - start) / 1000);
  },

  /**
   * Get time remaining until timeout in seconds
   */
  getTimeRemaining(): number {
    return Math.ceil(getTimeUntilTimeout() / 1000);
  },

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return getTimeUntilTimeout() > 0;
  },

  /**
   * Get session statistics
   */
  getStats() {
    return {
      sessionDuration: this.getSessionDuration(),
      timeRemaining: this.getTimeRemaining(),
      isActive: this.isActive(),
      lastActivity: new Date(getLastActivity()).toISOString(),
      sessionStart: new Date(getSessionStart()).toISOString(),
    };
  },
};
