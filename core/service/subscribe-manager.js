
const jobService =  require('./job-service'),
    jobRepository = require('../repository/job-repository'),
    transactionService = require('./transaction-service'),
    transactionValidator = require('../validation/transaction-validation'),
    transactionRepository = require('../repository/transaction-repository'),
    logger = require('../service/logger-service').logger

exports.init = function() {
    logger.info('initiating subjects and their subscriptions')
    jobService.subscribe()
    transactionService.subscribe()
    transactionValidator.subscribe()
    transactionRepository.subscribe()
    jobRepository.subscribe()
}