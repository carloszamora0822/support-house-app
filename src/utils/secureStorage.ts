// Secure storage utility with encryption for sensitive data
// SECURITY: Uses session-based key derivation to prevent unauthorized decryption
// Keys are derived from authenticated user session + random salt
// Data automatically expires after 24 hours

const EXPIRATION_HOURS = 24;
const PBKDF2_ITERATIONS = 100000; // OWASP recommended minimum

interface EncryptedData {
  data: string; // encrypted data
  timestamp: number;
  iv: string; // initialization vector
  salt: string; // random salt used for key derivation
  userId: string; // user who encrypted this data (for validation)
}

/**
 * Get session-based encryption key material
 * SECURITY: Derives key from user session to prevent unauthorized decryption
 */
async function getSessionKeyMaterial(): Promise<string> {
  // Get current session token from Supabase
  const { supabase } = await import('@/lib/supabase');
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No active session - cannot encrypt/decrypt PHI');
  }
  
  // Use session token + user ID as key material
  // This ensures only the authenticated user can decrypt their session data
  return `${session.access_token}-${session.user.id}`;
}

/**
 * Generate cryptographically secure random salt
 */
function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(32));
}

/**
 * Encryption using Web Crypto API with session-based keys
 * SECURITY IMPROVEMENTS:
 * - Key derived from active user session (not hardcoded)
 * - Random salt per encryption operation
 * - AES-256-GCM authenticated encryption
 * - Prevents decryption without valid session
 */
async function encrypt(text: string): Promise<{ encrypted: string; iv: string; salt: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Get session-based key material
  const sessionKey = await getSessionKeyMaterial();
  
  // Generate random salt for this encryption
  const salt = generateSalt();
  
  // Generate a key from session material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionKey),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Convert to base64 for storage
  const encryptedArray = Array.from(new Uint8Array(encrypted));
  const encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
  
  const ivArray = Array.from(iv);
  const ivBase64 = btoa(String.fromCharCode(...ivArray));
  
  const saltArray = Array.from(salt);
  const saltBase64 = btoa(String.fromCharCode(...saltArray));
  
  return { encrypted: encryptedBase64, iv: ivBase64, salt: saltBase64 };
}

/**
 * Decrypt data using Web Crypto API with session-based keys
 * SECURITY: Requires active authenticated session to decrypt
 */
async function decrypt(encryptedBase64: string, ivBase64: string, saltBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Get session-based key material
  const sessionKey = await getSessionKeyMaterial();
  
  // Convert salt from base64
  const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
  
  // Generate the same key using stored salt
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(sessionKey),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  // Convert from base64
  const encryptedArray = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedArray
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Check if data has expired
 */
function isExpired(timestamp: number): boolean {
  const expirationMs = EXPIRATION_HOURS * 60 * 60 * 1000;
  return Date.now() - timestamp > expirationMs;
}

export const secureStorage = {
  /**
   * Save encrypted data to localStorage with expiration
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.error('Cannot encrypt: No active session');
        return false;
      }
      
      const jsonString = JSON.stringify(value);
      const { encrypted, iv, salt } = await encrypt(jsonString);
      
      const encryptedData: EncryptedData = {
        data: encrypted,
        timestamp: Date.now(),
        iv,
        salt,
        userId: session.user.id,
      };
      
      localStorage.setItem(key, JSON.stringify(encryptedData));
      return true;
    } catch (error) {
      console.error('Failed to save encrypted data:', error);
      return false;
    }
  },

  /**
   * Retrieve and decrypt data from localStorage
   * Returns null if expired or invalid
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.error('Cannot decrypt: No active session');
        return null;
      }
      
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const encryptedData: EncryptedData = JSON.parse(stored);
      
      // Validate user owns this data
      if (encryptedData.userId !== session.user.id) {
        console.error('Cannot decrypt: Data belongs to different user');
        localStorage.removeItem(key);
        return null;
      }
      
      // Check expiration
      if (isExpired(encryptedData.timestamp)) {
        localStorage.removeItem(key);
        return null;
      }

      const decrypted = await decrypt(encryptedData.data, encryptedData.iv, encryptedData.salt);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to load encrypted data:', error);
      return null;
    }
  },

  /**
   * Remove item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  },

  /**
   * Clear all expired items
   */
  clearExpired(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }

    keys.forEach(key => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          if (data.timestamp && isExpired(data.timestamp)) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Invalid format, skip
      }
    });
  },

  /**
   * Get age of stored data in milliseconds
   */
  getAge(key: string): number | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (!data.timestamp) return null;

      return Date.now() - data.timestamp;
    } catch {
      return null;
    }
  },
};

// Auto-clear expired items on page load
if (typeof window !== 'undefined') {
  secureStorage.clearExpired();
}
