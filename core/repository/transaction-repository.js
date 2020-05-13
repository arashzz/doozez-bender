const transactionSubject = require("../provider/transaction-subject-provider"),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    collectionName = 'transaction'
    


exports.subscribe = function() {
    transactionSubject.createSubject().subscribe({
        next: (trnx) => save(trnx)
    });
}

function save(trnx) {
    let collection = dbClient.getCollection(collectionName)
    from(collection.insertOne(trnx)).subscribe({
        next: res => {
            transactionSubject.createResultSubject().next(trnx)
        },
        error: err => {
            transactionSubject.createResultSubject().error(trnx)
            //TODO: error logging with job id !!!
        }
    })
}

exports.findAll = function(filter) {
    let collection = dbClient.getCollection(collectionName)
    return from(collection.find(filter).toArray())
}
