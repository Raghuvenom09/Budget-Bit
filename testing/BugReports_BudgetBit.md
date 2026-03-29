# Budget Bit - Bug Reports
## Software Testing Assessment for Neurabit Solutions

---

## BUG REPORT FORMAT

Use the following template for each bug:

```
BUG_ID: BR_XXX
Title: [Brief description of the bug]
Severity: [Critical / High / Medium / Low]
Priority: [P1 / P2 / P3]
Date: DD/MM/YYYY
Tester: Raghavendra
Environment: Chrome on Windows / Firefox on Mac / etc.
Status: [Open / In Progress / Closed / Deferred]

## Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Result:
[What should happen]

## Actual Result:
[What actually happens]

## Screenshots/Evidence:
[Attach or describe]

## Additional Context:
[Any other relevant information]
```

---

## BUG REPORT LOG

### Bug ID: BR_001
| Field | Value |
|-------|-------|
| **Title** | OCR doesn't support image input - shows "model does not support image input" error |
| **Severity** | High |
| **Priority** | P1 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Login to Budget Bit
2. Go to Upload page
3. Upload any bill image
4. Click scan/upload

**Expected Result:**
OCR should extract dish names and prices from the bill image

**Actual Result:**
Error message shown: "ERROR: Cannot read image.png (this model does not support image input)"

**Screenshots:**
[User provided screenshot showing error]

---

### Bug ID: BR_002
| Field | Value |
|-------|-------|
| **Title** | Home page elements overlap on mobile/responsive view |
| **Severity** | Medium |
| **Priority** | P2 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Open Budget Bit in Chrome
2. Press F12 to open DevTools
3. Click phone/tablet icon (responsive design mode)
4. Set to mobile/small screen viewport (375px)
5. Observe Home page

**Expected Result:**
Elements should stack vertically, no overlapping content, all text/buttons/images visible and properly aligned

**Actual Result:**
Elements overlap each other - text/images appear on top of each other, UI is broken on mobile

**Screenshots:**
[User provided screenshot showing overlap]

---

### Bug ID: BR_003
| Field | Value |
|-------|-------|
| **Title** | Users cannot add new restaurant when their restaurant is not in database |
| **Severity** | Medium |
| **Priority** | P2 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. User wants to upload a bill for a restaurant
2. Restaurant is NOT in the database
3. User tries to find option to add new restaurant

**Expected Result:**
User should be able to add new restaurant to database

**Actual Result:**
No option to add new restaurant found - only existing restaurants can be selected from dropdown

**Screenshots:**
[To be added by tester]

---

### Bug ID: BR_004
| Field | Value |
|-------|-------|
| **Title** | Restaurant selection not working during bill upload |
| **Severity** | Medium |
| **Priority** | P2 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Go to Upload page
2. Upload a bill image
3. Try to select/specify the restaurant from the option shown
4. Observe if restaurant is linked to the bill

**Expected Result:**
Selected restaurant should be linked to the uploaded bill and saved

**Actual Result:**
Restaurant option appears but selecting it doesn't work - bill stays unlinked to restaurant

**Screenshots:**
[To be added by tester]

---

### Bug ID: BR_005
| Field | Value |
|-------|-------|
| **Title** | Explore page elements overlap on mobile/responsive view |
| **Severity** | Medium |
| **Priority** | P2 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Open Budget Bit in Chrome
2. Press F12 to open DevTools
3. Click phone/tablet icon (responsive design mode)
4. Set to mobile/small screen viewport (375px)
5. Navigate to Explore page

**Expected Result:**
Elements should stack vertically, no overlapping content, restaurant cards properly displayed

**Actual Result:**
Elements overlap each other on Explore page similar to Home page

**Screenshots:**
[User confirmed overlap - screenshot to be added]


---

### Bug ID: BR_006
| Field | Value |
|-------|-------|
| **Title** | Empty bill upload accepted without validation |
| **Severity** | Medium |
| **Priority** | P2 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Go to Upload page
2. Upload an empty bill or image with no receipt data
3. Try to proceed/save without any extracted items
4. Observe if the app accepts the empty upload

**Expected Result:**
Should show error message: "Please upload a valid bill with items" or reject empty upload

**Actual Result:**
App accepts empty bill upload without any validation error

**Screenshots:**
[User confirmed - upload accepted without items]

---

### Bug ID: BR_007
| Field | Value |
|-------|-------|
| **Title** | Bill history displays uploaded bills count |
| **Severity** | Low |
| **Priority** | P3 |
| **Date** | 28 March 2026 |
| **Tester** | Raghavendra |
| **Status** | Open |

**Steps to Reproduce:**
1. Login to Budget Bit
2. Go to Profile page
3. Check "Bill History" section
4. Observe how bills are displayed

**Expected Result:**
Should show list of uploaded bills with details (restaurant, amount, date)

**Actual Result:**
Shows count of uploaded bills but may have display issues

**Screenshots:**
[To be added]


---

## SEVERITY & PRIORITY DEFINITIONS

### Severity Levels
| Level | Description | Example |
|-------|-------------|---------|
| **Critical** | Application crashes, data loss, security issue | Cannot login, data corruption |
| **High** | Major feature doesn't work | OCR doesn't extract items |
| **Medium** | Feature works but with issues | UI misalignment, slow response |
| **Low** | Minor issue, cosmetic | Typo, spacing issue |

### Priority Levels
| Level | Description | Response Time |
|-------|-------------|--------------|
| **P1** | Must fix immediately | Within 24 hours |
| **P2** | Should fix soon | Within 1 week |
| **P3** | Fix when possible | Next release |

---

## BUG SUMMARY

| Bug ID | Title | Severity | Priority | Status |
|--------|-------|----------|----------|--------|
| BR_001 | OCR doesn't support image input | High | P1 | Open |
| BR_002 | Home page overlap on mobile | Medium | P2 | Open |
| BR_003 | Cannot add new restaurant | Medium | P2 | Open |
| BR_004 | Restaurant selection not working | Medium | P2 | Open |
| BR_005 | Explore page overlap on mobile | Medium | P2 | Open |
| BR_006 | Empty bill upload accepted without validation | Medium | P2 | Open |
| BR_007 | Bill history display issue | Low | P3 | Open |

**Total Bugs:** 7 confirmed

---

*Document Version: 1.0*
*Created: 27 March 2026*
