# Sprint 3: Manual Check-In System

**Duration**: 1 week  
**Goal**: Implement manual check-in flow to track physical patient visits

---

## 📋 Features

### 1. Check-In Modal
- Modal triggered from Patient Summary "Check In" button
- Shows patient name and last visit date
- Assistance type checkboxes (wigs, food, medical supplies, etc.)
- Optional notes textarea
- Confirm/Cancel buttons
- Loading state during submission
- Success/error messages

### 2. Visit Creation
- Create visit record with timestamp
- Link to patient and staff user
- Save assistance requested
- Save visit notes
- Update patient visit_count (+1)
- Update patient last_visit_date (today)

### 3. Duplicate Check-In Prevention
- Check if patient already checked in today
- Show warning if attempting duplicate
- Allow override with confirmation (optional)

### 4. Check-In Success Flow
- Success toast notification
- Modal closes automatically
- Patient Summary refreshes with updated data
- Visit count increments
- Last visit date updates

### 5. Visit History Integration
- New visit appears at top of history
- Shows in real-time after check-in
- Includes staff name, assistance, notes

---

## 🎯 Inputs

### Check-In Data
```typescript
interface CheckInInput {
  assistance_requested: AssistanceType[];
  visit_notes?: string;
}

interface CheckInData {
  patient_id: string;
  staff_user_id: string;
  check_in_timestamp: Date;
  visit_type: 'returning'; // 'intake' only for new patients
  assistance_requested: AssistanceType[];
  visit_notes?: string;
}
```

### Patient Context
- Patient ID (from Patient Summary)
- Patient name (for display in modal)
- Last visit date (to show in modal)
- Current staff user ID (from auth context)

---

## 📤 Outputs

### File Structure
```
src/
├── features/
│   ├── checkin/
│   │   ├── components/
│   │   │   ├── CheckInModal.tsx + CheckInModal.test.tsx
│   │   │   ├── AssistanceSelector.tsx + AssistanceSelector.test.tsx
│   │   │   └── CheckInSuccess.tsx + CheckInSuccess.test.tsx
│   │   ├── hooks/
│   │   │   └── useCheckIn.ts + useCheckIn.test.ts
│   │   ├── services/
│   │   │   └── visitService.ts + visitService.test.ts
│   │   └── types.ts
│   └── components/
│       └── common/
│           ├── Modal.tsx + Modal.test.tsx
│           └── Toast.tsx + Toast.test.tsx
```

### Deliverables
1. Working check-in modal
2. Visit creation with all data
3. Patient visit_count auto-increments
4. Patient last_visit_date auto-updates
5. Duplicate check-in prevention
6. Success notifications
7. All components tested
8. All services tested

---

## 📦 Dependencies & Imports

### New Packages
```json
{
  "dependencies": {
    "react-hot-toast": "^2.4.1"
  }
}
```

### Import Examples
```typescript
// Visit service
import { supabase } from '@/lib/supabase';
import type { Visit, CheckInInput } from '@/types';
import { mockVisits } from '@/__mocks__/data';

// Check-in modal
import { useCheckIn } from '@/features/checkin/hooks/useCheckIn';
import { AssistanceSelector } from '@/features/checkin/components/AssistanceSelector';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { TextArea } from '@/components/common/TextArea';
import toast from 'react-hot-toast';

// Constants
import { ASSISTANCE_TYPES } from '@/constants/assistanceTypes';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] Staff can click "Check In This Patient" button
- [ ] Check-in modal opens with patient name
- [ ] Modal shows last visit date and days ago
- [ ] Staff can select multiple assistance types
- [ ] Staff can add optional notes
- [ ] Clicking "Confirm Check-In" creates visit
- [ ] Visit record created with correct timestamp
- [ ] Patient visit_count increments by 1
- [ ] Patient last_visit_date updates to today
- [ ] Success message shows after check-in
- [ ] Modal closes after successful check-in
- [ ] Patient Summary refreshes with new data
- [ ] New visit appears in Visit History
- [ ] Cannot check in same patient twice in one day

### Technical Requirements
- [ ] Database trigger updates patient.visit_count
- [ ] Database trigger updates patient.last_visit_date
- [ ] Check-in uses database transaction
- [ ] Duplicate check happens before insert
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Check-in completes in < 1 second
- [ ] Modal opens instantly
- [ ] No UI lag during submission

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for check-in features
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used for assistance types

### Functionality
- [ ] Check-in creates visit record
- [ ] Visit_count increments correctly
- [ ] Last_visit_date updates correctly
- [ ] Duplicate check-in prevented
- [ ] Success notification shows
- [ ] Error handling works
- [ ] Modal UX is smooth

### Testing
- [ ] visitService.test.ts covers all methods
- [ ] useCheckIn.test.ts covers hook logic
- [ ] CheckInModal.test.tsx covers user interactions
- [ ] AssistanceSelector.test.tsx covers selection logic
- [ ] Tests verify database triggers work
- [ ] Tests use mockPatients and mockVisits
- [ ] Edge cases tested (duplicate, network error)

### Database
- [ ] Trigger for visit_count works
- [ ] Trigger for last_visit_date works
- [ ] Triggers tested manually
- [ ] Transaction rollback works on error

### UI/UX
- [ ] Modal is centered and responsive
- [ ] Assistance checkboxes are clear
- [ ] Notes textarea is adequate size
- [ ] Loading state shows during submission
- [ ] Success message is clear
- [ ] Error messages are helpful
- [ ] Modal closes smoothly

### Documentation
- [ ] Function comments added
- [ ] Database triggers documented
- [ ] Check-in flow documented
- [ ] Component props documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (logical units)
- [ ] Branch: `feat/manual-checkin`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### visitService.test.ts
```typescript
describe('visitService', () => {
  describe('checkInPatient', () => {
    it('creates visit record with current timestamp');
    it('sets visit_type to "returning"');
    it('includes staff_user_id from current user');
    it('saves assistance_requested array');
    it('saves visit_notes if provided');
    it('returns created visit with ID');
    it('throws error if patient not found');
    it('throws error if patient already checked in today');
    it('throws error on database failure');
  });
  
  describe('isAlreadyCheckedInToday', () => {
    it('returns true if patient has visit today');
    it('returns false if patient has no visit today');
    it('returns false if patient last visit was yesterday');
    it('handles timezone correctly');
  });
  
  describe('getVisitHistory', () => {
    it('returns visits sorted by check_in_timestamp desc');
    it('includes staff_name in each visit');
    it('paginates results correctly');
    it('returns empty array if no visits');
  });
  
  describe('getActiveVisit', () => {
    it('returns visit if patient currently checked in');
    it('returns null if patient not checked in');
    it('only returns visits without check_out_timestamp');
  });
});
```

### useCheckIn.test.ts
```typescript
describe('useCheckIn', () => {
  it('returns checkIn function');
  it('returns isLoading state');
  it('returns error state');
  it('sets isLoading true during check-in');
  it('sets isLoading false after success');
  it('sets isLoading false after error');
  it('calls visitService.checkInPatient with correct data');
  it('sets error on check-in failure');
  it('clears error on successful check-in');
  it('calls onSuccess callback after successful check-in');
});
```

### CheckInModal.test.tsx
```typescript
describe('CheckInModal', () => {
  it('renders patient name');
  it('renders last visit date');
  it('calculates days since last visit');
  it('renders assistance checkboxes');
  it('renders notes textarea');
  it('renders Confirm and Cancel buttons');
  it('closes modal on Cancel click');
  it('disables Confirm button when no assistance selected');
  it('enables Confirm button when assistance selected');
  it('shows loading state during submission');
  it('disables all inputs during submission');
  it('calls onCheckIn with selected assistance and notes');
  it('shows success toast on successful check-in');
  it('shows error toast on check-in failure');
  it('closes modal after successful check-in');
  it('does not close modal on error');
  it('clears form after successful check-in');
});
```

### AssistanceSelector.test.tsx
```typescript
describe('AssistanceSelector', () => {
  it('renders all assistance type checkboxes');
  it('renders assistance types from constants');
  it('calls onChange when checkbox clicked');
  it('allows multiple selections');
  it('shows selected checkboxes as checked');
  it('shows "Other" text input when Other selected');
  it('hides "Other" text input when Other not selected');
  it('includes "Other" text in onChange callback');
});
```

### Database Trigger Tests (Manual)
```sql
-- Test visit_count increment
INSERT INTO visits (patient_id, ...) VALUES ('patient-001', ...);
SELECT visit_count FROM patients WHERE id = 'patient-001';
-- Should be incremented by 1

-- Test last_visit_date update
INSERT INTO visits (patient_id, check_in_timestamp, ...) 
VALUES ('patient-001', NOW(), ...);
SELECT last_visit_date FROM patients WHERE id = 'patient-001';
-- Should be today's date
```

---

## 📝 Implementation Order

### Day 1: Visit Service & Database Triggers
1. Create database trigger for visit_count increment
2. Create database trigger for last_visit_date update
3. Test triggers manually
4. Write visitService.test.ts (all test cases)
5. Implement visitService.ts
6. Test visit creation manually

### Day 2: Check-In Hook
1. Write useCheckIn.test.ts
2. Implement useCheckIn hook
3. Test hook with mock data
4. Verify error handling

### Day 3: Assistance Selector Component
1. Write AssistanceSelector.test.tsx
2. Implement AssistanceSelector component
3. Test multi-select behavior
4. Test "Other" text input

### Day 4: Check-In Modal
1. Write CheckInModal.test.tsx
2. Implement CheckInModal component
3. Wire up AssistanceSelector
4. Add form validation
5. Add loading states

### Day 5: Modal & Toast Components
1. Write Modal.test.tsx (if not exists)
2. Implement Modal component
3. Write Toast.test.tsx (or use react-hot-toast)
4. Integrate toast notifications
5. Test modal open/close behavior

### Day 6: Integration with Patient Summary
1. Add "Check In This Patient" button to PatientActions
2. Wire up modal trigger
3. Pass patient data to modal
4. Handle success callback (refresh patient data)
5. Test full flow end-to-end

### Day 7: Polish, Testing & Documentation
1. Test duplicate check-in prevention
2. Test all error scenarios
3. Manual testing of full flow
4. Fix any bugs
5. Ensure all tests pass
6. Code review and refactor
7. Update documentation
8. Demo to stakeholders

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database trigger doesn't fire | High | Test triggers thoroughly, add fallback logic |
| Race condition on duplicate check | Medium | Use database transaction with lock |
| Modal UX feels slow | Medium | Optimize rendering, use optimistic updates |
| Timezone issues with "today" check | Medium | Use UTC consistently, test edge cases |

---

## 📊 Success Metrics

- Check-in completes in < 1 second
- 100% of check-ins create visit record
- 100% of check-ins update patient.visit_count
- 100% of check-ins update patient.last_visit_date
- 0% duplicate check-ins on same day
- All 5 components created with tests
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Previous**: Sprint 2 (Patient Search & Lookup) - provides Patient Summary
- **Next**: Sprint 4 (Patient Intake Part 1) - uses similar form patterns
- **Blocks**: Sprint 6 (Analytics) - needs visit data to analyze
