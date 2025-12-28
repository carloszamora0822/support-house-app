# Sprint 6: Analytics Dashboard

**Duration**: 1 week  
**Goal**: Build analytics dashboard with grant-ready metrics and visualizations

---

## 📋 Features

### 1. Dashboard Layout
- Overview cards (total patients, visits this month, new patients, repeat rate)
- Date range selector (this month, last month, last 3 months, last year, custom)
- Filter options (cancer type, state, ethnicity)
- Export button (CSV download)

### 2. Patient Demographics Charts
- Cancer type distribution (pie chart)
- Age distribution (bar chart: 0-17, 18-30, 31-50, 51-65, 66+)
- Ethnicity breakdown (bar chart)
- Language distribution (bar chart)
- Education levels (bar chart)
- Geographic distribution (map or bar chart by state/county)

### 3. Visit Analytics Charts
- Visits over time (line chart: daily/weekly/monthly)
- New vs returning patients (stacked bar chart)
- Visit frequency (histogram)
- Busiest days of week (bar chart)
- Average visits per patient (metric card)

### 4. Assistance Utilization Charts
- Assistance types requested (bar chart)
- Assistance per visit (metric card)
- Assistance per patient (metric card)
- Assistance trends over time (line chart)
- Most requested assistance (top 5 list)

### 5. Operational Metrics
- Staff productivity (check-ins per staff member)
- Average time between visits
- Patients not seen in 6+ months (list)
- Missing data report (patients with incomplete info)

---

## 🎯 Inputs

### Date Range
```typescript
interface DateRange {
  startDate: Date;
  endDate: Date;
}

type DateRangePreset = 
  | 'this_month'
  | 'last_month'
  | 'last_3_months'
  | 'last_year'
  | 'custom';
```

### Filters
```typescript
interface AnalyticsFilters {
  dateRange: DateRange;
  cancerTypes?: string[];
  states?: string[];
  ethnicities?: string[];
  ageGroups?: string[];
}
```

---

## 📤 Outputs

### File Structure
```
src/
├── features/
│   └── analytics/
│       ├── components/
│       │   ├── Dashboard.tsx + Dashboard.test.tsx
│       │   ├── OverviewCards.tsx + OverviewCards.test.tsx
│       │   ├── DateRangeSelector.tsx + DateRangeSelector.test.tsx
│       │   ├── AnalyticsFilters.tsx + AnalyticsFilters.test.tsx
│       │   ├── CancerTypeChart.tsx + CancerTypeChart.test.tsx
│       │   ├── AgeDistributionChart.tsx + AgeDistributionChart.test.tsx
│       │   ├── DemographicsChart.tsx + DemographicsChart.test.tsx
│       │   ├── VisitTrendsChart.tsx + VisitTrendsChart.test.tsx
│       │   ├── AssistanceChart.tsx + AssistanceChart.test.tsx
│       │   ├── StaffProductivityChart.tsx + StaffProductivityChart.test.tsx
│       │   └── ExportButton.tsx + ExportButton.test.tsx
│       ├── hooks/
│       │   ├── useAnalytics.ts + useAnalytics.test.ts
│       │   ├── useDateRange.ts + useDateRange.test.ts
│       │   └── useExport.ts + useExport.test.ts
│       ├── services/
│       │   └── analyticsService.ts + analyticsService.test.ts
│       ├── utils/
│       │   ├── chartUtils.ts + chartUtils.test.ts
│       │   └── exportUtils.ts + exportUtils.test.ts
│       └── types.ts
├── pages/
│   └── AnalyticsPage.tsx + AnalyticsPage.test.tsx
```

### Deliverables
1. Working analytics dashboard
2. All charts rendering with real data
3. Date range filtering
4. Additional filters (cancer type, state, ethnicity)
5. CSV export functionality
6. All components tested
7. All services tested

---

## 📦 Dependencies & Imports

### New Packages
```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "@types/papaparse": "^5.3.14"
  }
}
```

### Import Examples
```typescript
// Analytics service
import { supabase } from '@/lib/supabase';
import type { AnalyticsFilters, CancerTypeStats } from '@/types';
import { mockPatients, mockVisits } from '@/__mocks__/data';

// Dashboard
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { OverviewCards } from '@/features/analytics/components/OverviewCards';
import { CancerTypeChart } from '@/features/analytics/components/CancerTypeChart';
import { DateRangeSelector } from '@/features/analytics/components/DateRangeSelector';

// Charts
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Export
import Papa from 'papaparse';
import { exportToCSV } from '@/features/analytics/utils/exportUtils';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] Dashboard displays overview metrics
- [ ] Date range selector updates all charts
- [ ] Cancer type chart shows distribution
- [ ] Age distribution chart shows buckets
- [ ] Demographics charts show ethnicity/language/education
- [ ] Visit trends chart shows over time
- [ ] Assistance chart shows utilization
- [ ] Staff productivity chart shows check-ins per staff
- [ ] Filters update all charts
- [ ] Export button downloads CSV
- [ ] CSV contains all filtered data
- [ ] Charts handle empty data gracefully

### Technical Requirements
- [ ] All queries use database indexes
- [ ] Queries complete in < 1 second
- [ ] Charts render smoothly
- [ ] Date range calculations correct
- [ ] Age buckets calculated correctly
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Dashboard loads in < 2 seconds
- [ ] Chart updates in < 500ms
- [ ] Export generates in < 1 second
- [ ] No lag when changing filters

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for analytics features
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)
- [ ] Constants used for chart colors/config

### Functionality
- [ ] All charts render correctly
- [ ] All metrics calculate correctly
- [ ] Date range filtering works
- [ ] Additional filters work
- [ ] Export works
- [ ] Empty states handled
- [ ] Loading states shown

### Testing
- [ ] analyticsService.test.ts covers all queries
- [ ] useAnalytics.test.ts covers data fetching
- [ ] useDateRange.test.ts covers date calculations
- [ ] useExport.test.ts covers CSV generation
- [ ] All chart components tested
- [ ] Tests verify calculations correct
- [ ] Tests use mockPatients and mockVisits

### UI/UX
- [ ] Dashboard is scannable
- [ ] Charts are readable
- [ ] Colors are accessible
- [ ] Tooltips are helpful
- [ ] Loading states clear
- [ ] Empty states helpful
- [ ] Mobile responsive

### Documentation
- [ ] Function comments added
- [ ] Query logic documented
- [ ] Chart configurations documented
- [ ] Export format documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (logical units)
- [ ] Branch: `feat/analytics-dashboard`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### analyticsService.test.ts
```typescript
describe('analyticsService', () => {
  describe('getCancerTypeDistribution', () => {
    it('returns count per cancer type');
    it('calculates percentages correctly');
    it('sorts by count descending');
    it('filters by date range');
    it('returns empty array if no patients');
  });
  
  describe('getAgeDistribution', () => {
    it('buckets ages correctly (0-17, 18-30, 31-50, 51-65, 66+)');
    it('calculates age from DOB correctly');
    it('handles edge cases (today birthday, leap year)');
  });
  
  describe('getVisitTrends', () => {
    it('groups visits by day');
    it('groups visits by week');
    it('groups visits by month');
    it('fills gaps with zero counts');
    it('filters by date range');
  });
  
  describe('getAssistanceStats', () => {
    it('counts each assistance type');
    it('calculates assistance per visit');
    it('calculates assistance per patient');
    it('handles patients with no assistance');
  });
  
  describe('getRepeatRate', () => {
    it('calculates percentage of patients with 2+ visits');
    it('returns 0 if no patients');
    it('returns 100 if all patients have 2+ visits');
  });
});
```

### useAnalytics.test.ts
```typescript
describe('useAnalytics', () => {
  it('fetches all analytics data on mount');
  it('refetches when date range changes');
  it('refetches when filters change');
  it('sets isLoading true during fetch');
  it('sets isLoading false after fetch');
  it('sets error on fetch failure');
  it('caches results for same filters');
});
```

### CancerTypeChart.test.tsx
```typescript
describe('CancerTypeChart', () => {
  it('renders pie chart');
  it('displays all cancer types');
  it('shows percentages in tooltip');
  it('uses correct colors');
  it('shows legend');
  it('shows empty state if no data');
  it('shows loading state while fetching');
});
```

---

## 📝 Implementation Order

### Days 1-2: Analytics Service
1. Write analyticsService.test.ts (all queries)
2. Implement analyticsService.ts
3. Test queries manually in Supabase
4. Optimize queries with indexes
5. Verify calculations correct

### Days 3-4: Hooks & Utils
1. Write useAnalytics.test.ts
2. Implement useAnalytics hook
3. Write useDateRange.test.ts
4. Implement useDateRange hook
5. Write chartUtils.test.ts
6. Implement chartUtils.ts
7. Write exportUtils.test.ts
8. Implement exportUtils.ts

### Days 5-6: Chart Components
1. Write OverviewCards.test.tsx
2. Implement OverviewCards
3. Write CancerTypeChart.test.tsx
4. Implement CancerTypeChart
5. Write AgeDistributionChart.test.tsx
6. Implement AgeDistributionChart
7. Write DemographicsChart.test.tsx
8. Implement DemographicsChart
9. Write VisitTrendsChart.test.tsx
10. Implement VisitTrendsChart
11. Write AssistanceChart.test.tsx
12. Implement AssistanceChart

### Day 7: Dashboard Integration & Polish
1. Write DateRangeSelector.test.tsx
2. Implement DateRangeSelector
3. Write AnalyticsFilters.test.tsx
4. Implement AnalyticsFilters
5. Write ExportButton.test.tsx
6. Implement ExportButton
7. Write Dashboard.test.tsx
8. Implement Dashboard
9. Create AnalyticsPage
10. Wire up all components
11. Manual testing
12. Fix bugs
13. Ensure all tests pass
14. Code review and refactor
15. Update documentation

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Queries too slow with large data | High | Use indexes, limit results, pagination |
| Charts don't render on mobile | Medium | Use responsive chart library, test mobile |
| Export file too large | Medium | Limit export to filtered data, warn user |
| Date range calculations wrong | High | Test thoroughly with edge cases |

---

## 📊 Success Metrics

- Dashboard loads in < 2 seconds
- All queries complete in < 1 second
- All 10+ charts rendering correctly
- CSV export works for all data
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Previous**: Sprint 5 (Patient Intake Part 2) - provides patient data
- **Next**: Sprint 7 (Reporting & Export) - extends analytics
- **Depends On**: Sprint 3 (needs visit data), Sprint 5 (needs patient data)
