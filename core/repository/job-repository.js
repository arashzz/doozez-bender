const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix') 

class JobRepository {
    constructor({ logger, dbClient, subjectProvider }) {
        this.namespace = 'core.repository.job-repository'
        this.collectionName = 'job'
        this.logger = logger
        this.dbClient = dbClient
        this.subjectProvider = subjectProvider
        this.subscriptions = {}
        this.subscribe()
    }
    subscribe() {
        this.subscriptions['job.create'] = this.subjectProvider.job.create().subscribe({
            next: (jobCreationModel) => this.insert(jobCreationModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.job.create]', this.namespace)
    
        this.subscriptions['job.update'] = this.subjectProvider.job.update().subscribe({
            next: (updateQuery) => this.update(updateQuery)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.job.update]', this.namespace)
    }
    unsubscribe() {
        for(let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe()
            this.logger.log('debug', '<%s> unsubscribed to [%s]', this.namespace, key)
        }
    }
    insert(jobCreationModel) {
        this.logger.log('debug', '<%s.insert> is called with model %s', this.namespace, jobCreationModel.job)
        from(this.dbClient.getCollection(this.collectionName).insertOne(jobCreationModel.job)).subscribe({
            next: result => {
                if(result.result.ok == 1) {
                    this.subjectProvider.job.runTask().next(jobCreationModel)
                }
                else {
                    this.logger.error('job insert failed for model %s' + JSON.stringify(jobCreationModel.job))
                }
            },
            error: error => {
                this.logger.error('job insertion failed with error %s for model %s', error, jobCreationModel.job)
            }
        })
    }
    update(updateQuery) {
        this.logger.log('debug', '<%s.update> is called with filter %s and update %s', this.namespace, 
            JSON.stringify(updateQuery.filter), JSON.stringify(updateQuery.update))
        from(this.dbClient.getCollection(this.collectionName).findOneAndUpdate(
            updateQuery.filter,
            updateQuery.update
        )).subscribe({
            next: result => {
                if(result.ok != 1) {
                    this.logger.error('<%s.update> failed for filter %s and update %s', 
                    this.namespace, JSON.stringify(updateQuery.filter), JSON.stringify(updateQuery.update))
                }
                else if(result.ok == 1 && !result.lastErrorObject.updatedExisting) {
                    this.logger.error('<%s.update> inserted the job as new while should have updated an existing job with filter %s', 
                    this.namespace, JSON.stringify(updateQuery.filter))
                }
            },
            error: error => {
                this.logger.error('<%s.update> failed for filter %s and update %s with error %s', 
                this.namespace, updateQuery.filter, updateQuery.update, error)
            }
        })
    }
    find(filter) {
        this.logger.log('debug', '<%s.find> is called with filter %s', this.namespace, filter)
        return from(this.dbClient.getCollection(this.collectionName).findOne(filter))
    }
}

module.exports = JobRepository

JobRepository[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}