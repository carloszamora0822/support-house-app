# Sprint 7: Reporting & Export

**Duration**: 1 week  
**Goal**: Build pre-built report templates and advanced export functionality

---

## 📋 Features

### 1. Report Templates
- **Monthly Summary Report**: Total patients, new patients, visits, assistance provided
- **Assistance Utilization Report**: Breakdown by assistance type with trends
- **Demographics Report**: Ethnicity, language, education, age, geographic distribution
- **Cancer Type Report**: Distribution, treatment types, outcomes
- **Grant Report Generator**: Customizable report for grant applications

### 2. Report Builder
- Select report type from dropdown
- Configure date range
- Select filters (cancer type, state, ethnicity, age group)
- Preview report before export
- Export to CSV, PDF, or Excel

### 3. Scheduled Reports (Optional)
- Configure recurring reports (weekly, monthly, quarterly)
- Email delivery (future enhancement)
- Save report configurations

### 4. Data Export
- Export patient list (filtered)
- Export visit history (filtered)
- Export analytics data
- Export with custom columns
- Batch export (multiple reports at once)

### 5. Report History
- View previously generated reports
- Re-download past reports
- Delete old reports

---

## 🎯 Inputs

### Report Configuration
```typescript
interface ReportConfig {
  type: ReportType;
  dateRange: DateRange;
  filters?: ReportFilters;
  columns?: string[];
  format: 'csv' | 'pdf' | 'excel';
}

type ReportType = 
  | 'monthly_summary'
  | 'assistance_utilization'
  | 'demographics'
  | 'cancer_type'
  | 'grant_report'
  | 'patient_list'
  | 'visit_history';

interface ReportFilters {
  cancerTypes?: string[];
  states?: string[];
  ethnicities?: string[];
  ageGroups?: string[];
  assistanceTypes?: string[];
}
```

### Report Data
- Aggregated analytics data
- Patient records (filtered)
- Visit records (filtered)
- Calculated metrics

---

## 📤 Outputs

### File Structure
```
src/
├── features/
│   └── reports/
│       ├── components/
│       │   ├── ReportBuilder.tsx + ReportBuilder.test.tsx
│       │   ├── ReportTypeSelector.tsx + ReportTypeSelector.test.tsx
│       │   ├── ReportFilters.tsx + ReportFilters.test.tsx
│       │   ├── ReportPreview.tsx + ReportPreview.test.tsx
│       │   ├── ExportFormatSelector.tsx + ExportFormatSelector.test.tsx
│       │   ├── ReportHistory.tsx + ReportHistory.test.tsx
│       │   └── ReportCard.tsx + ReportCard.test.tsx
│       ├── templates/
│       │   ├── MonthlySummaryTemplate.tsx + test
│       │   ├── AssistanceUtilizationTemplate.tsx + test
│       │   ├── DemographicsTemplate.tsx + test
│       │   ├── CancerTypeTemplate.tsx + test
│       │   └── GrantReportTemplate.tsx + test
│       ├── hooks/
│       │   ├── useReportBuilder.ts + useReportBuilder.test.ts
│       │   └── useReportExport.ts + useReportExport.test.ts
│       ├── services/
│       │   └── reportService.ts + reportService.test.ts
│       ├── utils/
│       │   ├── pdfGenerator.ts + pdfGenerator.test.ts
│       │   ├── excelGenerator.ts + excelGenerator.test.ts
│       │   └── reportFormatters.ts + reportFormatters.test.ts
│       └── types.ts
├── pages/
│   └── ReportsPage.tsx + ReportsPage.test.tsx
```

### Deliverables
1. Working report builder
2. All 5 report templates
3. CSV export working
4. PDF export working
5. Excel export working (optional)
6. Report preview
7. Report history
8. All components tested
9. All services tested

---

## 📦 Dependencies & Imports

### New Packages
```json
{
  "dependencies": {
    "xlsx": "^0.18.5",
    "jspdf-autotable": "^3.8.0"
  },
  "devDependencies": {
    "@types/xlsx": "^0.0.36"
  }
}
```

### Import Examples
```typescript
// Report service
import { analyticsService } from '@/features/analytics/services/analyticsService';
import type { ReportConfig, ReportData } from '@/types';
import { mockPatients, mockVisits } from '@/__mocks__/data';

// Report builder
import { useReportBuilder } from '@/features/reports/hooks/useReportBuilder';
import { ReportTypeSelector } from '@/features/reports/components/ReportTypeSelector';
import { ReportPreview } from '@/features/reports/components/ReportPreview';

// Export
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { exportToCSV, exportToPDF, exportToExcel } from '@/features/reports/utils';
```

---

## 🎯 Expected Outcomes

### Functional Requirements
- [ ] User can select report type
- [ ] User can configure date range
- [ ] User can apply filters
- [ ] Report preview shows before export
- [ ] CSV export downloads file
- [ ] PDF export downloads file
- [ ] Excel export downloads file (optional)
- [ ] Report history shows past reports
- [ ] Can re-download past reports
- [ ] All report templates generate correctly
- [ ] Grant report includes all required metrics

### Technical Requirements
- [ ] Reports use analytics service queries
- [ ] Export functions handle large datasets
- [ ] PDF formatting is professional
- [ ] Excel formatting includes headers
- [ ] All TypeScript types defined
- [ ] All tests passing
- [ ] No console errors

### Performance Requirements
- [ ] Report generation in < 3 seconds
- [ ] CSV export in < 2 seconds
- [ ] PDF export in < 5 seconds
- [ ] Excel export in < 5 seconds

---

## ✅ Definition of Done

### Code Quality
- [ ] All tests written BEFORE implementation
- [ ] All tests passing (100% of test cases)
- [ ] Test coverage ≥ 90% for reporting features
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All functions have 1-2 line comments
- [ ] All types properly defined (no `any`)

### Functionality
- [ ] All report templates work
- [ ] All export formats work
- [ ] Report preview accurate
- [ ] Filters apply correctly
- [ ] Report history functional
- [ ] File downloads work

### Testing
- [ ] reportService.test.ts covers all report types
- [ ] useReportBuilder.test.ts covers configuration
- [ ] useReportExport.test.ts covers export logic
- [ ] All template components tested
- [ ] PDF generation tested
- [ ] Excel generation tested
- [ ] Tests verify data accuracy

### UI/UX
- [ ] Report builder is intuitive
- [ ] Preview is readable
- [ ] Export buttons clear
- [ ] File names descriptive
- [ ] Loading states shown
- [ ] Success messages clear
- [ ] Mobile responsive

### Documentation
- [ ] Function comments added
- [ ] Report templates documented
- [ ] Export formats documented
- [ ] Component props documented

### Git
- [ ] Committed with verbose commit messages
- [ ] Multiple commits (logical units)
- [ ] Branch: `feat/reporting-export`
- [ ] No commented-out code
- [ ] No console.logs

---

## 🧪 Test Cases

### reportService.test.ts
```typescript
describe('reportService', () => {
  describe('generateMonthlySummary', () => {
    it('includes total patients count');
    it('includes new patients count');
    it('includes total visits count');
    it('includes assistance breakdown');
    it('filters by date range correctly');
  });
  
  describe('generateAssistanceUtilization', () => {
    it('includes count per assistance type');
    it('includes assistance per visit metric');
    it('includes assistance per patient metric');
    it('includes trend data over time');
  });
  
  describe('generateGrantReport', () => {
    it('includes all required grant metrics');
    it('includes demographics breakdown');
    it('includes assistance utilization');
    it('includes visit statistics');
    it('formats data for grant application');
  });
});
```

### pdfGenerator.test.ts
```typescript
describe('pdfGenerator', () => {
  describe('generatePDF', () => {
    it('creates PDF document');
    it('adds title and date');
    it('adds table with data');
    it('formats numbers correctly');
    it('handles multi-page reports');
    it('returns blob for download');
  });
});
```

---

## 📝 Implementation Order

### Days 1-2: Report Service
1. Write reportService.test.ts
2. Implement reportService.ts
3. Create all report templates (data logic)
4. Test report generation with mock data

### Days 3-4: Export Utilities
1. Write pdfGenerator.test.ts
2. Implement pdfGenerator.ts
3. Write excelGenerator.test.ts
4. Implement excelGenerator.ts
5. Write reportFormatters.test.ts
6. Implement reportFormatters.ts
7. Test all export formats

### Days 5-6: Report Builder UI
1. Write useReportBuilder.test.ts
2. Implement useReportBuilder hook
3. Write useReportExport.test.ts
4. Implement useReportExport hook
5. Write ReportTypeSelector.test.tsx
6. Implement ReportTypeSelector
7. Write ReportFilters.test.tsx
8. Implement ReportFilters
9. Write ReportPreview.test.tsx
10. Implement ReportPreview
11. Write ExportFormatSelector.test.tsx
12. Implement ExportFormatSelector

### Day 7: Integration & Polish
1. Write ReportBuilder.test.tsx
2. Implement ReportBuilder
3. Write ReportHistory.test.tsx
4. Implement ReportHistory
5. Create ReportsPage
6. Wire up all components
7. Manual testing of all report types
8. Test all export formats
9. Fix bugs
10. Ensure all tests pass
11. Code review and refactor
12. Update documentation

---

## 🚨 Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF generation slow with large data | Medium | Paginate data, show progress indicator |
| Excel file size too large | Medium | Limit rows, compress file |
| Report data inaccurate | High | Thorough testing, verify calculations |
| Browser download blocked | Low | Use proper MIME types, test in all browsers |

---

## 📊 Success Metrics

- All 5 report templates working
- All 3 export formats working
- Reports generate in < 5 seconds
- Exports download successfully
- Test coverage ≥ 90%
- Zero TypeScript errors
- Zero ESLint warnings

---

## 🔗 Related Sprints

- **Previous**: Sprint 6 (Analytics Dashboard) - provides analytics data
- **Next**: Sprint 8 (Polish & Production) - final refinements
- **Depends On**: Sprint 6 (needs analytics service)
