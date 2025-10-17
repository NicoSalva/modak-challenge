# Modak Challenge - E2E Testing

## Overview
End-to-end testing solution for AliExpress using Puppeteer + TypeScript + Jest.

## Project Structure
```
modak-challenge/
├── src/                    # Source code
│   └── pages/             # Page Object Model
├── tests/                 # Test files
├── config/                # Configuration files
│   ├── jest.config.js     # Jest configuration
│   └── setup.ts          # Global test setup
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

## Technologies
- **Puppeteer**: Browser automation
- **TypeScript**: Type safety
- **Jest**: Testing framework
- **Page Object Model**: Test architecture
- **Stealth Plugin**: Anti-bot detection

## Test Flow
1. Navigate to AliExpress homepage
2. Search for "instax mini"
3. Navigate to second page
4. Click on first product
5. Verify product availability
