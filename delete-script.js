const fsp = require('fs').promises
const path = require('path')

const { promisify } = require('util')
const recursive = promisify(require('recursive-readdir'))
const sizeOf = promisify(require('image-size'))
const { bold, red } = require('colors')

module.exports = deleteLowResImages

function deleteLowResImages (directory, resolutionLimit, acceptedFiletypes) {
  console.log(bold('📜  Initiating script...\n'))

  return getListOfFiles(directory, acceptedFiletypes)
    .then(files => filterLowResImages(files, resolutionLimit))
    .then(files => deleteFiles(files))
    .catch(() => console.error(red('Something went wrong 😞')))
    .finally(() => console.log(bold(`\n👋  That's all folks!`)))
}

function getListOfFiles (directory, acceptedFiletypes) {
  console.log(bold('📂  Getting list of files...\n'))

  return recursive(directory)
    .then(files =>
      files.filter(file => {
        const extension = getExtension(file).toLowerCase()
        return acceptedFiletypes.includes(extension)
      }))
    .catch(err => {
      console.error(`Couldn't read directory: ${directory}`)
      throw err
    })

  function getExtension (filePath) {
    const pathSplit = filePath.split('.')
    const filename = pathSplit[pathSplit.length - 1]

    return filename
  }
}

function filterLowResImages (files, resolutionLimit) {
  console.log(bold('🧮  Calculating image resolutions...'))

  const promiseChain = files.map(file => calculateResolution(file))
  return Promise.all(promiseChain)
    .then(resolutions => {
      console.log(`Resolutions:`, resolutions)
      return files.filter((file, index) => resolutions[index] <= resolutionLimit)
    })
    .catch(err => {
      console.error(red(`Calculation failed: ${err.message}`))
      throw err
    })

  function calculateResolution (file) {
    return sizeOf(file)
      .then(dimensions => (dimensions.width / 1000) * (dimensions.height / 1000))
  }
}

function deleteFiles (files) {
  if (files.length !== 0) {
    console.log(bold('\n🔨  Deleting files...'))

    return files.forEach(file =>
      fsp.unlink(file)
        .then(() => console.log(`Deleted: ${getFilename(file)}`))
        .catch(err => {
          console.error(red(`Couldn't delete file: ${file}`))
          throw err
        }))
  } else {
    console.log(bold('\n👍  No files to delete!'))
  }

  function getFilename (filePath) {
    const pathSplit = filePath.split(path.sep)
    const filename = pathSplit[pathSplit.length - 1]

    return filename
  }
}
