# Development Practices

## 🎯 Test-Driven Development (TDD)

### **Core Principle**: Write Tests First, Then Implementation

Every feature follows this exact workflow:

1. **Write Unit Tests** - Define expected behavior with tests
2. **Run Tests** - Watch them fail (red)
3. **Implement Feature** - Write minimal code to pass tests
4. **Run Tests** - Watch them pass (green)
5. **Refactor** - Improve code while keeping tests green
6. **Commit** - Commit with verbose message

---

## 🧪 Testing Standards

### **Every Functional File MUST Have a Test File**

```
src/
├── features/
│   ├── checkin/
│   │   ├── services/
│   │   │   ├── visitService.ts
│   │   │   └── visitService.test.ts        ← Required
│   │   ├── hooks/
│   │   │   ├── useCheckIn.ts
│   │   │   └── useCheckIn.test.ts          ← Required
│   │   ├── components/
│   │   │   ├── CheckInModal.tsx
│   │   │   └── CheckInModal.test.tsx       ← Required
```

### **Test Coverage Requirements**

- **100% of public methods** must be tested
- **All edge cases** must have test cases
- **All error conditions** must be tested
- **All conditional branches** must be covered

### **Test File Naming**
- Service: `serviceName.test.ts`
- Hook: `hookName.test.ts`
- Component: `ComponentName.test.tsx`
- Utility: `utilityName.test.ts`

---

## 📊 Mock Data Structure

### **Use Consistent Mock Data Across All Tests**

Location: `src/__mocks__/data/`

```typescript
// mockPatients.ts - 3 patients covering different scenarios
export const mockPatients = [
  {
    // Patient 1: Active female patient with multiple visits
    id: 'patient-001',
    first_name: 'Jane',
    last_name: 'Doe',
    goes_by: 'Janey',
    dob: new Date('1975-01-15'),
    status: 'female',
    ethnicity: ['white'],
    language: ['english'],
    // ... complete patient data
    visit_count: 12,
    last_visit_date: new Date('2024-12-15'),
  },
  {
    // Patient 2: Male patient, recent diagnosis, first visit
    id: 'patient-002',
    first_name: 'John',
    last_name: 'Smith',
    dob: new Date('1980-03-22'),
    status: 'male',
    ethnicity: ['black', 'hispanic_latino'],
    language: ['english', 'spanish'],
    // ... complete patient data
    visit_count: 1,
    last_visit_date: new Date('2024-11-03'),
  },
  {
    // Patient 3: Child patient with guardian
    id: 'patient-003',
    first_name: 'Emily',
    last_name: 'Johnson',
    dob: new Date('2015-06-10'),
    status: 'child',
    guardian_name: 'Sarah Johnson',
    guardian_relationship: 'mother',
    // ... complete patient data
    visit_count: 5,
    last_visit_date: new Date('2024-12-20'),
  },
];

// mockVisits.ts - Visit records for mock patients
export const mockVisits = [
  {
    id: 'visit-001',
    patient_id: 'patient-001',
    visit_type: 'returning',
    check_in_timestamp: new Date('2024-12-15T10:30:00'),
    staff_user_id: 'staff-001',
    assistance_requested: ['food', 'gas_card'],
    visit_notes: 'Requested additional food assistance',
  },
  // ... more visits
];
```

---

## 🔄 TDD Workflow Per Sprint

### **Step 1: Create Test Files**
Before writing ANY implementation code:

```bash
# For each service/component/hook in sprint
touch src/features/checkin/services/visitService.test.ts
touch src/features/checkin/hooks/useCheckIn.test.ts
touch src/features/checkin/components/CheckInModal.test.tsx
```

### **Step 2: Write Test Cases**
Define all expected behavior:

```typescript
// visitService.test.ts
describe('visitService', () => {
  describe('checkInPatient', () => {
    it('creates visit record with current timestamp');
    it('updates patient visit_count by 1');
    it('updates patient last_visit_date to today');
    it('throws error if patient already checked in today');
    it('includes staff_user_id in visit record');
    it('saves assistance_requested array');
    it('saves visit_notes if provided');
  });
  
  describe('getVisitHistory', () => {
    it('returns visits sorted by check_in_timestamp desc');
    it('includes staff name in each visit');
    it('returns empty array if no visits');
    it('paginates results correctly');
  });
});
```

### **Step 3: Run Tests (Should Fail)**
```bash
npm test visitService.test.ts
# All tests should fail - implementation doesn't exist yet
```

### **Step 4: Implement Feature**
Write minimal code to pass tests:

```typescript
// visitService.ts
export async function checkInPatient(
  patientId: string,
  data: CheckInInput
): Promise<Visit> {
  // Implementation that makes tests pass
}
```

### **Step 5: Run Tests (Should Pass)**
```bash
npm test visitService.test.ts
# All tests should pass now
```

### **Step 6: Refactor & Commit**
Improve code, ensure tests still pass, commit with verbose message.

---

## 📋 Definition of Done (DoD)

### **A feature is DONE when:**

#### ✅ **Code Quality**
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for the feature
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used (no hardcoded values)

#### ✅ **Functionality**
- [ ] Feature works as specified in sprint requirements
- [ ] All edge cases handled
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Success/error messages shown to user

#### ✅ **Testing**
- [ ] Unit tests for all services
- [ ] Unit tests for all hooks
- [ ] Component tests for all UI components
- [ ] Integration tests for critical flows
- [ ] All tests use mock data from `__mocks__/data/`
- [ ] Tests cover happy path + edge cases + error cases

#### ✅ **Documentation**
- [ ] Function comments added
- [ ] Complex logic explained with inline comments
- [ ] Type definitions documented
- [ ] README updated if needed

#### ✅ **Git**
- [ ] Committed with verbose commit message
- [ ] Commit message follows guidelines
- [ ] Branch named correctly (`feat/feature-name`)
- [ ] No commented-out code
- [ ] No console.logs or debugger statements

#### ✅ **Code Review**
- [ ] Self-reviewed code
- [ ] Checked for code duplication
- [ ] Verified modularity (no tight coupling)
- [ ] Confirmed reusability of components

---

## 🧩 Modularity Principles

### **1. Single Responsibility**
Each file/function/component does ONE thing well.

```typescript
// BAD - Does too much
function handlePatientCheckIn(patientId, data) {
  validateData(data);
  createVisit(patientId, data);
  updatePatient(patientId);
  sendNotification();
  logAnalytics();
}

// GOOD - Separated concerns
async function checkInPatient(patientId: string, data: CheckInInput) {
  return await visitService.createVisit(patientId, data);
  // Database trigger handles patient update
  // Separate analytics service handles logging
}
```

### **2. No Tight Coupling**
Components/services should be independently testable.

```typescript
// BAD - Tightly coupled
function CheckInModal() {
  const patient = usePatient(); // Depends on context
  const { checkIn } = useCheckIn(); // Depends on hook
  // Hard to test in isolation
}

// GOOD - Loosely coupled
interface CheckInModalProps {
  patient: Patient;
  onCheckIn: (data: CheckInInput) => Promise<void>;
}

function CheckInModal({ patient, onCheckIn }: CheckInModalProps) {
  // Easy to test - just pass props
}
```

### **3. Reusable Components**
Build once, use everywhere.

```typescript
// Reusable FormField component
<FormField
  label="First Name"
  value={firstName}
  onChange={setFirstName}
  error={errors.firstName}
  required
/>

// Used in intake form, edit form, disclosure form, etc.
```

---

## 🎨 Component Testing Strategy

### **Test User Interactions, Not Implementation**

```typescript
// BAD - Testing implementation details
it('sets isLoading to true when submitting', () => {
  const { result } = renderHook(() => useCheckIn());
  expect(result.current.isLoading).toBe(false);
});

// GOOD - Testing user-facing behavior
it('shows loading spinner while checking in patient', async () => {
  render(<CheckInModal patient={mockPatients[0]} onCheckIn={mockCheckIn} />);
  
  const submitButton = screen.getByText('Confirm Check-In');
  fireEvent.click(submitButton);
  
  expect(screen.getByText('Checking in...')).toBeInTheDocument();
});
```

---

## 🔧 Service Testing Strategy

### **Test All Methods, All Scenarios**

```typescript
describe('visitService', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });
  
  describe('checkInPatient', () => {
    it('creates visit with correct data', async () => {
      const result = await checkInPatient('patient-001', {
        assistance: ['food'],
        notes: 'Test note',
      });
      
      expect(result).toMatchObject({
        patient_id: 'patient-001',
        assistance_requested: ['food'],
        visit_notes: 'Test note',
      });
    });
    
    it('throws error if patient not found', async () => {
      await expect(
        checkInPatient('invalid-id', { assistance: [] })
      ).rejects.toThrow('Patient not found');
    });
    
    it('prevents duplicate check-in on same day', async () => {
      // First check-in succeeds
      await checkInPatient('patient-001', { assistance: [] });
      
      // Second check-in on same day fails
      await expect(
        checkInPatient('patient-001', { assistance: [] })
      ).rejects.toThrow('Already checked in today');
    });
  });
});
```

---

## 📦 Import Organization

### **Consistent Import Order**

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// 2. Internal utilities/types
import type { Patient, Visit } from '@/types';
import { formatDate, calculateAge } from '@/utils';

// 3. Constants
import { ASSISTANCE_TYPES } from '@/constants';

// 4. Services
import { visitService } from '@/features/checkin/services/visitService';

// 5. Hooks
import { useAuth } from '@/features/auth/hooks/useAuth';

// 6. Components
import { Button } from '@/components/common/Button';
import { FormField } from '@/components/forms/FormField';

// 7. Styles (if any)
import styles from './CheckInModal.module.css';
```

---

## 🚀 Sprint Execution Checklist

### **Before Starting Sprint**
- [ ] Read sprint requirements thoroughly
- [ ] Understand inputs, outputs, and expected outcomes
- [ ] Review file structure and dependencies
- [ ] Set up test files for all components/services/hooks

### **During Sprint**
- [ ] Write tests first for each feature
- [ ] Implement feature to pass tests
- [ ] Refactor while keeping tests green
- [ ] Commit frequently with verbose messages
- [ ] Update DoD checklist as you go

### **After Sprint**
- [ ] Verify all DoD items checked
- [ ] Run full test suite
- [ ] Manual testing of feature
- [ ] Update documentation
- [ ] Create pull request with sprint summary

---

## 🎯 Quality Gates

### **Code CANNOT be merged unless:**
1. All tests passing
2. Test coverage ≥ 90%
3. No TypeScript errors
4. No ESLint warnings
5. All DoD items checked
6. Code reviewed (self-review minimum)

---

## 📚 Testing Tools

- **Unit Tests**: Jest + React Testing Library
- **Component Tests**: React Testing Library
- **E2E Tests** (later): Playwright
- **Coverage**: Jest coverage reports
- **Mocking**: Jest mocks + MSW for API mocking

---

**Remember**: Tests are documentation. They show how code should be used and what it should do. Write tests that future developers (including you) can read and understand! 🚀
