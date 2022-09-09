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

const slackDemoTemplates = {
  'stub-action': path.resolve(__dirname, './stub-action.js'),
  'stub-action.test': path.resolve(__dirname, './stub-action.test.js'),
  'stub-action.e2e': path.resolve(__dirname, './stub-action.e2e.js'),
  'utils': path.resolve(__dirname, './utils.js'),
  'utils.test': path.resolve(__dirname, './utils.test.js')
}

module.exports = slackDemoTemplates
