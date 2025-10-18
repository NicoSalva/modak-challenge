module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!tests/**/*.ts',
    '!**/*.d.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/src/pages/',
  ],
  testTimeout: 120000, // 2 minutes for e2e tests
  setupFilesAfterEnv: ['<rootDir>/config/setup.ts'],
  maxWorkers: process.env.PARALLEL === 'true' ? 4 : 1,
};
