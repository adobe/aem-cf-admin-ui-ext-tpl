const chalk = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')

module.exports = (config) => {
    console.log(chalk.magenta(chalk.bold('For a developer preview of your UI extension in the AEM environment, follow the URL:')))
    const yamlFile = fs.readFileSync(`${config.root}/app.config.yaml`, 'utf8')
    const yamlData = yaml.load(yamlFile)
    const { extensions } = yamlData
    const appUrl = `https://${config.ow.namespace}.${config.app.hostname}`

    // For now we are ok just to read the first extension point to build the preview link
    const extension = Object.keys(extensions)[0]
    const previewData = {
      extensionPoint: extension,
      url: appUrl,
    };
    const base64EncodedData = Buffer.from(JSON.stringify(previewData)).toString('base64')
    console.log(chalk.magenta(chalk.bold(`  -> https://experience.adobe.com/aem/extension-manager/preview/${base64EncodedData}`)))
};
