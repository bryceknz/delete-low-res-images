const fsp = require('fs').promises
const recursive = require('recursive-readdir')
const sizeOf = require('image-size')

module.exports = deleteLowResImages

function deleteLowResImages (directory, resolutionLimit) {
  recursive(directory, (err, files) => {
    if (err) {
      console.error(`Couldn't read directory: ${err.message}`)
      return
    }

    files.forEach((file) => {
      const resolutionInMP = calculateResolution(file)

      if (resolutionInMP <= resolutionLimit) {
        fsp.unlink(file)
          .then(() => console.log(`File removed: ${file}`))
          .catch(err => console.error(`Couldn't delete file: ${err.message}`))
      }
    })
  })
}

function calculateResolution (file) {
  const dimensions = sizeOf(file)
  const resolutionInMP = (dimensions.width / 1000) * (dimensions.height / 1000)

  return resolutionInMP
}