const { RESOLVER, Lifetime, InjectionMode } = require('awilix')
    

class CommodityService {
    constructor({ logger, subjectProvider, commodityRepository }) {
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.commodityRepository = commodityRepository
        this.namespace = 'core.service.commodity-service'
        this.subscribe()
    }
    subscribe() {
    
    }
    getAll() {
        this.logger.log('debug', '<%s.getAll> is called', this.namespace)
        return this.commodityRepository.findAll()
    }
}

module.exports = CommodityService

CommodityService[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}