const transactionSubject = require("../provider/transaction-subject-provider"),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    collectionName = 'transaction',
    logger = require('../service/logger-service').logger
    


exports.subscribe = function() {
    transactionSubject.createSubject().subscribe({
        next: (trnx) => save(trnx)
    });
    logger.log('debug', 'subscribed to subject [createSubject]')
}

function save(trnx) {
    logger.log('debug', 'save is called with transaction data %s', trnx)
    let collection = dbClient.getCollection(collectionName)
    from(collection.insertOne(trnx)).subscribe({
        next: res => {
            transactionSubject.createResultSubject().next(trnx)
        },
        error: err => {
            transactionSubject.createResultSubject().error(trnx)
            logger.log('debug', 'failed to save transaction with error %s', err)
        }
    })
}

exports.findAll = function(filter) {
    logger.log('debug', 'findAll is called with filter %s', filter)
    let collection = dbClient.getCollection(collectionName)
    return from(collection.find(filter).toArray())
}
