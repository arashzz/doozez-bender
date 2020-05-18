const moment = require('moment'),
    transactionSubProvider = require("../provider/transaction-subject-provider"),
    logger = require('../service/logger-service').logger

exports.subscribe = function() {
    transactionSubProvider.validationSubject().subscribe({
        next: (model) => validateCreationModel(model)
    })
    logger.log('debug', 'subscribed to subject [validationSubject]')
}

function validateCreationModel(model) {
    logger.log('debug', 'validateCreationModel with model %', model)
    let data = model.data
    logger.log('debug', 'validating data %', data)
    model.validation = {
        result: true,
        reason: []
    }
    if(!data) {
        model.validation.result = false
        model.validation.reason.push("transaction model is null")
    }
    if(!data.commodityId) {
        model.validation.result = false
        model.validation.reason.push("commodity cannot be empty")
    }
    if(!data.amount || isNaN(data.amount) || data.amount <= 0) {
        model.validation.result = false
        model.validation.reason.push("transaction amount is invalid")
    }
    if(!data.transactionDate || !moment(data.transactionDate, "yyyy-MM-dd").isValid()) {
        model.validation.result = false
        model.validation.reason.push("transaction date is invalid")
    }
    if(model.validation.result) {
        transactionSubProvider.validatedSubject().next(model)
    }
    else {
        transactionSubProvider.validatedSubject().error(model)
    }
}