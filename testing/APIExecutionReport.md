# Budget Bit - API Testing Execution Report
## Neurabit Solutions - Software Testing Assessment

---

## 📋 Overview

**Test Date:** 28 March 2026  
**Tester:** Raghavendra  
**Environment:** Local Development  
**Base URL:** http://localhost:5000/api  
**Production URL:** https://budgetbit.vercel.app/api  

---

## ✅ API Test Results Summary

| Metric | Value |
|--------|-------|
| Total API Tests | 16 |
| Passed | 16 |
| Failed | 0 |
| Pass Rate | **100%** |

---

## 🧪 Test Results - Detailed

### Test Case 1: Health Check API

| Field | Value |
|-------|-------|
| Endpoint | GET /api/health |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Actual Response:**
```json
{"status":"ok","time":"2026-03-28T06:26:28.711Z"}
```

---

### Test Case 2: User Registration

| Field | Value |
|-------|-------|
| Endpoint | POST /api/auth/register |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"testapi@example.com","password":"TestPass123!"}'
```

**Actual Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69c774981abef090f7f95b34",
    "name": "Test User",
    "email": "testapi@example.com",
    "monthlyBudget": 3000
  }
}
```

---

### Test Case 3: User Login

| Field | Value |
|-------|-------|
| Endpoint | POST /api/auth/login |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testapi@example.com","password":"TestPass123!"}'
```

**Actual Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "69c774981abef090f7f95b34",
    "name": "Test User",
    "email": "testapi@example.com",
    "monthlyBudget": 3000
  }
}
```

---

### Test Case 4: Get Current User

| Field | Value |
|-------|-------|
| Endpoint | GET /api/auth/me |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer {{token}}"
```

**Actual Response (200):**
```json
{
  "_id": "69c774981abef090f7f95b34",
  "name": "Test User",
  "email": "testapi@example.com",
  "avatar": "",
  "monthlyBudget": 3000,
  "favCuisines": [],
  "savedRestaurants": []
}
```

---

### Test Case 5: Get All Restaurants

| Field | Value |
|-------|-------|
| Endpoint | GET /api/restaurants |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/restaurants
```

**Actual Response (200):**
```json
{
  "restaurants": [
    {
      "_id": "69c774ae1abef090f7f95b3d",
      "name": "Spice Garden",
      "cuisine": "Indian",
      "address": "MG Road",
      "city": "Bangalore",
      "priceForTwo": 600,
      "rating": 4,
      "worthItScore": 0,
      "communityReviews": 1
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

---

### Test Case 6: Get Restaurant by ID

| Field | Value |
|-------|-------|
| Endpoint | GET /api/restaurants/:id |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/restaurants/69c774ae1abef090f7f95b3d
```

**Actual Response (200):**
```json
{
  "_id": "69c774ae1abef090f7f95b3d",
  "name": "Spice Garden",
  "cuisine": "Indian",
  "address": "MG Road",
  "city": "Bangalore",
  "priceForTwo": 600,
  "rating": 4
}
```

---

### Test Case 7: Create Restaurant

| Field | Value |
|-------|-------|
| Endpoint | POST /api/restaurants |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/restaurants \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Spice Garden","cuisine":"Indian","address":"MG Road","city":"Bangalore","priceForTwo":600}'
```

**Actual Response (201):**
```json
{
  "name": "Spice Garden",
  "cuisine": "Indian",
  "address": "MG Road",
  "city": "Bangalore",
  "priceForTwo": 600,
  "worthItScore": 0,
  "rating": 0,
  "_id": "69c774ae1abef090f7f95b3d"
}
```

---

### Test Case 8: Create Review

| Field | Value |
|-------|-------|
| Endpoint | POST /api/reviews |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{"restaurant":"69c774ae1abef090f7f95b3d","overallRating":4,"taste":5,"value":4,"portion":4,"comment":"Great food!"}'
```

**Actual Response (201):**
```json
{
  "user": "69c774981abef090f7f95b34",
  "restaurant": "69c774ae1abef090f7f95b3d",
  "overallRating": 4,
  "comment": "Great food!",
  "_id": "69c774b31abef090f7f95b41"
}
```

---

### Test Case 9: Get All Reviews

| Field | Value |
|-------|-------|
| Endpoint | GET /api/reviews |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/reviews
```

**Actual Response (200):**
```json
[
  {
    "_id": "69c774b31abef090f7f95b41",
    "user": "69c774981abef090f7f95b34",
    "restaurant": "69c774ae1abef090f7f95b3d",
    "overallRating": 4,
    "comment": "Great food!"
  }
]
```

---

### Test Case 10: Create Bill

| Field | Value |
|-------|-------|
| Endpoint | POST /api/bills |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/bills \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{"restaurant":"69c774ae1abef090f7f95b3d","items":[{"name":"Butter Chicken","price":280,"qty":1},{"name":"Naan","price":60,"qty":2}],"totalAmount":400,"date":"2026-03-28"}'
```

**Actual Response (201):**
```json
{
  "user": "69c774981abef090f7f95b34",
  "restaurant": "69c774ae1abef090f7f95b3d",
  "items": [
    {"name": "Butter Chicken", "price": 280, "qty": 1},
    {"name": "Naan", "price": 60, "qty": 2}
  ],
  "totalAmount": 400,
  "_id": "69c774be1abef090f7f95b50"
}
```

---

### Test Case 11: Get User Bills

| Field | Value |
|-------|-------|
| Endpoint | GET /api/bills |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/bills \
  -H "Authorization: Bearer {{token}}"
```

**Actual Response (200):**
```json
{
  "bills": [
    {
      "_id": "69c774be1abef090f7f95b50",
      "restaurant": {
        "_id": "69c774ae1abef090f7f95b3d",
        "name": "Spice Garden"
      },
      "items": [...],
      "totalAmount": 400
    }
  ],
  "total": 1,
  "summary": {
    "totalSpent": 400,
    "totalSaved": 0,
    "totalBills": 1,
    "avgBill": 400
  }
}
```

---

### Test Case 12: Get Monthly Stats

| Field | Value |
|-------|-------|
| Endpoint | GET /api/bills/monthly-stats |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/bills/monthly-stats \
  -H "Authorization: Bearer {{token}}"
```

**Actual Response (200):**
```json
[
  {
    "_id": {"year": 2026, "month": 3},
    "total": 400,
    "count": 1
  }
]
```

---

### Test Case 13: Get User Profile

| Field | Value |
|-------|-------|
| Endpoint | GET /api/users/profile |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer {{token}}"
```

**Actual Response (200):**
```json
{
  "_id": "69c774981abef090f7f95b34",
  "name": "Test User",
  "email": "testapi@example.com",
  "monthlyBudget": 3000,
  "savedRestaurants": []
}
```

---

### Test Case 14: Update User Profile

| Field | Value |
|-------|-------|
| Endpoint | PUT /api/users/profile |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer {{token}}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","monthlyBudget":5000}'
```

**Actual Response (200):**
```json
{
  "_id": "69c774981abef090f7f95b34",
  "name": "Updated Name",
  "monthlyBudget": 5000
}
```

---

### Test Case 15: Save Restaurant

| Field | Value |
|-------|-------|
| Endpoint | POST /api/users/save/:restaurantId |
| Auth Required | Yes (Bearer Token) |
| Status | ✅ PASS |

**Request:**
```bash
curl -X POST http://localhost:5000/api/users/save/69c774ae1abef090f7f95b3d \
  -H "Authorization: Bearer {{token}}"
```

**Actual Response (200):**
```json
{
  "saved": true,
  "savedRestaurants": ["69c774ae1abef090f7f95b3d"]
}
```

---

### Test Case 16: 404 Not Found

| Field | Value |
|-------|-------|
| Endpoint | GET /api/nonexistent |
| Auth Required | No |
| Status | ✅ PASS |

**Request:**
```bash
curl http://localhost:5000/api/nonexistent
```

**Actual Response (404):**
```json
{
  "message": "Route not found"
}
```

---

## 📊 Final Test Summary

| Test Category | Total | Passed | Failed |
|---------------|-------|--------|--------|
| Health Check | 1 | 1 | 0 |
| Authentication | 3 | 3 | 0 |
| Restaurants | 3 | 3 | 0 |
| Reviews | 2 | 2 | 0 |
| Bills | 3 | 3 | 0 |
| User Profile | 3 | 3 | 0 |
| Error Handling | 1 | 1 | 0 |
| **TOTAL** | **16** | **16** | **0** |

---

## 📁 Deliverables

| Deliverable | Location |
|-------------|----------|
| Postman Collection | `testing/BudgetBit_API_Postman_Collection.json` |
| API Testing Guide | `testing/APITestingGuide.md` |
| This Report | `testing/APIExecutionReport.md` |

---

## ✅ All Tests Completed Successfully

**Backend Status:** Running on http://localhost:5000  
**MongoDB Status:** Connected  
**All 16 API endpoints verified and working correctly**

---

*Document Version: 2.0 - Updated with live test results*  
*Test Date: 28 March 2026*