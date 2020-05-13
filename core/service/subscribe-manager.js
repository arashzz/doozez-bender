
const jobService =  require('./job-service')
const jobRepository = require('../repository/job-repository')
const transactionService = require('./transaction-service')
const transactionValidator = require('../validation/transaction-validation')
const transactionRepository = require('../repository/transaction-repository')

exports.init = function() {
    console.log('initiating subjects')
    jobService.subscribe()
    transactionService.subscribe()
    transactionValidator.subscribe()
    transactionRepository.subscribe()
    jobRepository.subscribe()
}