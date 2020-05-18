const logger = require('../service/logger-service').logger

exports.process = function(envName, required) {
    let envar = process.env[envName]
    if(envar) {
        return envar
    }
    if(required) {
        logger.error('environment variable [%s] is required but it was not provided', envName)
    }
}
