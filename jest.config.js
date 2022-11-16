module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./test/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/"
  ],
  coverageThreshold: {
    global: {
      branches: 25,
      lines: 50,
      statements: 50
    }
  }
}
