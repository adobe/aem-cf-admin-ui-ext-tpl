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

const path = require('path')
const { constants, ActionGenerator, commonTemplates } = require('@adobe/generator-app-common-lib')
const { commonDependencyVersions } = constants

class CFAdminUIActionGenerator extends ActionGenerator {
  constructor (args, opts) {
    super(args, opts)
    this.props = {
      description: 'This is a sample action showcasing how to access an external API',
      // eslint-disable-next-line quotes
      requiredParams: `[/* add required params */]`,
      // eslint-disable-next-line quotes
      requiredHeaders: `['Authorization']`,
      // eslint-disable-next-line quotes
      importCode: `const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')`,

      responseCode: `// replace this with the api you want to access
    const apiEndpoint = \${params.API_ENDPOINT}
    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint)
    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
    }
    const content = await res.json()
    const response = {
      statusCode: 200,
      body: content
    }`
    }

    this.props['actionName'] = this.options['action-name']
  }

  // async prompting () {
  //   this.props.actionName = await this.promptForActionName('showcases how to access an external API', 'generic')
  // }

  writing () {
    this.sourceRoot(path.join(__dirname, '.'))

    this.addAction(this.props.actionName, commonTemplates['stub-action'], {
      // testFile: './templates/fetchExample.test.js',
      sharedLibFile: commonTemplates.utils,
      sharedLibTestFile: commonTemplates['utils.test'],
      e2eTestFile: commonTemplates['stub-action.e2e'],
      tplContext: this.props,
      dependencies: {
        'node-fetch': '^2.6.0'
      },
      actionManifestConfig: {
        inputs: { 
          LOG_LEVEL: 'debug',
          API_ENDPOINT: '$API_ENDPOINT',
        },
        annotations: { 
          final: true, 
          'require-adobe-auth': false 
        } // makes sure loglevel cannot be overwritten by request param
      },
      dotenvStub: { label: 'Place your local environment variables here', vars: ['API_ENDPOINT'] }
    })
  }
}

module.exports = CFAdminUIActionGenerator
