module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 120000, // 2 minutes for e2e tests
  maxWorkers: process.env.PARALLEL === 'true' ? 4 : 1,
  reporters: [
    "default",
    ["jest-html-reporter", { 
      pageTitle: "Modak Challenge Report", 
      outputPath: "reports/jest-report.html" 
    }]
  ],
};
