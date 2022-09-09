/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License")
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const inquirer = require('inquirer')
const slugify = require('slugify')
const chalk = require('chalk')
const path = require('path')

const { readManifest } = require('./utils')

const SLACK_DEMO_MANIFEST_PATH = path.join(__dirname, './templates/slack-demo/extension-manifest.json')

var exitMenu = false

const briefOverviews = {
  templateInfo: `\nAEM Content Fragment Admin UI Template Overview:\n
  * You have the option to generate boilerpate code for your extensible buttons.
  * You can check out a sample demo project.
  * You can get help regarding documentation at any time from the menu.
  * An App Builder project will be created with Node.js packages pre-configured.\n`
}

const promptDocs = {
  mainDoc: "https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=ODIN&title=Content+Fragment+Admin+UI+-+Extension+points",
  sampleProject: "https://git.corp.adobe.com/dx-devex-acceleration/aem-headless-ui-ext-examples/tree/main-uix"
}

// Top Level prompts
const promptTopLevelFields = (manifest) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'displayName',
      message: "What do you want to name your extension?",
      validate(answer) {
        if (!answer.length) {
          return 'Required.'
        }

        return true
      }
    },
    {
      type: 'input',
      name: 'description',
      message: "Please provide a short description of your extension:",
      validate(answer) {
        if (!answer.length) {
          return 'Required.'
        }

        return true
      }
    },
    {
      type: 'input',
      name: 'version',
      message: "What version would you like to start with?",
      default: '0.0.1',
      validate(answer) {
        if (!new RegExp("^\\bv?(?:0|[1-9][0-9]*)(?:\\.(?:0|[1-9][0-9]*)){2}(?:-[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\\.[\\da-z\\-]+)*)?\\b$").test(answer)) {
          return 'Required. Must match semantic versioning rules.'
        }

        return true
      }
    }
  ])
  .then((answers) => {
    if (answers.displayName) {
      manifest.displayName = answers.displayName
    }

    if (answers.description) {
      manifest.description = answers.description
    }

    if (answers.version) {
      manifest.version = answers.version
    }
  })
}

// Main Menu prompts
const promptMainMenu = (manifest) => {
  const choices = []

  choices.push(
    new inquirer.Separator(),
    {
      name: "Add a custom button to Action Bar",
      value: nestedButtonPrompts.bind(this, manifest, 'actionBarButtons'),
    },
    {
      name: "Add a custom button to Header Menu",
      value: nestedButtonPrompts.bind(this, manifest, 'headerMenuButtons'),
    },
    {
      name: "Add server-side handler",
      value: nestedActionPrompts.bind(this, manifest, 'runtimeActions')
    },
    new inquirer.Separator(),
    {
      name: "I'm done",
      value: () => {
        return Promise.resolve(true)
      }
    },
    {
      name: "I don't know",
      value: promptGuideMenu.bind(this, manifest)
    }
  )

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: "What would you like to do next?",
      choices,
    })
    .then((answers) => answers.execute())
    .then((endMainMenu) => {
      if (!endMainMenu && !exitMenu) {
        return promptMainMenu(manifest)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// Prompts for button metadata
const nestedButtonPrompts = (manifest, manifestNodeName) => {
  const questions = [labelPrompt(), modalPrompt()]

  return inquirer
    .prompt(questions)
    .then((answers) => {
      answers.id = slugify(answers.label, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: true,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })
      // console.log(JSON.stringify(answers, null, '  '))
      manifest[manifestNodeName] = manifest[manifestNodeName] || []
      manifest[manifestNodeName].push(answers)
    })
    .catch((error) => {
      console.error(error)
    })
}

// Helper prompts for button metadata
const labelPrompt = () => {
  return {
    type: 'input',
    name: 'label',
    message: "Please provide label name for the button:",
    validate(answer) {
      if (!answer.length) {
        return 'Required.'
      }

      return true
    },
  }
}

const modalPrompt = () => {
  return {
    type: 'confirm',
    name: 'needsModal',
    message: "Do you need to show a modal for the button?",
    default: false
  }
}

// Prompts for action metadata
const nestedActionPrompts = (manifest, manifestNodeName) => {
  let actionName = 'generic'

  return inquirer.prompt({
    type: 'input',
    name: 'actionName',
    message: "Adobe I/O Runtime lets you invoke serverless code on demand. How would you like to name this action?",
    default: actionName,
    validate (input) {
    // Must be a valid openwhisk action name, this is a simplified set see:
    // https://github.com/apache/openwhisk/blob/master/docs/reference.md#entity-names
      const valid = /^[a-zA-Z0-9][a-zA-Z0-9-]{2,31}$/
      if (valid.test(input)) {
        return true
      }
      return `'${input}' is not a valid action name, please make sure that:
              The name has at least 3 characters or less than 33 characters.
              The first character is an alphanumeric character.
              The subsequent characters are alphanumeric.
              The last character isn't a space.
              Note: characters can only be split by '-'.`
    }
  })
  .then((answer) => {
    manifest[manifestNodeName] = manifest[manifestNodeName] || []
    // manifest[manifestNodeName].push(answer.actionName)
    manifest[manifestNodeName].push({
      'name': answer.actionName
    })
  })
  .catch((error) => {
    console.error(error)
  })
}

// Guide Menu Prompts
const promptGuideMenu = (manifest) => {
  const choices = []

  choices.push(
    new inquirer.Separator(),
    {
      name: "Try a demo project",
      value: () => {
        const slackDemoManifest = readManifest(SLACK_DEMO_MANIFEST_PATH)

        // Update the extension manifest object
        manifest['displayName'] = slackDemoManifest['displayName'] || null
        manifest['description'] = slackDemoManifest['description'] || null
        manifest['version'] = slackDemoManifest['version'] || null
        manifest['templateFolder'] = slackDemoManifest['templateFolder'] || null
        manifest['actionBarButtons'] = slackDemoManifest['actionBarButtons'] || null
        manifest['headerMenuButtons'] = slackDemoManifest['headerMenuButtons'] || null
        manifest['runtimeActions'] = slackDemoManifest['runtimeActions'] || null
        exitMenu = true

        return Promise.resolve(true)
      }
    },
    {
      name: "Find some help",
      value: helpPrompts.bind(this)
    },
    new inquirer.Separator(),
    {
      name: "Go back",
      value: () => {
        return Promise.resolve(true)
      }
    }
  )

  return inquirer
    .prompt({
      type: 'list',
      name: 'execute',
      message: "What about this then?",
      choices,
    })
    .then((answers) => answers.execute())
    .then((endGuideMenu) => {
      if (!endGuideMenu) {
        return promptGuideMenu(manifest)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// Helper prompts for Guide Menu
const helpPrompts = () => {
  console.log(chalk.blue(chalk.bold(`Please refer to:\n  -> ${promptDocs['mainDoc']}`)) + '\n')
}

const sampleProjectPrompts = () => {
  console.log(chalk.blue(chalk.bold(`Please git clone this repository:\n  -> ${promptDocs['sampleProject']}`)) + '\n')
}

const dummyPrompt = () => {
  console.log(chalk.blue(chalk.bold(`Please stay tuned for this feature!`)+ '\n'))
}

// const readManifest = (manifestPath) => {
//   try {
//     return JSON.parse(
//       fs.readFileSync(manifestPath, { encoding: 'utf8' })
//     )
//   } catch (err) {
//     if (err.code === 'ENOENT') {
//       return {}
//     } else {
//       throw err
//     }
//   }
// }

module.exports = {
  briefOverviews,
  promptTopLevelFields,
  promptMainMenu
}
