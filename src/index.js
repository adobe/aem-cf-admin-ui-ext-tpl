const Generator = require('yeoman-generator')
const path = require('path')
const upath = require('upath')
const { threadId } = require('worker_threads')
const genericAction = require('@adobe/generator-add-action-generic')
const webAssets = require('@adobe/generator-add-web-assets-exc-react')

const {constants,utils} = require('@adobe/generator-app-common-lib')
const { runtimeManifestKey } = constants

class AEMAdminGenerator extends Generator {
  constructor (args, opts) {
    super(args, opts)
    /* 
    todo: Need to check where the below lines are used and if required or not
     ! this.option('config-path',{type:String})
     ! this.props = {}
     ! this.props.projectName = utils.readPackageJson(this).name

    */
    this.option('skip-prompt', { default: false })
    }
  async initializing () {
    this.extFolder = 'aem/cf-admin'
    this.configName = 'dx/excshell/1'
    }


  async prompting () {
    this.userCustomizationPreference = await this.prompt([
      {
        type: 'list',
        name: 'adminUICustomization',
        message: 'What do you want to extend in AEM Content Fragment Console?',
        choices: [
          {
            name:'Item Action Menu',
            value: 'Item Action Menu'
          },
          {
            name:'Application Menu',
            value:'Application Menu'
          }
        ]
      }
    ])
    
    this.userAddActionPreference = await this.prompt([
      {
        type:'list',
        name:'addAction',
        message:'Do you need server-to-server communication?',
        choices: [
          {
          name:'Yes',
          value: 'Yes'
          },
          {
            name:'No',
            value:'No'
          }

        ]
      }
    ])
    if(this.userCustomizationPreference.adminUICustomization == 'Item Action Menu') {
      this.extFolder = path.join(this.extFolder,'item-menu')
    } 
    else {
      this.extFolder = path.join(this.extFolder,'app-menu')
    }
    this.extConfigPath=path.join(this.extFolder,'ext.config.yaml')
    this.webSrcFolder = path.join(this.extFolder,'web-src')
    this.actionFolder = path.join(this.extFolder,'actions')
    
    if(this.userAddActionPreference.addAction == 'Yes') {
      this.composeWith({
        Generator: genericAction,
        path:'unknown'
      },
      {
        'skip-prompt':false,
        'action-folder':this.actionFolder,
        'config-path':this.extConfigPath,
        'full-key-to-manifest':runtimeManifestKey

      }) 

    }
    this.composeWith({
      Generator: webAssets,
      path: 'unknown'
    }, 
    {
      'skip-prompt': this.options['skip-prompt'],
      'web-src-folder': this.webSrcFolder,
      'config-path': this.extConfigPath
    })
  }

  async writing () {
    this.log("\n")
    this.log("AEM Content Fragment Admin Console Extension " + this.userCustomizationPreference.adminUICustomization+ " generated.")
    this.log("\n")
    // ! this.log("Add your logic here: "+"\x1b[35m"+path.join(this.contextRoot,destFolder)+":"+line+"\x1b[0m")
    // ! this.log("Test your extension using \x1b[33m`npm start`\x1b[0m")
    // ! this.log("\n")
    // ! this.log("\x1b[34mTo view the application in the Experience Cloud Shell:\x1b[0m")
    // ! this.log("\x1b[34m->  https://experience.adobe.com/?shell_source=dev&shell_devmode=true#/aem/cf/admin&ext=https://localhost:7777\x1b[0m")
    

      const unixExtConfigPath = upath.toUnix(this.extConfigPath)
      this.log(unixExtConfigPath)
    // add the extension point config in root
      utils.writeKeyAppConfig(
      this,
      // key
      'extensions.' + this.configName,
      // value
      {
        // posix separator

        $include: unixExtConfigPath
      }
    )


    // add extension point operation
    utils.writeKeyYAMLConfig(
      this,
      this.extConfigPath,
      // key
      'operations', {
        view: [
          { type: 'web', impl: 'index.html' }
        ]
      }
    )

    // add actions path, relative to config file
    utils.writeKeyYAMLConfig(this, this.extConfigPath, 'actions', path.relative(this.extFolder, this.actionFolder))
    // add web-src path, relative to config file
    utils.writeKeyYAMLConfig(this, this.extConfigPath, 'web', path.relative(this.extFolder, this.webSrcFolder))
  }
    
}


module.exports = AEMAdminGenerator

