const jobEnum = require('../enum/job-enums')
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')
    
class JobService {
    constructor({ logger, subjectProvider, jobRepository, uuid }) {
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.jobRepository = jobRepository
        this.uuid = uuid
        this.namespace = 'core.service.job-service'
        this.subscriptions = {}
        this.subscribe()
    }
    subscribe() {
        this.subscriptions['subjectProvider.job.runTask'] = this.subjectProvider.job.runTask().subscribe({
            next: (jobCreationModel) => this.runTask(jobCreationModel)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.job.runTask]', this.namespace)

        this.subscriptions['subjectProvider.job.updateResult'] = this.subjectProvider.job.updateResult().subscribe({
            next: (dataModel) => this.update(dataModel, dataModel.isError)
        })
        this.logger.log('debug', '<%s> subscribed to [subjectProvider.job.updateResult]', this.namespace)
    }
    unsubscribe() {
        for(let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe()
            this.logger.log('debug', '<%s> unsubscribed to [%s]', this.namespace, key)
        }
    }
    getRawJob() {
        //TODO: map 
        return {
            id: this.uuid.v4(),
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
    update(dataModel, isError) {
        this.logger.log('debug', '<%s.update> is called with isError of %s for job id %s', 
            this.namespace, isError, dataModel.jobId)
        this.subjectProvider.job.update().next({
            filter: {
                id: dataModel.jobId
            },
            update: {
                $set: {
                    status: isError == true? jobEnum.status.FAILED: jobEnum.status.SUCCESS,
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