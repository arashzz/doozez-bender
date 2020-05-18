const transactionSubject = require('../provider/transaction-subject-provider'),
    transactionRepository = require('../repository/transaction-repository'),
    moment = require('moment'),
    { map } = require('rxjs/operators'),
    uuid = require("uuid"),
    logger = require('../service/logger-service').logger

exports.subscribe = function() {
    transactionSubject.validatedSubject().subscribe({
        next: (model) => createTransaction(model.data)
    })
    logger.log('debug', 'subscribed to subject [validatedSubject]')
}

exports.generateRawTransaction = function() {
    return {
        username: null,
        amount: null,
        transactionDate: null,
        commodityId: null,
        externalId: uuid.v4(),
        createdDate: null
    }
}

exports.getTransactions = function(criteria) {
    logger.log('debug', 'getTransactions is called with criteria %s', criteria)
    filter = {}
    if(criteria) {
        if(criteria.commodities) {
            filter.commodityId = {
                $in: criteria.commodities.split(',').map(Number)
            }
        }
        if(criteria.username) {
            filter.username = {
                $eq: criteria.username
            }
        }
    }
    return transactionRepository.findAll(filter)
}

function createTransaction(trnx) {
    logger.log('debug', 'createTransaction is called with transaction data %s', trnx)
    trnx.createdDate = new Date().getTime()
    transactionSubject.createSubject().next(trnx)
}
