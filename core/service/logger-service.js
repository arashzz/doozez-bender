const loggingConfig = require('config').get('logging'),
    { createLogger, transports, format } = require('winston'),
    { combine, timestamp } = format

const logger = createLogger({
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
  });

exports.logger = logger
