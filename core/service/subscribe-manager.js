const jobService =  require('./job-service'),
    jobRepository = require('../repository/job-repository'),
    transactionService = require('./transaction-service'),
    transactionValidator = require('../validation/transaction-validation'),
    transactionRepository = require('../repository/transaction-repository'),
    logger = require('../service/logger-service').logger,
    namespace = 'core.service.subscribe-manager'

exports.init = function() {
    logger.info('<%s.%s> is called to initiate subjects and their subscriptions', namespace, arguments.callee.name)
    jobService.subscribe()
    transactionService.subscribe()
    transactionValidator.subscribe()
    transactionRepository.subscribe()
    jobRepository.subscribe()
}