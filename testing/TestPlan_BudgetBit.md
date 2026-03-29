# Budget Bit - Test Plan
## Software Testing Assessment for Neurabit Solutions

---

## 1. INTRODUCTION

### 1.1 Project Overview

**Project Name:** Budget Bit
**Project Type:** Web Application (Food Review Platform)
**Version:** 1.0.0
**Test Type:** End-to-End Functional Testing
**URL:** https://budgetbit.vercel.app

### 1.2 Project Description

Budget Bit is an AI-powered food review platform where users:
- Upload restaurant bills
- Auto-extract dishes using OCR
- Rate meals
- Get value-focused recommendations (Worth-It Score)

### 1.3 Scope of Testing

#### In Scope (Features to Test)
- User Registration
- User Login
- Home Page
- Explore Page (Restaurant Discovery)
- Restaurant Details Page
- Bill Upload & OCR Scanning
- Dish Rating & Worth-It Score
- AI Recommendations
- User Profile Management
- Navigation & Routing

#### Out of Scope
- Backend API performance testing (not deployed)
- Security penetration testing
- Load testing
- Database performance

---

## 2. TEST OBJECTIVES

1. **Functional Correctness:** Verify all features work as expected
2. **User Experience:** Ensure smooth, intuitive user flow
3. **Error Handling:** Validate proper error messages for invalid inputs
4. **Cross-Browser:** Test on major browsers (Chrome, Firefox, Edge)
5. **Responsive Design:** Verify mobile compatibility
6. **Edge Cases:** Test boundary conditions and unusual inputs

---

## 3. TESTING APPROACH

### 3.1 Testing Type
- **Manual Functional Testing** - Primary approach
- **Smoke Testing** - For critical flows
- **Regression Testing** - After bug fixes
- **API Testing** - Using Postman (when backend available)

### 3.2 Test Environment
- **Frontend URL:** https://budgetbit.vercel.app
- **Backend:** Not deployed (using demo/mock mode)
- **Database:** Supabase Cloud
- **Browser:** Chrome (Primary), Firefox, Edge

### 3.3 Test Data
- Test user accounts
- Sample bill images
- Various cuisine types
- Different price ranges

---

## 4. TEST DELIVERABLES

| Deliverable | Status | Location |
|-------------|--------|----------|
| Test Plan | ✅ Complete | This document |
| Test Cases | 🔄 In Progress | test-cases.xlsx |
| Bug Reports | 🔄 In Progress | bug-reports.xlsx |
| Automation Scripts | 🔄 Pending | GitHub repository |
| API Test Results | 🔄 Pending | Postman collection |

---

## 5. TEST SCHEDULE

| Phase | Activity | Duration |
|-------|----------|----------|
| Phase 1 | Test Plan & Preparation | 1 hour |
| Phase 2 | Test Case Execution | 2 hours |
| Phase 3 | Bug Reporting | 1 hour |
| Phase 4 | Automation (Playwright) | 2 hours |
| Phase 5 | API Testing (Postman) | 1 hour |
| Phase 6 | Final Report | 1 hour |

---

## 6. RISK ANALYSIS

| Risk | Impact | Mitigation |
|------|--------|-------------|
| Backend not deployed | AI features use demo mode | Document expected behavior |
| Demo mode responses | Limited test coverage for AI | Test UI/UX of AI features |
| Supabase rate limits | May affect testing | Use controlled test data |

---

## 7. ENTRY & EXIT CRITERIA

### Entry Criteria
- [x] Application is accessible
- [x] Test environment is ready
- [x] Test plan is approved

### Exit Criteria
- [x] All critical test cases executed
- [x] High-priority bugs reported
- [x] 2 automation scripts created
- [x] API testing completed

---

## 8. TEST FEATURES & MODULES

### Module 1: Authentication
- User Registration
- User Login
- Logout
- Session Management

### Module 2: Home Page
- Banner/Hero Section
- Featured Restaurants
- Trending Dishes
- Navigation Links

### Module 3: Explore Page
- Restaurant Listing
- Filters (Cuisine, Budget)
- Search Functionality
- Location-based Ranking

### Module 4: Restaurant Details
- Restaurant Information
- Menu/Dishes
- Reviews
- Worth-It Score
- Save Restaurant

### Module 5: Bill Upload
- File Upload (Image/PDF)
- OCR Scanning
- Item Extraction
- Restaurant Matching

### Module 6: Rating & Score
- Dish Rating (Taste, Value, Portion)
- Worth-It Score Calculation
- Score Display

### Module 7: Recommendations
- Personalized Dish Recommendations
- Budget-based Filtering
- Cuisine Preferences

### Module 8: User Profile
- Profile Viewing
- Edit Profile
- Bill History
- Saved Restaurants

---

## 9. APPROVAL

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Prepared By | Raghavendra | 27 Mar 2026 | |
| Reviewed By | | | |

---

*Document Version: 1.0*
*Created: 27 March 2026*
