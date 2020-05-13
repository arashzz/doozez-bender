const transactionSubject = require('../provider/transaction-subject-provider'),
    transactionRepository = require('../repository/transaction-repository'),
    moment = require('moment'),
    { map } = require('rxjs/operators')

exports.subscribe = function() {
    transactionSubject.validatedSubject().subscribe({
        next: (model) => createTransaction(model.data),
        //error: (model) => createTransaction(model.data)
    })
}

exports.getTransactions = function(criteria) {
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
    trnx.created_date = new Date().getTime()
    transactionSubject.createSubject().next(trnx)
}
