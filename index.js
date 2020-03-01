const deleteLowResImages = require('./delete-script')

// Set these before running script
const directory = 'data'
const resolutionLimit = 16

deleteLowResImages(directory, resolutionLimit)
