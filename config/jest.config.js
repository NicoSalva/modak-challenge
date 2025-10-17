module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/../tests'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/../src/**/*.ts',
    '!<rootDir>/../src/**/page.evaluate',
    '!<rootDir>/../tests/**/*.ts',
    '!**/*.d.ts',
  ],
  testTimeout: 120000, // 2 minutes for e2e tests
  setupFilesAfterEnv: ['<rootDir>/setup.ts'],
};
