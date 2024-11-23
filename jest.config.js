// jest.config.js
module.exports = {
    testEnvironment: 'node',
    setupFiles: ['<rootDir>/tests/jest.setup.js'],
    testMatch: [
      '<rootDir>/tests/unit/**/*.test.js',
      '<rootDir>/tests/integration/**/*.test.js',
    ],
    collectCoverageFrom: ['backend/**/*.js', '!backend/config/*.js'],
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    moduleDirectories: ['node_modules'],
  };
  