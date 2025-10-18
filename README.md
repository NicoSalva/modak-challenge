# Modak Challenge - E2E Testing

## Overview
End-to-end testing solution for AliExpress using Puppeteer + TypeScript + Jest.

## Prerequisites

### 1. Install Node.js
If you don't have Node.js installed:

**Option A: Download from official website**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS version (18+ recommended)
3. Run the installer and follow the instructions

**Option B: Using Homebrew (macOS)**
```bash
brew install node
```

**Option C: Using Chocolatey (Windows)**
```bash
choco install nodejs
```

### 2. Verify Installation
```bash
node --version
npm --version
```

You should see version numbers for both commands.

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/NicoSalva/modak-challenge.git
cd modak-challenge
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- Puppeteer (browser automation)
- TypeScript (type safety)
- Jest (testing framework)
- Stealth plugin (anti-bot detection)

### 3. Setup QA Directories
```bash
npm run qa:setup
```

This creates the necessary directories for reports and screenshots.

### 4. Environment Configuration (Optional)
```bash
# Copy environment template
cp .env.example .env

# Edit .env file to customize settings
# HEADLESS=false
# BASE_URL=https://www.aliexpress.com
# ENVIRONMENT=prod
# PARALLEL=false
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch


# Run tests for CI/CD (single run, no watch)
npm run test:ci
```

### Advanced Commands
```bash
# Run tests in headless mode (no browser window)
npm run test:headless

# Run tests in parallel (faster execution)
npm run test:parallel

# Run tests with verbose output (for debugging)
npm run test:debug
```

### Cleanup Commands
```bash
# Clean generated files (reports, screenshots)
npm run qa:clean
```

### Report Commands
```bash
# Open HTML test report in browser
npm run report:open
```

## Test Objective

The main test verifies the following feature:

> **As a Customer, we want to see if the second item from the second results page when searching for "instax mini" on www.aliexpress.com has at least 1 item to be bought.**

### Test Flow
1. Navigate to AliExpress homepage
2. Search for "instax mini"
3. Navigate to second page of results
4. Click on the second product
5. Verify the product has stock available

## Technologies Used

- **Puppeteer**: Headless browser automation
- **TypeScript**: Static typing for better code quality
- **Jest**: JavaScript testing framework
- **Page Object Model**: Maintainable test architecture
- **puppeteer-extra-plugin-stealth**: Anti-bot detection bypass

## Troubleshooting

### Common Issues

**1. Bot Detection**
- The tests include stealth mode to avoid detection
- If you still get blocked, try running in headless mode: `npm run test:headless`

**2. Timeouts**
- Tests have a 2-minute timeout
- If tests fail due to timeouts, check your internet connection

**3. Element Not Found**
- Screenshots are automatically captured on test failures
- Check the `screenshots/` folder for debugging

**4. Node.js Version Issues**
- Ensure you have Node.js 18+ installed
- Check with: `node --version`

### Getting Help

If you encounter issues:
1. Check the `screenshots/` folder for failure screenshots
2. Run tests with verbose output: `npm run test:debug`
3. Ensure all dependencies are installed: `npm install`
4. Clean and reinstall if needed: `npm run qa:clean && npm install`

## Environment Variables

You can customize test behavior with environment variables:

```bash
# Run in headless mode
HEADLESS=true npm test

# Use different base URL
BASE_URL=https://staging.aliexpress.com npm test

# Set environment
ENVIRONMENT=staging npm test

# Enable parallel execution
PARALLEL=true npm test
```

## Reporting

- **Test Results**: Shown in console output
- **HTML Report**: Beautiful HTML report generated in `reports/jest-report.html`
- **Screenshots**: Automatically captured on failures in `screenshots/`
- **Reports**: Generated in `reports/` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

---

## Technical Solution Overview

### Challenge Approach

When I started this challenge, I knew AliExpress would be a tough target due to their sophisticated bot detection systems. My initial approach was to use Playwright, which I'm familiar with, but I quickly realized that their anti-automation measures were more aggressive than expected.

### Technology Migration Journey

**Playwright → Puppeteer Migration**

The main reason for switching from Playwright to Puppeteer was bot detection. Despite implementing various stealth techniques in Playwright (custom user agents, viewport settings, context options, and even custom stealth utilities), AliExpress consistently detected the automation and showed "unusual activity" warnings or captcha challenges.

Puppeteer with the `puppeteer-extra-plugin-stealth` proved to be significantly more effective at bypassing these detection mechanisms. The stealth plugin handles many of the common automation detection vectors that websites use, and it's specifically designed for this purpose.

**JavaScript → TypeScript Migration**

I migrated to TypeScript for better code maintainability and type safety. Working with Page Objects and complex selectors benefits greatly from static typing, especially when dealing with Puppeteer's API. It also makes the codebase more professional and easier to scale for larger teams.

**Standalone Script → Jest Framework**

The final migration to Jest was driven by the need for a more professional testing framework. Jest provides better test organization, reporting, and debugging capabilities. It also integrates well with CI/CD pipelines and provides better error messages and test isolation.

### Architecture Decisions

**Page Object Model (POM)**

I implemented POM to separate test logic from page interaction logic. This makes tests more readable and maintainable. Each page has its own class with methods that represent user actions, making it easy to understand what each test is doing.

**Centralized Configuration**

I created a centralized configuration system (`TestConfig.ts`) that allows easy switching between different environments (dev, staging, prod) and test modes (headless, parallel, etc.). This makes the solution more flexible and enterprise-ready.

**Test Data Management**

The `TestData.ts` file centralizes all test parameters, making it easy to modify search terms, timeouts, and expected results without touching the test code. This is crucial for maintaining tests across different environments.

**QA Utilities**

I built reusable utilities (`QAUtils.ts`) for common QA tasks like taking screenshots, logging page information, and validating page loads. These utilities make debugging easier and provide better visibility into test execution.

### Anti-Bot Detection Strategy

The key to success was using `puppeteer-extra-plugin-stealth` combined with:
- Realistic browser fingerprinting
- Proper timing between actions
- Handling of pop-ups and notifications
- Fallback strategies for element detection

### Why This Solution Works

1. **Reliability**: Puppeteer with stealth plugin consistently bypasses AliExpress bot detection
2. **Maintainability**: TypeScript and POM make the code easy to understand and modify
3. **Scalability**: Centralized configuration and utilities make it easy to add new tests
4. **Professional**: Jest framework and proper error handling make it production-ready
5. **Debuggable**: Screenshots on failure and detailed logging help troubleshoot issues