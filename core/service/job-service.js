const jobEnum = require('../enum/job-enums'),
    uuid = require("uuid")
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')
    

class JobService {
    constructor({ logger, subjectProvider, jobRepository }) {
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.jobRepository = jobRepository
        this.namespace = 'core.service.job-service'
        this.subscribe()
    }
    subscribe() {
        //job subscriptions
        this.subjectProvider.job.runTask().subscribe({
            next: (jobCreationModel) => this.runTask(jobCreationModel)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.job.runTask]', this.namespace)

        this.subjectProvider.job.updateResult().subscribe({
            next: (dataModel) => this.update(dataModel, true)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.job.updateResult]', this.namespace)

        //transaction subscriptions
        this.subjectProvider.transaction.validateGet().subscribe({
            error: (dataModel) => this.update(dataModel, false)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.transaction.validateGet]', this.namespace)

        this.subjectProvider.transaction.validatePost().subscribe({
            error: (dataModel) => this.update(dataModel, false)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.transaction.validatePost]', this.namespace)
    
        this.subjectProvider.transaction.insert().subscribe({
            error: (dataModel) => this.update(dataModel, false)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.transaction.insert]', this.namespace)
    
        this.subjectProvider.transaction.find().subscribe({
            error: (dataModel) => this.update(dataModel, false)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.transaction.find]', this.namespace)
    }
    getRawJob() {
        //TODO: map 
        return {
            id: uuid.v4(),
            status: jobEnum.status.IN_PROGRESS,
            result: undefined,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }   
    }
    runTask(jobCreationModel) {
        this.logger.log('debug', '<%s.runTask> is called to run task [%s] with data %s', 
            this.namespace, jobCreationModel.task.name, jobCreationModel.task.data)
        jobCreationModel.task.subject.next({
            jobId: jobCreationModel.job.id,
            data: jobCreationModel.task.data
        })
    }
    update(dataModel, success) {
        this.logger.log('debug', '<%s.update> is called with status of %s for job id %s', 
            this.namespace, success, dataModel.jobId)
        let status = jobEnum.status.SUCCESS
        if(!success) {
            status = jobEnum.status.FAILED
        }
        this.subjectProvider.job.update().next({
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
    getJobById(id) {
        this.logger.log('debug', '<%s.getJobById> is called with the id [%s]', this.namespace, id)
        return this.jobRepository.find({id: id})
    }
}

module.exports = JobService

JobService[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}