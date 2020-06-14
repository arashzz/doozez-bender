const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class DbClientMock {
    constructor({ logger }) {
        this.transactions = []
        this.jobs = []
        this.commodities = require('../data/commodities.json')
        this.namespace = 'core.repository.db-client-mock'
        this.logger = logger;
        this.connect()
    }
    connect() {
        this.logger.info('mock >>> connecting to database...')
    }
    getCollection(name) {
        if(name == 'job') {
            this.logger.log('debug', 'job data is %s', JSON.stringify(this.jobs))
            return this.jobs
        }
        else if(name == 'transaction') {
            this.logger.log('debug', 'transaction data is %s', JSON.stringify(this.transactions))
            return this.transactions
        }
        else if(name == 'commodity') {
            this.logger.log('debug', 'commodity data is %s', JSON.stringify(this.commodities))
            return this.commodities
        }
    }
}

module.exports = DbClientMock

DbClientMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}