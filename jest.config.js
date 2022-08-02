module.exports = {
  testEnvironment: 'node',
  verbose: true,
  setupFilesAfterEnv: ['./test/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js'
  ],
  testPathIgnorePatterns: [
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      lines: 100,
      statements: 100
    }
  }
}
