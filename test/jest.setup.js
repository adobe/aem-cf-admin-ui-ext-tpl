const path = require('path')
const { stdout, stderr } = require('stdout-stderr')

process.on('unhandledRejection', error => {
  throw error
})

// trap console log
beforeEach(() => {
  stdout.start()
  stderr.start()
  stdout.print = false // set to true to see output
})

afterEach(() => {
  stdout.stop()
  stderr.stop()
})

// quick normalization to test windows/unix paths
global.n = p => path.normalize(p)
global.r = p => path.resolve(p)

/**
 * Checks that package.json has all needed dependencies specified.
 *
 * @param {object} dependencies An object representing expected package.json dependencies.
 * @param {object} devDependencies An object representing expected package.json dev dependencies.
 */
global.assertDependencies = (fs, dependencies, devDependencies) => {
  expect(JSON.parse(fs.readFileSync('package.json').toString())).toEqual(expect.objectContaining({
    dependencies,
    devDependencies
  }))
}

/**
 * Checks that package.json has all needed scripts specified.
 *
 * @param {object} scripts An object representing expected package.json scripts.
 */
global.assertScripts = (fs, scripts) => {
  expect(JSON.parse(fs.readFileSync('package.json').toString())).toEqual(expect.objectContaining({
    scripts
  }))
}