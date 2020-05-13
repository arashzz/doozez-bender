const transactionSubject = require('../provider/transaction-subject-provider'),
    jobSubject = require('../provider/job-subject-provider'),
    jobRepository = require('../repository/job-repository')
    jobEnum = require('../enum/job-enums')

exports.subscribe = function() {
    transactionSubject.validatedSubject().subscribe({
        next: (model) => createJob(model, jobEnum.status.PENDING),
        error: (model) => createJob(model, jobEnum.status.FAILED)
    })

    transactionSubject.createResultSubject().subscribe({
        next: (trnx) => updateJob(trnx, jobEnum.status.SUCCESS),
        error: (trnx, error) => updateJob(trnx.job_id, jobEnum.status.FAILED, error)
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
            'resource.external_id': model.external_id
        }
    })
    //TODO: error should be part of job
}