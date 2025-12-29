# Sprint 3: Manual Check-In System - Regression Test

## Test Environment Setup
- [ ] Database seeded with test patients
- [ ] Dev server running (`npm run dev`)
- [ ] Logged in as staff user

---

## Test Suite 1: Happy Path - First Time Check-In

### TC-001: Navigate to Check-In Flow
**Steps:**
1. Login to application
2. Click "Check-In Patient" card on dashboard
3. Verify redirected to Search page

**Expected:**
- ✅ Dashboard shows "Check-In Patient" card with "✨ Sprint 3" badge
- ✅ Clicking card navigates to `/search`
- ✅ Search page displays with patient search input

---

### TC-002: Search and Select Patient
**Steps:**
1. From Search page, type "Maria" in search box
2. Wait for results to appear
3. Click on "Maria Garcia" patient card

**Expected:**
- ✅ Search results display matching patients
- ✅ Patient cards show name, phone, last visit info
- ✅ Clicking patient navigates to Patient Detail page

---

### TC-003: View Patient Details Before Check-In
**Steps:**
1. On Patient Detail page, verify patient information displays
2. Note the current "Total Visits" count
3. Note the "Last Visit" date

**Expected:**
- ✅ Patient name displayed in header
- ✅ Contact information card shows email, phone, address
- ✅ Visit Summary card shows visit count and last visit date
- ✅ Visit History section shows previous visits (if any)
- ✅ "✅ Check In This Patient" button visible in top right

---

### TC-004: Open Check-In Modal
**Steps:**
1. Click "✅ Check In This Patient" button
2. Verify modal opens

**Expected:**
- ✅ Modal appears with title "Check In Patient"
- ✅ Patient name displayed in modal
- ✅ Last visit date shown (or "Never" if first visit)
- ✅ Assistance checkboxes visible (Food, Wigs/Salon, Transportation, etc.)
- ✅ Notes textarea visible
- ✅ Cancel and "Confirm Check-In" buttons visible
- ✅ "Confirm Check-In" button is DISABLED (no assistance selected)

---

### TC-005: Select Assistance and Add Notes
**Steps:**
1. Check "Food" checkbox
2. Check "Transportation" checkbox
3. Type "Patient requested extra food items" in notes field
4. Verify "Confirm Check-In" button becomes enabled

**Expected:**
- ✅ Checkboxes toggle on/off correctly
- ✅ Multiple selections allowed
- ✅ Notes field accepts text input
- ✅ "Confirm Check-In" button ENABLED after selecting assistance

---

### TC-006: Submit Check-In
**Steps:**
1. Click "Confirm Check-In" button
2. Wait for success notification
3. Verify modal closes

**Expected:**
- ✅ Button shows "Checking In..." loading state
- ✅ Green success toast appears: "Patient checked in successfully!"
- ✅ Modal closes automatically
- ✅ Patient Detail page refreshes

---

### TC-007: Verify Data Updated
**Steps:**
1. Check Visit Summary card
2. Check Visit History section
3. Verify database was updated

**Expected:**
- ✅ "Total Visits" count INCREMENTED by 1
- ✅ "Last Visit" date updated to today
- ✅ New visit appears at top of Visit History
- ✅ Visit shows: timestamp, staff name, assistance types, notes

---

## Test Suite 2: Validation & Error Handling

### TC-008: Cannot Check In Without Assistance
**Steps:**
1. Open check-in modal
2. Try to click "Confirm Check-In" without selecting assistance

**Expected:**
- ✅ "Confirm Check-In" button is DISABLED
- ✅ Cannot submit form

---

### TC-009: Duplicate Check-In Prevention
**Steps:**
1. Check in a patient successfully
2. Immediately try to check in same patient again
3. Click "Confirm Check-In"

**Expected:**
- ✅ Error message displays: "Patient has already checked in today"
- ✅ Check-in is prevented
- ✅ Visit count does NOT increment again

---

### TC-010: Cancel Check-In
**Steps:**
1. Open check-in modal
2. Select some assistance types
3. Add notes
4. Click "Cancel" button

**Expected:**
- ✅ Modal closes
- ✅ No check-in created
- ✅ Visit count unchanged
- ✅ Re-opening modal shows empty form (state reset)

---

### TC-011: "Other" Assistance Type
**Steps:**
1. Open check-in modal
2. Check "Other" checkbox
3. Type "Custom assistance needed" in the "Other" text field
4. Submit check-in

**Expected:**
- ✅ "Other" checkbox shows text input field when checked
- ✅ Text input accepts custom assistance description
- ✅ Check-in saves with "other" in assistance_requested array
- ✅ Custom text visible in visit history

---

### TC-012: Notes Optional
**Steps:**
1. Open check-in modal
2. Select assistance type(s)
3. Leave notes field EMPTY
4. Submit check-in

**Expected:**
- ✅ Check-in succeeds without notes
- ✅ Visit created with null/empty notes field

---

## Test Suite 3: UI/UX Verification

### TC-013: Modal Keyboard Navigation
**Steps:**
1. Open check-in modal
2. Press ESC key

**Expected:**
- ✅ Modal closes on ESC key

---

### TC-014: Modal Backdrop Click
**Steps:**
1. Open check-in modal
2. Click outside modal (on dark backdrop)

**Expected:**
- ✅ Modal closes when clicking backdrop

---

### TC-015: Loading States
**Steps:**
1. Open check-in modal
2. Select assistance
3. Click "Confirm Check-In"
4. Observe button during submission

**Expected:**
- ✅ Button text changes to "Checking In..."
- ✅ Button becomes disabled during loading
- ✅ Form inputs disabled during loading
- ✅ Cannot submit multiple times

---

### TC-016: Responsive Design
**Steps:**
1. Test on desktop (1920x1080)
2. Test on tablet (768px width)
3. Test on mobile (375px width)

**Expected:**
- ✅ Modal displays correctly at all breakpoints
- ✅ Buttons and inputs remain accessible
- ✅ Text remains readable

---

## Test Suite 4: Database Triggers

### TC-017: Visit Count Auto-Increment
**Steps:**
1. Check database: `SELECT visit_count FROM patients WHERE id = 'patient-id';`
2. Check in patient
3. Re-check database

**Expected:**
- ✅ `visit_count` increments by 1 automatically (via trigger)
- ✅ No manual update needed

---

### TC-018: Last Visit Date Auto-Update
**Steps:**
1. Check database: `SELECT last_visit_date FROM patients WHERE id = 'patient-id';`
2. Check in patient
3. Re-check database

**Expected:**
- ✅ `last_visit_date` updates to current date automatically (via trigger)
- ✅ Timestamp accurate to current time

---

## Test Suite 5: Multi-User Scenarios

### TC-019: Different Staff Members
**Steps:**
1. Login as Staff User A
2. Check in a patient
3. Logout
4. Login as Staff User B
5. View that patient's visit history

**Expected:**
- ✅ Visit shows Staff User A's name
- ✅ Staff User B can see the visit
- ✅ Correct staff attribution

---

### TC-020: Same Patient, Different Days
**Steps:**
1. Check in patient today
2. Change system date to tomorrow (or wait 24 hours)
3. Check in same patient again

**Expected:**
- ✅ Second check-in succeeds (not duplicate)
- ✅ Visit count increments to 2
- ✅ Both visits visible in history

---

## Test Suite 6: Edge Cases

### TC-021: Patient with No Previous Visits
**Steps:**
1. Find a brand new patient (visit_count = 0)
2. Check in patient

**Expected:**
- ✅ Check-in succeeds
- ✅ Visit count becomes 1
- ✅ Last visit date set for first time
- ✅ "Last visit: Never" changes to today's date

---

### TC-022: Patient with Many Visits
**Steps:**
1. Find patient with 10+ visits
2. Check in patient
3. View visit history

**Expected:**
- ✅ Visit count increments correctly
- ✅ All visits display in history
- ✅ Newest visit at top
- ✅ No performance issues

---

### TC-023: Long Notes Text
**Steps:**
1. Open check-in modal
2. Enter 500+ characters in notes field
3. Submit check-in

**Expected:**
- ✅ Long text accepted
- ✅ Text saves completely
- ✅ Text displays correctly in visit history

---

### TC-024: Special Characters in Notes
**Steps:**
1. Enter notes with special characters: `!@#$%^&*()_+-=[]{}|;':",.<>?/`
2. Submit check-in

**Expected:**
- ✅ Special characters accepted
- ✅ No SQL injection issues
- ✅ Characters display correctly

---

## Test Suite 7: Navigation & State

### TC-025: Back Navigation After Check-In
**Steps:**
1. Check in patient successfully
2. Click "Back to Search" button
3. Search for same patient again
4. View patient details

**Expected:**
- ✅ Updated visit count persists
- ✅ New visit visible in history
- ✅ Data consistency maintained

---

### TC-026: Browser Refresh During Check-In
**Steps:**
1. Open check-in modal
2. Select assistance
3. Refresh browser (F5)

**Expected:**
- ✅ Modal closes (state reset)
- ✅ No partial check-in created
- ✅ Page reloads cleanly

---

## Automated Test Verification

### TC-027: Run All Unit Tests
**Command:** `npm test -- --run`

**Expected:**
- ✅ All 99 tests pass
- ✅ No console errors
- ✅ Test execution < 10 seconds

---

### TC-028: Run Coverage Report
**Command:** `npm test -- --run --coverage`

**Expected:**
- ✅ Modal.tsx: 100% coverage
- ✅ AssistanceSelector.tsx: 100% coverage
- ✅ CheckInModal.tsx: >90% coverage
- ✅ useCheckIn.ts: 100% coverage
- ✅ Overall component coverage: >95%

---

## Sign-Off Checklist

- [ ] All 28 test cases executed
- [ ] All critical paths (TC-001 to TC-007) PASS
- [ ] All validation tests (TC-008 to TC-012) PASS
- [ ] All UI/UX tests (TC-013 to TC-016) PASS
- [ ] Database triggers working (TC-017 to TC-018)
- [ ] Edge cases handled (TC-021 to TC-024)
- [ ] Automated tests passing (TC-027 to TC-028)
- [ ] No console errors during testing
- [ ] No browser warnings
- [ ] Feature ready for production

---

## Bug Report Template

If any test fails, document using this format:

```
**Test Case:** TC-XXX
**Status:** FAIL
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**

**Actual Result:**

**Screenshots/Logs:**

**Severity:** Critical / High / Medium / Low
```

---

## Notes
- Test with realistic data (not just "test" patients)
- Test during peak hours if possible
- Monitor database performance during testing
- Check browser console for warnings/errors
- Test with slow network (throttle to 3G) for loading states
