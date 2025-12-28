# Sprint 1: Foundation & Authentication

**Duration**: 1 week  
**Goal**: Set up project foundation, database schema, and authentication system

---

## 📋 Features

### 1. Project Setup
- Initialize React + Vite + TypeScript project
- Configure TailwindCSS + shadcn/ui
- Set up folder structure per architecture
- Configure ESLint, Prettier, TypeScript strict mode

### 2. Database Schema
- Create Supabase project
- Implement all database tables (patients, visits, minor_children, emergency_contacts, disclosure_forms, users)
- Add indexes for analytics queries
- Create database triggers for visit_count updates

### 3. Constants Files
- Create all constants files (states, cancer types, ethnicities, languages, education levels, assistance types, oncologists, employment statuses, marital statuses, insurance types, referral sources, treatment types, frequencies)

### 4. Authentication System
- Implement Supabase Auth integration
- Create login page
- Create protected route wrapper
- Implement role-based access control (admin, staff, viewer)

### 5. Base Components (Atoms)
- Button, Input, Select, Checkbox, Radio, TextArea, DateInput, TimeInput
- Card, Badge, Alert
- All with proper TypeScript types

---

## 🎯 Inputs

### Configuration
- Vite config for path aliases (@/components, @/features, etc.)
- TailwindCSS config with custom colors matching support house branding
- TypeScript config with strict mode enabled

### Environment Variables
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Design Tokens
- Primary color: Support house brand color
- Font: System font stack
- Spacing scale: Tailwind default

---

## 📤 Outputs

### Project Structure
```
support-house-app/
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Button.tsx + Button.test.tsx
│   │       ├── Input.tsx + Input.test.tsx
│   │       ├── Select.tsx + Select.test.tsx
│   │       ├── Checkbox.tsx + Checkbox.test.tsx
│   │       ├── Radio.tsx + Radio.test.tsx
│   │       ├── TextArea.tsx + TextArea.test.tsx
│   │       ├── DateInput.tsx + DateInput.test.tsx
│   │       ├── TimeInput.tsx + TimeInput.test.tsx
│   │       ├── Card.tsx + Card.test.tsx
│   │       ├── Badge.tsx + Badge.test.tsx
│   │       └── Alert.tsx + Alert.test.tsx
│   ├── constants/
│   │   ├── states.ts
│   │   ├── cancerTypes.ts
│   │   ├── ethnicities.ts
│   │   ├── languages.ts
│   │   ├── educationLevels.ts
│   │   ├── assistanceTypes.ts
│   │   ├── oncologists.ts
│   │   ├── employmentStatuses.ts
│   │   ├── maritalStatuses.ts
│   │   ├── insuranceTypes.ts
│   │   ├── referralSources.ts
│   │   ├── treatmentTypes.ts
│   │   ├── frequencies.ts
│   │   └── index.ts
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx + LoginForm.test.tsx
│   │       │   └── ProtectedRoute.tsx + ProtectedRoute.test.tsx
│   │       ├── hooks/
│   │       │   └── useAuth.ts + useAuth.test.ts
│   │       ├── services/
│   │       │   └── authService.ts + authService.test.ts
│   │       └── types.ts
│   ├── lib/
│   │   └── supabase.ts
│   └── types/
│       ├── database.ts
│       └── index.ts
├── supabase/
│   └── migrations/
│       ├── 001_create_users_table.sql
│       ├── 002_create_patients_table.sql
│       ├── 003_create_visits_table.sql
│       ├── 004_create_minor_children_table.sql
│       ├── 005_create_emergency_contacts_table.sql
│       ├── 006_create_disclosure_forms_table.sql
│       ├── 007_create_form_submissions_table.sql
│       ├── 008_add_indexes.sql
│       └── 009_create_triggers.sql
```

### Deliverables
1. Working React app with authentication
2. Database schema deployed to Supabase
3. All constants files populated
4. All base components with tests
5. Login page functional
6. Protected routes working

---

## 📦 Dependencies & Imports

### NPM Packages
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.21.0",
    "@supabase/supabase-js": "^2.39.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.4.7",
    "zod": "^3.22.4",
    "react-hook-form": "^7.49.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.309.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.11",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "eslint": "^8.56.0",
    "prettier": "^3.1.1",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "vitest": "^1.1.0",
    "jsdom": "^23.0.1"
  }
}
```

### Import Examples
```typescript
// Auth service
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Components
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// Constants
import { STATES } from '@/constants/states';
import { CANCER_TYPES } from '@/constants/cancerTypes';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] User can log in with email/password
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to dashboard
- [ ] Protected routes redirect to login if not authenticated
- [ ] User role is checked for route access
- [ ] All base components render correctly
- [ ] All constants are accessible and typed

### Technical Requirements
- [ ] TypeScript compiles with no errors
- [ ] All tests pass (100% coverage for completed features)
- [ ] ESLint shows no warnings
- [ ] Database schema matches architecture
- [ ] All indexes created
- [ ] Database triggers working (visit_count auto-updates)

### Performance Requirements
- [ ] Login completes in < 2 seconds
- [ ] Page loads in < 1 second
- [ ] No console errors or warnings

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for auth features
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used (no hardcoded values)

### Functionality
- [ ] Login works with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Protected routes enforce authentication
- [ ] Role-based access control working
- [ ] All base components functional
- [ ] All constants accessible

### Testing
- [ ] authService.test.ts covers all methods
- [ ] useAuth.test.ts covers all hook logic
- [ ] LoginForm.test.tsx covers user interactions
- [ ] ProtectedRoute.test.tsx covers auth checks
- [ ] All component tests use React Testing Library
- [ ] Tests use mock data from __mocks__/data/

### Database
- [ ] All tables created successfully
- [ ] All indexes created
- [ ] Triggers working (tested manually)
- [ ] Can insert/query test data
- [ ] RLS policies configured (if applicable)

### Documentation
- [ ] Function comments added
- [ ] Complex logic explained
- [ ] README updated with setup instructions
- [ ] Environment variables documented

### Git
- [ ] Committed with verbose commit message
- [ ] Commit follows git guidelines
- [ ] Branch: `feat/foundation-auth`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### authService.test.ts
```typescript
describe('authService', () => {
  describe('login', () => {
    it('returns user and session on valid credentials');
    it('throws error on invalid credentials');
    it('throws error on network failure');
  });
  
  describe('logout', () => {
    it('clears session successfully');
    it('handles logout when not logged in');
  });
  
  describe('getCurrentUser', () => {
    it('returns current user if authenticated');
    it('returns null if not authenticated');
  });
  
  describe('getSession', () => {
    it('returns current session if exists');
    it('returns null if no session');
  });
});
```

### useAuth.test.ts
```typescript
describe('useAuth', () => {
  it('returns null user when not authenticated');
  it('returns user when authenticated');
  it('login function updates user state');
  it('logout function clears user state');
  it('isLoading is true during login');
  it('error is set on login failure');
});
```

### LoginForm.test.tsx
```typescript
describe('LoginForm', () => {
  it('renders email and password inputs');
  it('shows error for empty email');
  it('shows error for invalid email format');
  it('shows error for empty password');
  it('calls onSubmit with email and password');
  it('shows loading state during submission');
  it('displays error message on login failure');
  it('redirects on successful login');
});
```

### Component Tests (Button.test.tsx example)
```typescript
describe('Button', () => {
  it('renders children correctly');
  it('calls onClick when clicked');
  it('applies variant styles correctly');
  it('shows loading spinner when loading=true');
  it('is disabled when disabled=true');
  it('applies custom className');
});
```

---

## 📝 Implementation Order

### Day 1: Project Setup
1. Create Vite project
2. Install dependencies
3. Configure Tailwind, TypeScript, ESLint
4. Set up folder structure
5. Create Supabase project

### Day 2: Database Schema
1. Write migration files
2. Run migrations
3. Test database with sample data
4. Create TypeScript types from schema

### Day 3: Constants & Base Components
1. Create all constants files with tests
2. Create Button, Input, Select with tests
3. Create Checkbox, Radio, TextArea with tests
4. Create DateInput, TimeInput with tests

### Day 4: More Components & Auth Service
1. Create Card, Badge, Alert with tests
2. Write authService tests
3. Implement authService
4. Test auth service manually

### Day 5: Auth Hooks & Components
1. Write useAuth tests
2. Implement useAuth hook
3. Write LoginForm tests
4. Implement LoginForm component
5. Write ProtectedRoute tests
6. Implement ProtectedRoute

### Day 6: Integration & Testing
1. Create login page
2. Test full auth flow
3. Fix any bugs
4. Ensure all tests pass
5. Manual testing

### Day 7: Polish & Documentation
1. Code review
2. Refactor if needed
3. Update documentation
4. Prepare for Sprint 2
5. Demo to stakeholders

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase setup issues | High | Have backup local Postgres option |
| TypeScript configuration problems | Medium | Use proven tsconfig template |
| Test setup complexity | Medium | Start with simple tests, iterate |
| Scope creep | High | Stick to DoD, defer extras to Sprint 2 |

---

## 📊 Success Metrics

- All 11 base components created with tests
- 13 constants files created
- 9 database migrations successful
- Auth system functional (login/logout/protected routes)
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Next**: Sprint 2 (Patient Search & Lookup) - depends on auth and base components
- **Blocks**: All future sprints depend on this foundation
