const helpers = require('yeoman-test')

const theGeneratorPath = require.resolve('../src/index')
const Generator = require('yeoman-generator')

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(require(theGeneratorPath).prototype).toBeInstanceOf(Generator)
  })
})

describe('run', () => {
  test('test generator', async () => {
    const options = { 
      'dest-folder': 'my-template',
      'project-name': 'my-project'
    }

    const ret = await helpers.run(theGeneratorPath)
      .withOptions(options)
    expect(ret).toBeDefined()
  })
})
