const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class DbClientMock {
    constructor({logger}) {
        this.namespace = 'core.repository.db-client-mock'
        this.logger = logger;
        this.connect()
    }
    connect() {
        this.logger.info('mock >>> connecting to database...')
        this.logger.info('mock >>> connected to database...')
    }
    // getCollection(name) {
        
    // }
}

module.exports = DbClientMock

DbClientMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}