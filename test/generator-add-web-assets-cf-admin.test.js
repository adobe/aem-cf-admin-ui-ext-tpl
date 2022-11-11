/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/* eslint-disable jest/expect-expect */ // => use assert

const helpers = require('yeoman-test')
const assert = require('yeoman-assert')
const fs = require('fs')
const path = require('path')
const cloneDeep = require('lodash.clonedeep')

const CFAdminWebAssetsGenerator = require('../src/generator-add-web-assets-cf-admin')
const Generator = require('yeoman-generator')

const { customExtensionManifest, demoExtensionManifest } = require('./test-manifests')

const extFolder = 'src/aem-cf-console-admin-1'
const extConfigPath = path.join(extFolder, 'ext.config.yaml')
const webSrcFolder = path.join(extFolder, 'web-src')

const basicGeneratorOptions = {
  'web-src-folder': webSrcFolder,
  'config-path': extConfigPath
}

describe('prototype', () => {
  test('exports a yeoman generator', () => {
    expect(CFAdminWebAssetsGenerator.prototype).toBeInstanceOf(Generator)
  })
})

/**
 * Checks that .env has the required environment variables.
 */
function assertEnvContent (prevContent) {
  assert.fileContent('.env', prevContent)
}

/**
 * Checks that all the files are generated.
 *
 * @param {string} extensionManifest an extension manifest
 */
function assertFiles (extensionManifest) {
  // Asert generated web assets files
  assert.file(`${webSrcFolder}/index.html`)
  assert.file(`${webSrcFolder}/src/exc-runtime.js`)
  assert.file(`${webSrcFolder}/src/index.css`)
  assert.file(`${webSrcFolder}/src/index.js`)
  assert.file(`${webSrcFolder}/src/utils.js`)
  assert.file(`${webSrcFolder}/src/components/Constants.js`)
  assert.file(`${webSrcFolder}/src/components/Spinner.js`)
  assert.file(`${webSrcFolder}/src/components/App.js`)
  assert.file(`${webSrcFolder}/src/components/ExtensionRegistration.js`)

  // Assert generated modal files
  const actionBarButtons = extensionManifest.actionBarButtons || []
  const headerMenuButtons = extensionManifest.headerMenuButtons || []
  const allCustomButtons = actionBarButtons.concat(headerMenuButtons)

  allCustomButtons.forEach((button) => {
    if (button.needsModal) {
      const modalFileName = button.label.replace(/ /g, '') + 'Modal'
      assert.file(`${webSrcFolder}/src/components/${modalFileName}.js`)
    }
  })
}

/**
 * Checks that files contains the correct code snippets.
 *
 * @param {string} extensionManifest an extension manifest
 */
 function assertCodeContent (extensionManifest) {
  assert.fileContent(
    `${webSrcFolder}/src/components/Constants.js`,
    `extensionId: '${extensionManifest.id}'`
  )
  
  assert.fileContent(
    `${webSrcFolder}/index.html`,
    '<script src="./src/index.js"'
  )
}

describe('run', () => {
  const prevDotEnv = 'FAKECONTENT'
  
  test('test a generator invocation with custom code generation', async () => {
    const options = cloneDeep(basicGeneratorOptions)
    options['extension-manifest'] = customExtensionManifest
    await helpers
      .run(CFAdminWebAssetsGenerator)
      .withOptions(options)
      .inTmpDir((dir) => {
        fs.writeFileSync(path.join(dir, '.env'), prevDotEnv)
      })

    assertFiles(customExtensionManifest)
    assertDependencies(
      fs,
      {
        '@adobe/aio-sdk': expect.any(String),
        '@adobe/exc-app': expect.any(String),
        '@adobe/react-spectrum': expect.any(String),
        '@adobe/uix-guest': expect.any(String),
        '@react-spectrum/list': expect.any(String),
        '@spectrum-icons/workflow': expect.any(String),
        'core-js': expect.any(String),
        'node-fetch': expect.any(String),
        'node-html-parser': expect.any(String),
        'react': expect.any(String),
        'react-dom': expect.any(String),
        'react-error-boundary': expect.any(String),
        'react-router-dom': expect.any(String),
        'regenerator-runtime': expect.any(String),
      },
      {
        '@babel/core': expect.any(String),
        '@babel/plugin-transform-react-jsx': expect.any(String),
        '@babel/polyfill': expect.any(String),
        '@babel/preset-env': expect.any(String),
        '@openwhisk/wskdebug': expect.any(String),
        'jest': expect.any(String)
      }
    )
    assertEnvContent(prevDotEnv)
    assertCodeContent(customExtensionManifest)
  })

  test('test a generator invocation with demo code generation', async () => {
    const options = cloneDeep(basicGeneratorOptions)
    options['extension-manifest'] = demoExtensionManifest
    await helpers
      .run(CFAdminWebAssetsGenerator)
      .withOptions(options)
      .inTmpDir((dir) => {
        fs.writeFileSync(path.join(dir, '.env'), prevDotEnv)
      })

    assertFiles(demoExtensionManifest)
    assertDependencies(
      fs,
      {
        '@adobe/aio-sdk': expect.any(String),
        '@adobe/exc-app': expect.any(String),
        '@adobe/react-spectrum': expect.any(String),
        '@adobe/uix-guest': expect.any(String),
        '@react-spectrum/list': expect.any(String),
        '@spectrum-icons/workflow': expect.any(String),
        'core-js': expect.any(String),
        'node-fetch': expect.any(String),
        'node-html-parser': expect.any(String),
        'react': expect.any(String),
        'react-dom': expect.any(String),
        'react-error-boundary': expect.any(String),
        'react-router-dom': expect.any(String),
        'regenerator-runtime': expect.any(String),
      },
      {
        '@babel/core': expect.any(String),
        '@babel/plugin-transform-react-jsx': expect.any(String),
        '@babel/polyfill': expect.any(String),
        '@babel/preset-env': expect.any(String),
        '@openwhisk/wskdebug': expect.any(String),
        'jest': expect.any(String)
      }
    )
    assertEnvContent(prevDotEnv)
    assertCodeContent(demoExtensionManifest)
  })
})