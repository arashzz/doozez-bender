const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class JobRepositoryMock {
    constructor({ logger, subjectProvider, dbClient }) {
        this.namespace = 'core.repository.job-repository-mock'
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.dbClient = dbClient
        this.subscribe()
    }
    subscribe() {
        this.subjectProvider.job.create().subscribe({
            next: (jobCreationModel) => this.insert(jobCreationModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.job.create]', this.namespace)
    
        this.subjectProvider.job.update().subscribe({
            next: (updateQuery) => this.update(updateQuery)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.job.update]', this.namespace)
    }
    insert(jobCreationModel) {
        let collection = this.dbClient.getCollection('job')
        collection.push(jobCreationModel.job)
        this.subjectProvider.job.runTask().next(jobCreationModel)
    }
    update(updateQuery) {
        let collection = this.dbClient.getCollection('job')
        let job = collection.find(job => job.id = updateQuery.filter.id)
        job.status = updateQuery.update.$set.status
        job.result = updateQuery.update.$set.result
        job.updatedAt = updateQuery.update.$set.updatedAt
    }
    find(filter) {
        let collection = this.dbClient.getCollection('job')
        let job = collection.find(job => job.id = filter.id)
        return from([job])
    }
}

module.exports = JobRepositoryMock

JobRepositoryMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}