const transactionSubject = require('../provider/transaction-subject-provider'),
    jobSubject = require('../provider/job-subject-provider'),
    uuid = require("uuid"),
    { from } = require('rxjs'),
    { map } = require('rxjs/operators'),
    logger = require('../service/logger-service').logger,
    namespace = 'core.service.transaction-service'

exports.subscribe = function() {
    transactionSubject.enrich().subscribe({
        next: (dataModel) => enrichTransaction(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.enrich]', namespace)

    transactionSubject.enrichList().subscribe({
        next: (dataModel) => enrichTransactions(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.enrichList]', namespace)

    transactionSubject.createFilter().subscribe({
        next: (dataModel) => createFilter(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.createFilter]', namespace)
}

exports.getRawTransaction = function() {
    return {
        username: null,
        amount: null,
        transactionDate: null,
        commodityId: null,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
    }
}

function createFilter(dataModel) {
    let filter = {
        username: dataModel.data.username,
        createdAt: {
            $gt: parseInt(dataModel.data.from),
            $lt: parseInt(dataModel.data.to)
        }
    }
    if(dataModel.data.commodityId) {
        filter.commodityId = commodityId
    }
    dataModel.data = filter
    transactionSubject.find().next(dataModel)
}

function enrichTransactions(dataModel) {
    dataModel.result = []
    from(dataModel.transactions).pipe(
        map(it => toApiModel(it))
    ).subscribe({
        next: (it) => dataModel.result.push(it),
        complete: () => jobSubject.updateResult().next(dataModel)
    })
}

function enrichTransaction(dataModel) {
    dataModel.result = toApiModel(dataModel.data)
    jobSubject.updateResult().next(dataModel)
}

function toApiModel(transaction) {
    return {
        amount: transaction.amount,
        transactionDate: transaction.transactionDate,
        commodityId: transaction.commodityId
    }
}