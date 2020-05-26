const transactionSubject = require("../provider/transaction-subject-provider"),
    jobSubject = require('../provider/job-subject-provider'),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    collectionName = 'transaction',
    logger = require('../service/logger-service').logger,
    namespace = 'core.repository.transaction-repository'

exports.subscribe = function() {
    transactionSubject.insert().subscribe({
        next: (dataModel) => insert(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.insert]', namespace)

    transactionSubject.find().subscribe({
        next: (dataModel) => find(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.find]', namespace)
}

function insert(dataModel) {
    logger.log('debug', '<%s.%s> is called with model %s', namespace, arguments.callee.name, dataModel.data)
    let collection = dbClient.getCollection(collectionName)
    from(collection.insertOne(dataModel.data)).subscribe({
        next: res => {
            if(res.result.ok == 1) {
                transactionSubject.enrich().next(dataModel)
            }
            else {
                logger.log('debug', '<%s.%s> failed to save transaction model %s ', namespace, arguments.callee.name, dataModel.data)
                dataModel.result = 'something unexpected happened while saving the transaction'
                transactionSubject.insert().error(dataModel)
            }
        },
        error: err => {
            logger.log('debug', '<%s.%s> failed to save transaction model %s with error %s', namespace, arguments.callee.name, dataModel.data, err)
            dataModel.result = 'something unexpected happened while saving the transaction'
            transactionSubject.insert().error(dataModel)
        }
    })
}

function find(dataModel) {
    logger.log('debug', '%s.%s is called with filter %s', namespace, arguments.callee.name, dataModel.data)
    let collection = dbClient.getCollection(collectionName)
    from(collection.find(dataModel.data).toArray()).subscribe({
        next: res => {
            dataModel.datas = res
            transactionSubject.enrichList().next(dataModel)
        },
        error: err => {
            logger.log('debug', '<%s.%s> failed to find transactions with filter %s and jobId %s with error %s', 
                namespace, arguments.callee.name, dataModel.data, dataModel.jobId, err)
            dataModel.result = 'something unexpected happened while searching transactions'
            transactionSubject.find().error(dataModel)
        }
    })
}
