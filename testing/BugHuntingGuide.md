# Budget Bit - Systematic Bug Hunting Guide

## Current Bug Status
| ID | Title | Severity | Priority |
|----|-------|----------|----------|
| BR_001 | OCR doesn't support image input | High | P1 |
| BR_002 | Home page overlap on mobile | Medium | P2 |
| BR_003 | Cannot add new restaurant | Medium | P2 |
| BR_004 | Restaurant selection not working during upload | Medium | P2 |

**Target: 5-7 bugs | Current: 4 confirmed**

---

## 🐛 Bug Hunt Checklist

### Category 1: Mobile Responsive Issues

#### Page: Explore Page (Mobile)
- [ ] Open DevTools (F12) → Mobile icon → iPhone/375px
- [ ] Visit Explore page
- [ ] Check: Do restaurant cards overlap?
- [ ] Check: Are filters usable on mobile?
- [ ] Check: Is text readable?

#### Page: Restaurant Details (Mobile)
- [ ] Open DevTools → Mobile icon
- [ ] Visit any restaurant details page
- [ ] Check: Does restaurant info overlap?
- [ ] Check: Is map link visible/tappable?
- [ ] Check: Are action buttons accessible?

#### Page: Upload Page (Mobile)
- [ ] Open DevTools → Mobile icon
- [ ] Visit Upload page
- [ ] Check: Is camera/upload button visible?
- [ ] Check: Can you tap to select file?
- [ ] Check: Does OCR section work?

#### Page: Rate Page (Mobile)
- [ ] Open DevTools → Mobile icon
- [ ] Visit Rate page
- [ ] Check: Are star ratings tappable?
- [ ] Check: Is submit button visible?

#### Page: Profile Page (Mobile)
- [ ] Open DevTools → Mobile icon
- [ ] Visit Profile page
- [ ] Check: Does user info display correctly?
- [ ] Check: Are bill history items readable?

---

### Category 2: Rating Edge Cases

#### Test: Rating with Invalid Values
- [ ] Try to give 0 stars (type 0 in rating)
- [ ] Try to give negative stars (type -1)
- [ ] Try to give text instead of stars (type "abc")
- [ ] Try to give decimal stars (type 3.5)
- [ ] Try to give 100+ stars

#### Test: Empty Rating Submission
- [ ] Upload a bill
- [ ] Try to submit WITHOUT giving any rating
- [ ] Check: Does it crash? Show error? Accept defaults?

---

### Category 3: Upload Flow Bugs

#### Test: Restaurant Selection
- [ ] Upload a bill image
- [ ] Wait for OCR to process
- [ ] Try to select restaurant from dropdown
- [ ] Check: Does selection save?
- [ ] Check: Does restaurant name appear after selection?

#### Test: Add New Restaurant Option
- [ ] During bill upload
- [ ] If desired restaurant not in list
- [ ] Check: Is there option to add new restaurant?
- [ ] If no option: This confirms BR_003

---

### Category 4: Filter Edge Cases

#### Test: Impossible Filter Combination
- [ ] Go to Explore page
- [ ] Set Cuisine: "Any"
- [ ] Set Budget: ₹0 (minimum)
- [ ] Check: What is shown? Error? Empty? All?

#### Test: No Matching Results
- [ ] Set very restrictive filters
- [ ] Check: Does it show "No restaurants found"?
- [ ] Check: Is the message user-friendly?

---

### Category 5: Navigation & Session

#### Test: Browser Back After Logout
- [ ] Login to Budget Bit
- [ ] Navigate to any page (e.g., Profile)
- [ ] Logout
- [ ] Click browser BACK button
- [ ] Check: Does it show logged-in content? (Security bug!)

#### Test: Session Timeout Behavior
- [ ] Login
- [ ] Wait 30+ minutes without activity
- [ ] Try to upload a bill
- [ ] Check: Does it timeout gracefully? Crash? Infinite loading?

---

### Category 6: Input Validation

#### Test: Special Characters in Name
- [ ] Go to Register page
- [ ] Enter name: `<script>alert('XSS')</script>`
- [ ] Complete registration
- [ ] Check: Does it show alert? Render HTML? Sanitize?

#### Test: Very Long Input
- [ ] Go to Register page
- [ ] Enter name: 1000+ characters (paste this)
- [ ] Check: Does it truncate? Crash? Accept?

---

## 📝 How to Document Each Bug

For each bug found:

```
═══════════════════════════════════════════════
BUG ID: BR_00X
Title: [Short description]
Page: [Page name]
Severity: [Critical/High/Medium/Low]
Priority: [P1/P2/P3]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What happened]

Screenshots:
[Attach evidence]

═══════════════════════════════════════════════
```

---

## 🎯 Priority Areas for Bug Hunting

1. **HIGH PRIORITY** - Mobile responsive on multiple pages (likely to find bugs)
2. **HIGH PRIORITY** - Rating edge cases (likely to find bugs)
3. **MEDIUM PRIORITY** - Upload flow issues
4. **MEDIUM PRIORITY** - Session/security

---

## 📊 Bug Tracking

| Category | Expected Bugs | Found |
|----------|--------------|-------|
| Mobile Responsive | 2-3 | 1 |
| Rating Edge Cases | 1-2 | 0 |
| Upload Flow | 1-2 | 2 |
| Navigation/Session | 1 | 0 |
| Input Validation | 1 | 0 |

---

*Created: 28 March 2026*
