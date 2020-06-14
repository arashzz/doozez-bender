const { createLogger, format, transports } = require('winston')

const {
    combine,
    timestamp
} = format

const loggingConfig = require('config').get('logging')

function loggerFactory() {
    return createLogger({
        level: loggingConfig.level,
        exitOnError: loggingConfig.exitOnError,
        format: combine(
            timestamp(),
            format.splat(),
            format.json()
        ),
        transports: [
          new transports.Console() 
        ],
        exceptionHandlers: [
            new transports.Console() 
        ]
    })
}

module.exports = loggerFactory