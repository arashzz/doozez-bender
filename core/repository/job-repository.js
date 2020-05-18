const jobSubject = require('../provider/job-subject-provider'),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    logger = require('../service/logger-service').logger
    collectionName = 'job'

exports.subscribe = function() {
    logger.debug
    jobSubject.createSubject().subscribe({
        next: (job) => save(job)
    })
    logger.log('debug', 'subscribed to subject [createSubject]')

    jobSubject.updateSubject().subscribe({
        next: (item) => update(item.model, item.filter)
    })
    logger.log('debug', 'subscribed to subject [updateSubject]')
}

function save(job) {
    logger.log('debug', 'save is called with job data %s', job)
    let collection = dbClient.getCollection(collectionName)
    collection.insertOne(job)
}

function update(job, filter) {
    logger.log('debug', 'update is called with filter %s', filter)
    let collection = dbClient.getCollection(collectionName)
    from(collection.findOneAndUpdate(filter, job)).subscribe({
        next: result => {
            if(!result.lastErrorObject || !result.lastErrorObject.updatedExisting) {
                logger.error('job update failed with filter %s' + filter)
            }
        },
        error: error => {
            logger.error('updated failed with error %s', error)
        }
    })
}

exports.find = function(filter) {
    logger.log('debug', 'find is called with filter %s', filter)
    let collection = dbClient.getCollection(collectionName)
    return from(collection.findOne(filter))
}