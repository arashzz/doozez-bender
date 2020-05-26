const transactionSubject = require('../provider/transaction-subject-provider'),
    jobSubject = require('../provider/job-subject-provider'),
    jobRepository = require('../repository/job-repository'),
    jobEnum = require('../enum/job-enums'),
    uuid = require("uuid"),
    logger = require('./logger-service').logger,
    namespace = 'core.service.job-service'

exports.getRawJob = function(resourceExternalId) {
    //TODO: map 
    return {
        id: uuid.v4(),
        status: jobEnum.status.IN_PROGRESS,
        result: null,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
    }
}

exports.subscribe = function() {

    jobSubject.runTask().subscribe({
        next: (jobCreationModel) => runTask(jobCreationModel)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.runTask]', namespace)

    transactionSubject.validateGet().subscribe({
        error: (dataModel) => update(dataModel, false)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.validateGet]', namespace)

    transactionSubject.validatePost().subscribe({
        error: (dataModel) => update(dataModel, false)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.validatePost]', namespace)

    transactionSubject.insert().subscribe({
        error: (dataModel) => update(dataModel, false)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.insert]', namespace)

    transactionSubject.find().subscribe({
        error: (dataModel) => update(dataModel, false)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.find]', namespace)
    
    jobSubject.updateResult().subscribe({
        next: (dataModel) => update(dataModel, true)
    })
    logger.log('debug', '<%s> subscribed to [jobSubject.updateResult]', namespace)
}

exports.getJobById = function(id) {
    logger.log('debug', '<%s.%s> is called with the id [%s]',namespace, arguments.callee.name, id)
    return jobRepository.find({id: id})
}

function runTask(jobCreationModel) {
    logger.log('debug', '<%s.%s> is called to run task [%s] with data %s', 
        namespace, arguments.callee.name, jobCreationModel.task.name, jobCreationModel.task.data)
    jobCreationModel.task.subject.next({
        jobId: jobCreationModel.job.id,
        data: jobCreationModel.task.data
    })
}

function update(dataModel, success) {
    logger.log('debug', '<%s.%s> is called with status of %s for job id %s', namespace, arguments.callee.name, success, dataModel.jobId)
    let status = jobEnum.status.SUCCESS
    if(!success) {
        status = jobEnum.status.FAILED
    }
    jobSubject.update().next({
        filter: {
            id: dataModel.jobId
        },
        update: {
            $set: {
                status: status,
                result: dataModel.result,
                updatedAt: new Date().getTime()
            }    
        }
    })
}