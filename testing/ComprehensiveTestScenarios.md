# Budget Bit - Comprehensive Test Scenarios

## Execute these tests and note any bugs found

---

## TEST 1: Mobile Responsive - Explore Page
**Steps:**
1. Open Chrome → https://budgetbit.vercel.app/explore
2. Press F12 → Click mobile icon (top-left)
3. Select iPhone 12 or set width: 375px
4. Look at Explore page

**Expected:** Elements should stack vertically, no overlapping
**Bug if:** Elements overlap, text cuts off, buttons unclickable

---

## TEST 2: Mobile Responsive - Restaurant Details
**Steps:**
1. With mobile view still active
2. Click on any restaurant
3. Look at restaurant details page

**Expected:** Info should display correctly in mobile view
**Bug if:** Overlapping sections, map link not visible, buttons hidden

---

## TEST 3: Mobile Responsive - Upload Page
**Steps:**
1. Still in mobile view (375px width)
2. Navigate to Upload page (or paste /upload in URL)
3. Look for upload button/camera icon

**Expected:** Upload button visible and tappable
**Bug if:** Button hidden, too small, overlaps with other elements

---

## TEST 4: Rating Edge Case - Zero Stars
**Steps:**
1. Login to Budget Bit
2. Go to Upload → Upload a bill
3. After OCR extracts items
4. Try to set rating to 0 stars

**Expected:** Should either reject (show error) or accept 0
**Bug if:** App crashes, accepts invalid value silently, shows NaN

---

## TEST 5: Rating Edge Case - Text Input
**Steps:**
1. On rating page
2. Instead of clicking stars, try typing text
3. Or try entering number like 999

**Expected:** Should validate and not accept invalid input
**Bug if:** Shows NaN, Infinity, or crashes

---

## TEST 6: Upload - Restaurant Selection
**Steps:**
1. Upload a bill image
2. Wait for OCR to process
3. Look for restaurant selector/dropdown
4. Select a restaurant
5. Check if restaurant is actually linked

**Expected:** Selected restaurant should be saved/linked
**Bug if:** Selection doesn't save, shows null, doesn't link

---

## TEST 7: Browser Back After Logout (SECURITY BUG)
**Steps:**
1. Login to Budget Bit
2. Go to Profile page
3. Click Logout
4. Immediately click browser BACK button

**Expected:** Should show login page or require re-login
**Bug if:** Shows your logged-in profile content (security issue!)

---

## TEST 8: Filter - No Results
**Steps:**
1. Go to Explore page
2. Set Cuisine: "Japanese"
3. Set Budget: ₹50 (very low)
4. Look at results

**Expected:** Should show "No restaurants found" message
**Bug if:** Shows error, crashes, or displays wrong data

---

## TEST 9: Input Validation - Special Characters
**Steps:**
1. Go to Register page
2. Enter name: `<img src=x onerror=alert(1)>`
3. Complete registration

**Expected:** Should sanitize HTML or reject input
**Bug if:** Shows alert popup, renders HTML, stores malicious script

---

## TEST 10: Very Long Input
**Steps:**
1. Go to Register page
2. Copy this and paste in name field:
   `AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`
3. Try to register

**Expected:** Should truncate or show max length error
**Bug if:** Crashes, accepts unlimited length, breaks UI

---

## Results Template

For each test, fill in:

```
TEST #_: [Name]
Result: PASS / FAIL / BUG FOUND
Bug ID: (if found)
Notes: [What happened]
Screenshots: [Attach if bug]
```

---

## Bug Summary

| Test | Result | Bug ID | Notes |
|------|--------|--------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
| 10 | | | |

---

*Execute these tests and document any bugs found*
