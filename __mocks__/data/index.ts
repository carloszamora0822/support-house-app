/**
 * Central export for all mock data
 * Use these mocks consistently across all tests
 */

export { mockPatients } from './mockPatients';
export { mockVisits } from './mockVisits';
export { mockUsers } from './mockUsers';

// Helper functions for tests
export function getMockPatientById(id: string) {
  return mockPatients.find(p => p.id === id);
}

export function getMockVisitsByPatientId(patientId: string) {
  return mockVisits.filter(v => v.patient_id === patientId);
}

export function getMockUserById(id: string) {
  return mockUsers.find(u => u.id === id);
}

// Re-export for convenience
import { mockPatients } from './mockPatients';
import { mockVisits } from './mockVisits';
import { mockUsers } from './mockUsers';

export default {
  patients: mockPatients,
  visits: mockVisits,
  users: mockUsers,
};
