# Sprint 2: Patient Search & Lookup

**Duration**: 1 week  
**Goal**: Build fast patient search and patient summary view

---

## 📋 Features

### 1. Patient Search
- Search input with real-time filtering
- Search by: name, DOB, phone, email, ZIP
- Debounced search (300ms delay)
- Results list with key patient info
- Empty state when no results
- Loading state during search

### 2. Search Results Display
- Patient card showing: name, DOB (age), phone, city/ZIP, last visit, visit count
- Click to open Patient Summary
- Highlight search term in results
- Sort options (name, last visit, visit count)

### 3. Patient Summary View
- Complete patient information display
- Identity & contact section
- Demographics section
- Household section
- Emergency contact section
- Visit statistics (last visit, total visits, days since last visit)
- Action buttons (Check In, Edit, View History)
- Alert flags (missing fields, no recent visits)

### 4. Visit History Component
- Timeline view of all visits
- Each visit shows: date/time, staff, assistance, notes
- Expandable details
- Pagination for patients with many visits

---

## 🎯 Inputs

### Search Query
```typescript
interface SearchQuery {
  term?: string;           // General search term
  name?: string;          // Specific name search
  dob?: Date;             // Date of birth
  phone?: string;         // Any phone number
  email?: string;         // Email address
  zip?: string;           // ZIP code
}
```

### Patient Data (from database)
- Full patient record with all fields
- Related emergency contact
- Related minor children
- Visit history with staff names

---

## 📤 Outputs

### File Structure
```
src/
├── features/
│   ├── lookup/
│   │   ├── components/
│   │   │   ├── PatientSearch.tsx + PatientSearch.test.tsx
│   │   │   ├── SearchResults.tsx + SearchResults.test.tsx
│   │   │   ├── SearchFilters.tsx + SearchFilters.test.tsx
│   │   │   └── PatientCard.tsx + PatientCard.test.tsx
│   │   ├── hooks/
│   │   │   └── usePatientSearch.ts + usePatientSearch.test.ts
│   │   ├── services/
│   │   │   └── searchService.ts + searchService.test.ts
│   │   └── types.ts
│   ├── patients/
│   │   ├── components/
│   │   │   ├── PatientSummary.tsx + PatientSummary.test.tsx
│   │   │   ├── PatientIdentityCard.tsx + PatientIdentityCard.test.tsx
│   │   │   ├── PatientDemographics.tsx + PatientDemographics.test.tsx
│   │   │   ├── PatientHousehold.tsx + PatientHousehold.test.tsx
│   │   │   ├── PatientEmergencyContact.tsx + PatientEmergencyContact.test.tsx
│   │   │   ├── PatientVisitStats.tsx + PatientVisitStats.test.tsx
│   │   │   ├── PatientFlags.tsx + PatientFlags.test.tsx
│   │   │   ├── VisitHistory.tsx + VisitHistory.test.tsx
│   │   │   ├── VisitCard.tsx + VisitCard.test.tsx
│   │   │   └── PatientActions.tsx + PatientActions.test.tsx
│   │   ├── hooks/
│   │   │   ├── usePatient.ts + usePatient.test.ts
│   │   │   └── useVisitHistory.ts + useVisitHistory.test.ts
│   │   ├── services/
│   │   │   └── patientService.ts + patientService.test.ts
│   │   └── types.ts
│   └── components/
│       └── forms/
│           ├── FormField.tsx + FormField.test.tsx
│           ├── FormSection.tsx + FormSection.test.tsx
│           └── FormGrid.tsx + FormGrid.test.tsx
├── pages/
│   ├── SearchPage.tsx + SearchPage.test.tsx
│   └── PatientDetailPage.tsx + PatientDetailPage.test.tsx
└── utils/
    ├── formatters.ts + formatters.test.ts
    └── dateUtils.ts + dateUtils.test.ts
```

### Deliverables
1. Working patient search with debouncing
2. Search results displaying correctly
3. Patient summary view with all sections
4. Visit history timeline
5. All components tested
6. All services tested

---

## 📦 Dependencies & Imports

### New Packages
```json
{
  "dependencies": {
    "use-debounce": "^10.0.0"
  }
}
```

### Import Examples
```typescript
// Search service
import { supabase } from '@/lib/supabase';
import type { Patient, SearchQuery } from '@/types';
import { mockPatients } from '@/__mocks__/data';

// Search component
import { usePatientSearch } from '@/features/lookup/hooks/usePatientSearch';
import { SearchResults } from '@/features/lookup/components/SearchResults';
import { Input } from '@/components/common/Input';

// Patient summary
import { usePatient } from '@/features/patients/hooks/usePatient';
import { PatientIdentityCard } from '@/features/patients/components/PatientIdentityCard';
import { formatPhoneNumber, formatDate } from '@/utils/formatters';
import { calculateAge } from '@/utils/dateUtils';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] User can search patients by name
- [ ] Search works with partial matches
- [ ] Search by phone finds patient with any of 3 phone numbers
- [ ] Search by DOB finds exact matches
- [ ] Search results show within 300ms of typing
- [ ] Clicking result opens patient summary
- [ ] Patient summary shows all patient data
- [ ] Visit history displays in reverse chronological order
- [ ] Empty state shows when no results
- [ ] Loading state shows during search

### Technical Requirements
- [ ] Search is debounced (not hitting DB on every keystroke)
- [ ] Search uses database indexes for performance
- [ ] Patient data fetched with single query (includes relations)
- [ ] Visit history paginated (10 per page)
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Search completes in < 500ms
- [ ] Patient summary loads in < 1 second
- [ ] Visit history loads in < 500ms
- [ ] No unnecessary re-renders

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for search and patient features
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used for all dropdown options

### Functionality
- [ ] Search works for all search fields
- [ ] Results display correctly
- [ ] Patient summary shows all data
- [ ] Visit history displays correctly
- [ ] Action buttons present (not functional yet)
- [ ] Flags show for missing data

### Testing
- [ ] searchService.test.ts covers all search scenarios
- [ ] usePatientSearch.test.ts covers debouncing and state
- [ ] PatientSearch.test.tsx covers user interactions
- [ ] PatientSummary.test.tsx covers all sections
- [ ] VisitHistory.test.tsx covers pagination
- [ ] All tests use mockPatients and mockVisits
- [ ] Edge cases tested (no results, network errors)

### UI/UX
- [ ] Search input has placeholder text
- [ ] Loading spinner shows during search
- [ ] Empty state has helpful message
- [ ] Patient cards are readable and scannable
- [ ] Patient summary is well-organized
- [ ] Visit history is easy to read
- [ ] Mobile responsive (basic)

### Documentation
- [ ] Function comments added
- [ ] Search algorithm explained
- [ ] Complex queries documented
- [ ] Component props documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (not one giant commit)
- [ ] Branch: `feat/patient-search-lookup`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### searchService.test.ts
```typescript
describe('searchService', () => {
  describe('searchPatients', () => {
    it('finds patient by exact first name');
    it('finds patient by partial first name');
    it('finds patient by exact last name');
    it('finds patient by partial last name');
    it('finds patient by "goes by" name');
    it('finds patient by primary phone');
    it('finds patient by second phone');
    it('finds patient by other phone');
    it('finds patient by partial phone');
    it('finds patient by email');
    it('finds patient by ZIP code');
    it('finds patient by DOB');
    it('returns empty array when no matches');
    it('returns multiple patients when multiple matches');
    it('sorts results by last_visit_date desc by default');
    it('handles network errors gracefully');
  });
  
  describe('quickSearch', () => {
    it('searches across all fields with single term');
    it('prioritizes exact matches over partial');
  });
});
```

### patientService.test.ts
```typescript
describe('patientService', () => {
  describe('getPatient', () => {
    it('returns patient with all fields');
    it('includes emergency contact');
    it('includes minor children');
    it('calculates age from DOB');
    it('calculates days_since_last_visit');
    it('throws error if patient not found');
  });
  
  describe('getPatientWithVisits', () => {
    it('returns patient with visit history');
    it('includes staff names in visits');
    it('sorts visits by check_in_timestamp desc');
    it('limits visits to specified page size');
  });
});
```

### usePatientSearch.test.ts
```typescript
describe('usePatientSearch', () => {
  it('debounces search input by 300ms');
  it('sets isLoading true during search');
  it('sets isLoading false after search completes');
  it('updates results when search completes');
  it('clears results when search term is empty');
  it('sets error on search failure');
  it('cancels previous search if new search starts');
});
```

### PatientSearch.test.tsx
```typescript
describe('PatientSearch', () => {
  it('renders search input');
  it('shows placeholder text');
  it('updates search term on input');
  it('shows loading spinner during search');
  it('displays search results');
  it('shows empty state when no results');
  it('shows error message on search failure');
  it('calls onSelectPatient when result clicked');
});
```

### PatientSummary.test.tsx
```typescript
describe('PatientSummary', () => {
  it('displays patient name and DOB');
  it('displays current age calculated from DOB');
  it('displays "goes by" name if present');
  it('displays all 3 phone numbers');
  it('displays email');
  it('displays full address');
  it('displays demographics (status, ethnicity, language)');
  it('displays insurance info');
  it('displays employment info');
  it('displays marital status and spouse info');
  it('displays caregiver info if present');
  it('displays guardian info for child patients');
  it('displays emergency contact');
  it('displays minor children count');
  it('displays visit statistics');
  it('displays last visit date');
  it('displays total visit count');
  it('displays days since last visit');
  it('shows flag for missing critical fields');
  it('shows flag for no recent visits (>6 months)');
  it('renders action buttons');
});
```

### VisitHistory.test.tsx
```typescript
describe('VisitHistory', () => {
  it('displays visits in reverse chronological order');
  it('shows visit date and time');
  it('shows staff name');
  it('shows assistance requested');
  it('shows visit notes');
  it('shows "INTAKE" label for first visit');
  it('paginates results (10 per page)');
  it('shows "Load More" button if more visits exist');
  it('expands visit details on click');
  it('shows empty state if no visits');
});
```

---

## 📝 Implementation Order

### Day 1: Search Service & Tests
1. Write searchService.test.ts (all test cases)
2. Implement searchService.ts
3. Test search queries manually in Supabase
4. Optimize queries with indexes

### Day 2: Patient Service & Tests
1. Write patientService.test.ts (all test cases)
2. Implement patientService.ts
3. Test patient queries manually
4. Verify all relations loaded correctly

### Day 3: Search UI Components
1. Write usePatientSearch.test.ts
2. Implement usePatientSearch hook
3. Write PatientSearch.test.tsx
4. Implement PatientSearch component
5. Write SearchResults.test.tsx
6. Implement SearchResults component
7. Write PatientCard.test.tsx
8. Implement PatientCard component

### Day 4: Patient Summary Components (Part 1)
1. Write PatientSummary.test.tsx
2. Implement PatientSummary container
3. Write PatientIdentityCard.test.tsx
4. Implement PatientIdentityCard
5. Write PatientDemographics.test.tsx
6. Implement PatientDemographics
7. Write PatientHousehold.test.tsx
8. Implement PatientHousehold

### Day 5: Patient Summary Components (Part 2)
1. Write PatientEmergencyContact.test.tsx
2. Implement PatientEmergencyContact
3. Write PatientVisitStats.test.tsx
4. Implement PatientVisitStats
5. Write PatientFlags.test.tsx
6. Implement PatientFlags
7. Write PatientActions.test.tsx (buttons only, not functional)
8. Implement PatientActions

### Day 6: Visit History
1. Write VisitHistory.test.tsx
2. Implement VisitHistory component
3. Write VisitCard.test.tsx
4. Implement VisitCard component
5. Write useVisitHistory.test.ts
6. Implement useVisitHistory hook
7. Test pagination

### Day 7: Integration, Polish & Testing
1. Create SearchPage
2. Create PatientDetailPage
3. Wire up routing
4. Manual end-to-end testing
5. Fix bugs
6. Ensure all tests pass
7. Code review and refactor
8. Update documentation

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Search performance slow | High | Use database indexes, limit results to 50 |
| Complex patient data structure | Medium | Break into smaller components |
| Too many API calls | Medium | Fetch patient with all relations in one query |
| Visit history pagination complex | Medium | Use Supabase built-in pagination |

---

## 📊 Success Metrics

- Search returns results in < 500ms
- Patient summary loads in < 1 second
- All 20+ components created with tests
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings
- Search works for all fields (name, DOB, phone, email, ZIP)

---

## 🔗 Related Sprints

- **Previous**: Sprint 1 (Foundation & Auth) - provides base components and auth
- **Next**: Sprint 3 (Manual Check-In) - uses Patient Summary as starting point
- **Blocks**: Sprint 3, Sprint 4, Sprint 5 (all need patient lookup)
