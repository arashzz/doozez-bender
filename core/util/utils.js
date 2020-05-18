path = require('path')

exports.getModuleName = function(filename) {
    return path.basename(filename)
}

