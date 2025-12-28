# Sprint Planning Overview

## 🎯 Project: Support House Patient Management System

**Total Duration**: 8 weeks (56 days)  
**Methodology**: Test-Driven Development (TDD) with Agile sprints  
**Team Size**: 1-3 developers

---

## 📅 Sprint Breakdown

### **Sprint 1: Foundation & Authentication** (Week 1)
**Goal**: Set up project foundation, database schema, and authentication

**Key Deliverables**:
- React + Vite + TypeScript project setup
- Supabase database with all tables
- All constants files (13 files)
- Base components (11 components)
- Authentication system (login, protected routes)

**Files Created**: ~50 files (components, tests, migrations, constants)

---

### **Sprint 2: Patient Search & Lookup** (Week 2)
**Goal**: Build fast patient search and patient summary view

**Key Deliverables**:
- Patient search with debouncing
- Search results display
- Patient summary view (complete patient info)
- Visit history timeline
- All patient detail sections

**Files Created**: ~40 files (components, services, hooks, tests)

---

### **Sprint 3: Manual Check-In System** (Week 3)
**Goal**: Implement manual check-in flow to track physical visits

**Key Deliverables**:
- Check-in modal with assistance selector
- Visit creation with timestamps
- Patient visit_count auto-increment
- Patient last_visit_date auto-update
- Duplicate check-in prevention

**Files Created**: ~15 files (components, services, hooks, tests)

---

### **Sprint 4: Patient Intake Form (Part 1)** (Weeks 4-5)
**Goal**: Build Step 1 (Patient Information) of multi-step intake form

**Key Deliverables**:
- Multi-step form container with progress indicator
- Step 1 with all 9 sections
- Form validation with Zod
- Conditional sections (guardian, spouse)
- Dynamic minor children list
- Draft save/load functionality

**Files Created**: ~50 files (form sections, components, schemas, tests)

---

### **Sprint 5: Patient Intake Form (Part 2)** (Weeks 6-7)
**Goal**: Build Steps 2, 3, 4 and complete submission flow

**Key Deliverables**:
- Step 2: Medical Information (5 sections)
- Step 3: Disclosure Authorization (7 sections)
- Step 4: Review & Submit
- Form submission with database transaction
- PDF generation for disclosure form
- Success flow with redirect

**Files Created**: ~45 files (form sections, services, PDF templates, tests)

---

### **Sprint 6: Analytics Dashboard** (Week 8)
**Goal**: Build analytics dashboard with grant-ready metrics

**Key Deliverables**:
- Dashboard with overview cards
- 10+ charts (demographics, visits, assistance)
- Date range filtering
- Additional filters (cancer type, state, ethnicity)
- CSV export

**Files Created**: ~30 files (charts, hooks, services, utils, tests)

---

### **Sprint 7: Reporting & Export** (Week 9)
**Goal**: Build pre-built report templates and advanced export

**Key Deliverables**:
- 5 report templates
- Report builder UI
- CSV, PDF, Excel export
- Report preview
- Report history

**Files Created**: ~25 files (templates, generators, components, tests)

---

### **Sprint 8: Polish & Production** (Week 10)
**Goal**: Final polish, testing, documentation, and deployment

**Key Deliverables**:
- Edit patient functionality
- Accessibility improvements (WCAG 2.1 AA)
- Error handling & logging
- Performance optimization
- E2E test suite
- Complete documentation (6 guides)
- Production deployment

**Files Created**: ~20 files (E2E tests, docs, error handling, tests)

---

## 📊 Total Project Scope

### **Files Created**: ~275 files
- Components: ~80
- Tests: ~80
- Services: ~15
- Hooks: ~20
- Constants: ~15
- Migrations: ~10
- Documentation: ~10
- E2E Tests: ~5
- Utilities: ~15
- Pages: ~10
- Schemas: ~5
- Templates: ~10

### **Lines of Code**: ~35,000-40,000 lines
- Production code: ~20,000 lines
- Test code: ~15,000 lines
- Documentation: ~5,000 lines

### **Test Coverage**: ≥ 90% across all sprints

---

## 🔄 Development Workflow (Every Sprint)

### **TDD Cycle** (Repeat for each feature)
1. **Write Tests First** - Define expected behavior
2. **Run Tests** - Watch them fail (red)
3. **Implement Feature** - Write minimal code to pass
4. **Run Tests** - Watch them pass (green)
5. **Refactor** - Improve code while keeping tests green
6. **Commit** - Verbose commit message

### **Daily Workflow**
- Morning: Review sprint goals, plan day's tasks
- Development: TDD cycle for each feature
- Testing: Run full test suite regularly
- Evening: Commit work, update progress

### **End of Sprint**
- Code review
- Manual testing
- Update documentation
- Demo to stakeholders
- Retrospective
- Plan next sprint

---

## 📋 Definition of Done (Every Sprint)

### **Code Quality**
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100%)
- [ ] Test coverage ≥ 90%
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used (no hardcoded values)

### **Functionality**
- [ ] Feature works as specified
- [ ] All edge cases handled
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Success/error messages shown

### **Testing**
- [ ] Unit tests for all services
- [ ] Unit tests for all hooks
- [ ] Component tests for all UI
- [ ] Integration tests for critical flows
- [ ] Tests use mock data from `__mocks__/data/`

### **Documentation**
- [ ] Function comments added
- [ ] Complex logic explained
- [ ] Component props documented
- [ ] README updated if needed

### **Git**
- [ ] Committed with verbose messages
- [ ] Multiple commits (logical units)
- [ ] Branch named correctly
- [ ] No commented-out code
- [ ] No console.logs

---

## 🚀 Getting Started

### **Before Sprint 1**
1. Read ARCHITECTURE.md
2. Read DEVELOPMENT_PRACTICES.md
3. Read GIT_COMMIT_GUIDELINES.md
4. Read COMMENTS.md
5. Review mock data in `__mocks__/data/`
6. Set up development environment

### **Starting Each Sprint**
1. Read sprint markdown file thoroughly
2. Understand inputs, outputs, expected outcomes
3. Review file structure
4. Set up test files FIRST
5. Follow implementation order
6. Check Definition of Done regularly

---

## 📚 Key Resources

### **Coding Practices**
- `coding_practices/DEVELOPMENT_PRACTICES.md` - TDD workflow, DoD
- `coding_practices/GIT_COMMIT_GUIDELINES.md` - Commit message format
- `coding_practices/COMMENTS.md` - Function comment standards
- `coding_practices/TYPESCRIPT_STANDARDS.md` - Type safety rules

### **Mock Data**
- `__mocks__/data/mockPatients.ts` - 3 test patients
- `__mocks__/data/mockVisits.ts` - Visit records
- `__mocks__/data/mockUsers.ts` - Staff users

### **Architecture**
- `ARCHITECTURE.md` - Complete technical architecture
- `IMPLEMENTATION_SUMMARY.md` - Executive summary

---

## 🎯 Success Criteria

### **Sprint Success**
- All DoD items checked ✓
- All tests passing ✓
- Feature works as specified ✓
- Code reviewed ✓
- Committed with verbose messages ✓

### **Project Success**
- All 8 sprints completed ✓
- Production deployment successful ✓
- Test coverage ≥ 90% ✓
- Documentation complete ✓
- Zero critical bugs ✓
- Stakeholder approval ✓

---

## 🔗 Sprint Dependencies

```
Sprint 1 (Foundation)
    ↓
Sprint 2 (Search & Lookup)
    ↓
Sprint 3 (Check-In) ←─────────┐
    ↓                          │
Sprint 4 (Intake Part 1)       │
    ↓                          │
Sprint 5 (Intake Part 2)       │
    ↓                          │
Sprint 6 (Analytics) ←─────────┘
    ↓
Sprint 7 (Reporting)
    ↓
Sprint 8 (Polish & Production)
```

**Critical Path**: Sprint 1 → 2 → 3 → 5 → 6 → 8

---

## 📞 Support

For questions or issues:
1. Review sprint markdown file
2. Check ARCHITECTURE.md
3. Review DEVELOPMENT_PRACTICES.md
4. Check TROUBLESHOOTING.md (Sprint 8)

---

**Ready to build! Let's create something amazing! 🚀**
