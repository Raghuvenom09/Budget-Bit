# Budget Bit - Playwright Automation Tests

## Overview
This folder contains automated test cases using Playwright for the Budget Bit application.

## Test Cases

### Authentication Tests (`auth.spec.js`)
- TC_001: Verify user can login with valid credentials
- TC_002: Verify user cannot login with invalid password
- TC_003: Verify login page elements are present

### Upload Tests (`upload.spec.js`)
- TC_004: Verify user can navigate to upload page
- TC_005: Verify file upload accepts valid image formats
- TC_006: Verify protected route redirects to login when not authenticated
- TC_007: Verify worth-it score displays after rating

### Navigation Tests (`navigation.spec.js`)
- TC_008: Verify navigation to home page
- TC_009: Verify navigation to explore page
- TC_010: Verify 404 page for invalid route
- TC_011: Verify responsive design - mobile viewport
- TC_012: Verify protected route behavior

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** (comes with Node.js)
3. **Budget Bit application running** (http://localhost:5173)

## Installation

1. Navigate to this folder:
```bash
cd testing/automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run with UI mode (see browser):
```bash
npm run test:ui
```

### Run headed (visible browser):
```bash
npm run test:headed
```

### Generate HTML report:
```bash
npm run report
```

## Project Structure

```
automation/
├── tests/
│   ├── auth.spec.js       # Authentication test cases
│   ├── upload.spec.js     # Bill upload test cases
│   └── navigation.spec.js # Navigation test cases
├── package.json           # Dependencies
├── playwright.config.js    # Playwright configuration
└── README.md            # This file
```

## Configuration

The Playwright configuration is in `playwright.config.js`:
- Base URL: http://localhost:5173
- Test directory: `./tests`
- Reporter: HTML report
- Browsers: Chromium, Firefox, WebKit

## Notes

- Tests run against the local development server (http://localhost:5173)
- The webServer configuration will automatically start the dev server if not running
- Screenshots are captured on failure
- Traces are captured on first retry

## Troubleshooting

### Port already in use
If port 5173 is in use, stop any running Budget Bit servers and try again.

### Browser not installed
Run:
```bash
npx playwright install chromium
```

### Tests fail due to network
Ensure Budget Bit is running locally on port 5173.

---

**For Neurabit Solutions Assessment**
**Tester: Raghavendra**
**Date: March 2026**
