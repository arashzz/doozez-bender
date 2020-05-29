const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix') 

class JobRepositoryMock {
    constructor({ logger, subjectProvider }) {
        this.namespace = 'core.repository.job-repository'
        this.logger = logger
        this.subjectProvider = subjectProvider
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
        
    }
    update(updateQuery) {
        
    }
    find(filter) {
        
    }
}

module.exports = JobRepositoryMock

JobRepositoryMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}