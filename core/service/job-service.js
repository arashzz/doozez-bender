const transactionSubject = require('../provider/transaction-subject-provider'),
    jobSubject = require('../provider/job-subject-provider'),
    jobRepository = require('../repository/job-repository')
    jobEnum = require('../enum/job-enums'),
    uuid = require("uuid")

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

    transactionSubject.createResultSubject().subscribe({
        next: (trnx) => updateJob(trnx, jobEnum.status.SUCCESS),
        error: (trnx, error) => updateJob(trnx.externalId, jobEnum.status.FAILED, error)
    })
}

exports.getJobById = function(id) {
    return jobRepository.find({id: id})
}

function createJob(model, status) {
    model.job.status = status
    jobSubject.createSubject().next(model.job)
}

function updateJob(model, status, error) {
    jobSubject.updateSubject().next({
        model:{
            $set: { status: status }
        }, 
        filter:{
            'resource.externalId': model.externalId
        }
    })
    //TODO: error should be part of job
}