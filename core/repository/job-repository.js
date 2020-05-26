
const jobSubject = require('../provider/job-subject-provider'),
    { from } = require('rxjs'),
    dbClient = require('./db-client'),
    logger = require('../service/logger-service').logger,
    collectionName = 'job',
    namespace = 'core.repository.job-repository'

exports.subscribe = function() {
    jobSubject.create().subscribe({
        next: (job) => insert(job)
    })
    logger.log('debug', '<%s> subscribed to subject [jobSubject.create]', namespace)

    jobSubject.update().subscribe({
        next: (updateQuery) => update(updateQuery)
    })
    logger.log('debug', '<%s> subscribed to subject [jobSubject.update]', namespace)
}

exports.find = function(filter) {
    logger.log('debug', 'find is called with filter %s', filter)
    let collection = dbClient.getCollection(collectionName)
    return from(collection.findOne(filter))
}

function insert(jobCreationModel) {
    logger.log('debug', '<%s.%s> is called with model %s', namespace, arguments.callee.name, jobCreationModel.job)
    let collection = dbClient.getCollection(collectionName)
    from(collection.insertOne(jobCreationModel.job)).subscribe({
        next: result => {
            if(result.result.ok == 1) {
                jobSubject.runTask().next(jobCreationModel)
            }
            else {
                logger.error('job insert failed for model %s' + JSON.stringify(job))
            }
        },
        error: error => {
            logger.error('job insert failed with error %s for model %s', error, job)
        }
    })
}

function update(updateQuery) {
    logger.log('debug', '<%s.%s> is called with filter %s and update %s', namespace, arguments.callee.name, 
        JSON.stringify(updateQuery.filter), JSON.stringify(updateQuery.update))
    let collection = dbClient.getCollection(collectionName)
    from(collection.findOneAndUpdate(
        updateQuery.filter,
        updateQuery.update
    )).subscribe({
        next: result => {
            if(result.ok != 1) {
                logger.error('<%s.%s> failed for filter %s and update %s', 
                namespace, arguments.callee.name, JSON.stringify(updateQuery.filter), JSON.stringify(updateQuery.update))
            }
            else if(result.ok == 1 && !result.lastErrorObject.updatedExisting) {
                logger.error('<%s.%s> inserted the job as new while should have updated an existing job with filter %s', 
                namespace, arguments.callee.name, JSON.stringify(updateQuery.filter), JSON.stringify(updateQuery.filter))
            }
        },
        error: error => {
            logger.error('<%s.%s> failed for filter %s and update %s with error %s', 
            namespace, arguments.callee.name, updateQuery.filter, updateQuery.update, error)
        }
    })
}