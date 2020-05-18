const transactionSubject = require('../provider/transaction-subject-provider'),
    jobSubject = require('../provider/job-subject-provider'),
    jobRepository = require('../repository/job-repository')
    jobEnum = require('../enum/job-enums'),
    uuid = require("uuid"),
    logger = require('./logger-service').logger

exports.generateRawJob = function() {
    return {
        id: uuid.v4(),
        resource: {
            externalId: '',
            type: ''
        }
    }
}

exports.subscribe = function() {
    transactionSubject.validatedSubject().subscribe({
        next: (model) => createJob(model, jobEnum.status.IN_PROGRESS),
        error: (model) => createJob(model, jobEnum.status.FAILED)
    })
    logger.log('debug', 'subscribed to subject [validatedSubject]')

    transactionSubject.createResultSubject().subscribe({
        next: (trnx) => updateJob(trnx, jobEnum.status.SUCCESS),
        error: (trnx, error) => updateJob(trnx.externalId, jobEnum.status.FAILED, error)
    })
    logger.log('debug', 'subscribed to subject [createResultSubject]')
}

exports.getJobById = function(id) {
    logger.log('debug', 'getJobById is called with the id [%s]', id)
    return jobRepository.find({id: id})
}

function createJob(model, status) {
    logger.log('debug', 'createJob is called with the model %s and status %s', model, status)
    model.job.status = status
    jobSubject.createSubject().next(model.job)
}

function updateJob(model, status, error) {
    logger.log('debug', 'updateJob is called with job data %s', model)
    jobSubject.updateSubject().next({
        model:{
            $set: { status: status }
        }, 
        filter:{
            'resource.externalId': model.externalId
        }
    })
    if(error) {
        logger
    }
}