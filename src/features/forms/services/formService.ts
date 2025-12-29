// Service for managing form drafts in localStorage
// Updated to use encrypted storage for security

import { secureStorage } from '@/utils/secureStorage';

const DRAFT_PREFIX = 'draft_';
const EXPIRATION_HOURS = 24;

interface DraftData<T> {
  data: T;
  timestamp: number;
}

export const formService = {
  // Save form data as draft to encrypted localStorage
  async saveDraft<T>(formKey: string, data: T): Promise<boolean> {
    try {
      const draftData: DraftData<T> = {
        data,
        timestamp: Date.now(),
      };
      return await secureStorage.setItem(`${DRAFT_PREFIX}${formKey}`, draftData);
    } catch (error) {
      console.error('Failed to save draft:', error);
      return false;
    }
  },

  // Load draft from encrypted localStorage
  async loadDraft<T>(formKey: string): Promise<T | null> {
    try {
      const draftData = await secureStorage.getItem<DraftData<T>>(`${DRAFT_PREFIX}${formKey}`);
      if (!draftData || !draftData.data) {
        return null;
      }

      // Check if expired (24 hours)
      const age = Date.now() - draftData.timestamp;
      const expirationMs = EXPIRATION_HOURS * 60 * 60 * 1000;
      
      if (age > expirationMs) {
        this.clearDraft(formKey);
        return null;
      }

      return draftData.data;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  },

  // Clear specific draft
  clearDraft(formKey: string): void {
    secureStorage.removeItem(`${DRAFT_PREFIX}${formKey}`);
  },

  // Check if draft exists
  hasDraft(formKey: string): boolean {
    const age = secureStorage.getAge(`${DRAFT_PREFIX}${formKey}`);
    return age !== null;
  },

  // Get draft age in milliseconds
  getDraftAge(formKey: string): number | null {
    return secureStorage.getAge(`${DRAFT_PREFIX}${formKey}`);
  },

  // Get all draft keys (without prefix)
  getAllDrafts(): string[] {
    const drafts: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        drafts.push(key.replace(DRAFT_PREFIX, ''));
      }
    }
    
    return drafts;
  },

  // Clear all drafts
  clearAllDrafts(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DRAFT_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(key => secureStorage.removeItem(key));
  },
};
