// Secure storage utility with encryption for sensitive data
// Addresses Security Issue #4: Sensitive PII in localStorage

const ENCRYPTION_KEY = 'support-house-encryption-key-v1';
const EXPIRATION_HOURS = 24;

interface EncryptedData {
  data: string; // encrypted data
  timestamp: number;
  iv: string; // initialization vector
}

/**
 * Simple encryption using Web Crypto API
 * Note: This provides basic obfuscation. For production, consider using a proper encryption library.
 */
async function encrypt(text: string): Promise<{ encrypted: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Generate a key from our encryption key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('support-house-salt'),
      iterations: 100000,
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
  
  return { encrypted: encryptedBase64, iv: ivBase64 };
}

/**
 * Decrypt data using Web Crypto API
 */
async function decrypt(encryptedBase64: string, ivBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Generate the same key
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('support-house-salt'),
      iterations: 100000,
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
      const jsonString = JSON.stringify(value);
      const { encrypted, iv } = await encrypt(jsonString);
      
      const encryptedData: EncryptedData = {
        data: encrypted,
        timestamp: Date.now(),
        iv,
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
      const stored = localStorage.getItem(key);
      if (!stored) {
        return null;
      }

      const encryptedData: EncryptedData = JSON.parse(stored);
      
      // Check expiration
      if (isExpired(encryptedData.timestamp)) {
        localStorage.removeItem(key);
        return null;
      }

      const decrypted = await decrypt(encryptedData.data, encryptedData.iv);
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
