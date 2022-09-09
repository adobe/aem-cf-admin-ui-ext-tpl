const helpers = require('yeoman-test')

const cfConsoleAdmin = require.resolve('../src/index')
const Generator = require('yeoman-generator')

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(require(cfConsoleAdmin).prototype).toBeInstanceOf(Generator)
  })
})
