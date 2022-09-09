const fs = require('fs-extra')

function readManifest (manifestPath) {
  try {
    return JSON.parse(
      fs.readFileSync(manifestPath, { encoding: 'utf8' })
    )
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {}
    } else {
      throw err
    }
  }
}

function writeManifest (manifest, manifestPath) {
  fs.writeJsonSync(manifestPath, manifest, { spaces: 2 })
}

module.exports = {
  readManifest,
  writeManifest
}