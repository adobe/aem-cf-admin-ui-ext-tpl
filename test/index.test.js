const helpers = require('yeoman-test')
const Generator = require('yeoman-generator')

const CFAdminMainGenerator = require('../src/index')
const CFAdminActionGenerator = require('../src/generator-add-action-cf-admin')
const CFAdminWebAssetsGenerator = require('../src/generator-add-web-assets-cf-admin')
const { utils } = require('@adobe/generator-app-common-lib')

const { defaultExtensionManifest, customExtensionManifest } = require('./test-manifests')

const composeWith = jest.spyOn(Generator.prototype, 'composeWith').mockImplementation(jest.fn())
const prompt = jest.spyOn(Generator.prototype, 'prompt') // prompt answers are mocked by "yeoman-test"
const writeKeyAppConfig = jest.spyOn(utils, 'writeKeyAppConfig').mockImplementation(jest.fn())
const writeKeyYAMLConfig = jest.spyOn(utils, 'writeKeyYAMLConfig').mockImplementation(jest.fn())

beforeEach(() => {
  composeWith.mockClear()
  prompt.mockClear()
  writeKeyAppConfig.mockClear()
  writeKeyYAMLConfig.mockClear()
})

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(CFAdminMainGenerator.prototype).toBeInstanceOf(Generator)
  })
})

describe('run', () => {
  const srcFolder = 'src/aem-cf-console-admin-1'
  const configName = 'aem/cf-console-admin/1'
  const extConfig = 'ext.config.yaml'
  
  test('test a generator invocation with default code generation', async () => {
    const options = {
      'is-test': true,
      'extension-manifest': defaultExtensionManifest
    }
    await helpers.run(CFAdminMainGenerator)
      .withOptions(options)
    expect(prompt).not.toHaveBeenCalled()
    expect(composeWith).toHaveBeenCalledTimes(1)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: CFAdminWebAssetsGenerator,
        path: 'unknown'
      }),
      expect.any(Object)
    )
    expect(writeKeyAppConfig).toHaveBeenCalledTimes(1)
    expect(writeKeyYAMLConfig).toHaveBeenCalledTimes(3)
    expect(writeKeyAppConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), `extensions.${configName}`, { $include: `${srcFolder}/${extConfig}` })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'operations', { view: [{ impl: 'index.html', type: 'web' }] })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'actions', 'actions')
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'web', 'web-src')
  })

  test('test a generator invocation with custom code generation', async () => {
    const options = {
      'is-test': true,
      'extension-manifest': customExtensionManifest
    }
    await helpers.run(CFAdminMainGenerator)
      .withOptions(options)
    expect(prompt).not.toHaveBeenCalled()
    expect(composeWith).toHaveBeenCalledTimes(3)
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: CFAdminActionGenerator,
        path: 'unknown'
      }),
      expect.any(Object)
    )
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: CFAdminActionGenerator,
        path: 'unknown'
      }),
      expect.any(Object)
    )
    expect(composeWith).toHaveBeenCalledWith(
      expect.objectContaining({
        Generator: CFAdminWebAssetsGenerator,
        path: 'unknown'
      }),
      expect.any(Object)
    )
    expect(writeKeyAppConfig).toHaveBeenCalledTimes(1)
    expect(writeKeyYAMLConfig).toHaveBeenCalledTimes(3)
    expect(writeKeyAppConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), `extensions.${configName}`, { $include: `${srcFolder}/${extConfig}` })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'operations', { view: [{ impl: 'index.html', type: 'web' }] })
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'actions', 'actions')
    expect(writeKeyYAMLConfig).toHaveBeenCalledWith(expect.any(CFAdminMainGenerator), global.n(`${srcFolder}/${extConfig}`), 'web', 'web-src')
  })
})
