const jobSubject = require('../provider/job-subject-provider'),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    collectionName = 'job'

exports.subscribe = function() {
    jobSubject.createSubject().subscribe({
        next: (job) => save(job)
    })
    jobSubject.updateSubject().subscribe({
        next: (item) => update(item.model, item.filter)
    })
}

function save(job) {
    let collection = dbClient.getCollection(collectionName)
    collection.insertOne(job)
}

function update(job, filter) {
    let collection = dbClient.getCollection(collectionName)
    from(collection.findOneAndUpdate(filter, job)).subscribe({
        next: result => {
            if(!result.lastErrorObject || !result.lastErrorObject.updatedExisting) {
                //TODO: log that job is not updated
                //log the filter & updating fields
            }
        },
        error: error => {
            //TODO: log the error
            //log the filter & updating fields
        }
    })
    

}

exports.find = function(query) {
    let collection = dbClient.getCollection(collectionName)
    return from(collection.findOne(query))
}