const moment = require('moment'),
    transactionSubject = require("../provider/transaction-subject-provider"),
    logger = require('../service/logger-service').logger,
    namespace = 'core.validation.transaction-validation'

exports.subscribe = function() {
    transactionSubject.validatePost().subscribe({
        next: (dataModel) => validateCreateModel(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.validatePost]', namespace)
    
    transactionSubject.validateGet().subscribe({
        next: (dataModel) => validateQueryModel(dataModel)
    })
    logger.log('debug', '<%s> subscribed to subject [transactionSubject.validatePost]', namespace)
}

function validateQueryModel(dataModel) {
    logger.log('debug', '<%s.%s> is called with dataModel %s', namespace, arguments.callee.name, dataModel.data)
    let errors = []

    if(errors.length == 0) {
        transactionSubject.createFilter().next(dataModel)
    }
    else {
        dataModel.result = errors
        transactionSubject.validateGet().error(dataModel)
    }
}

function validateCreateModel(dataModel) {
    logger.log('debug', '<%s.%s> is called with dataModel %s', namespace, arguments.callee.name, dataModel.data)
    let errors = []
    if(!dataModel.data) {
        errors.push("transaction is null")
    }
    if(!dataModel.data.commodityId) {
        errors.push("commodity cannot be empty")
    }
    if(!dataModel.data.amount || isNaN(dataModel.data.amount) || dataModel.data.amount <= 0) {
        errors.push("transaction amount is invalid")
    }
    if(!dataModel.data.transactionDate || !moment(dataModel.data.transactionDate, "yyyy-MM-dd").isValid()) {
        errors.push("transaction date is invalid")
    }
    if(errors.length == 0) {
        transactionSubject.insert().next(dataModel)
    }
    else {
        dataModel.result = errors
        transactionSubject.validatePost().error(dataModel)
    }
}