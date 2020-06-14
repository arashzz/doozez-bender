const { of } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class CommodityRepositoryMock {
    constructor({ logger, subjectProvider, dbClient }) {
        this.namespace = 'core.repository.commodity-repository-mock'
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.dbClient = dbClient
        this.subscribe()
    }
    subscribe() {
        
    }
    findAll() {
        let collection = this.dbClient.getCollection('commodity')
        return of(collection)
    }
}

module.exports = CommodityRepositoryMock

CommodityRepositoryMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}