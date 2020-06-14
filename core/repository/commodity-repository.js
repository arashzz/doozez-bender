const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix') 

class CommodityRepository {
    constructor({ logger, dbClient, subjectProvider }) {
        this.namespace = 'core.repository.commodity-repository'
        this.collectionName = 'commodity'
        this.logger = logger
        this.dbClient = dbClient
        this.subjectProvider = subjectProvider
        this.subscribe()
    }
    subscribe() {
        
    }
    findAll() {
        this.logger.log('debug', '<%s.findAll> is called', this.namespace)
        return from(this.dbClient.getCollection(this.collectionName).find().toArray())
    }
}

module.exports = CommodityRepository

CommodityRepository[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}