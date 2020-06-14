const  { from } = require('rxjs'),
    { map } = require('rxjs/operators'),
    mongo = require('mongodb')

const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class DbClient {
    constructor({logger, config}) {
        this.namespace = 'core.repository.db-client'
        this.config = config
        this.logger = logger;
        this._db = undefined
        this.connect()
    }
    connect() {
        let dbUrl = 'mongodb+srv://'
        if(this.config.authRequired) {
            dbUrl += `${this.config.username}:${this.config.password}@`
        } 
        dbUrl += `${this.config.host}/${this.config.dbName}`
        if(this.config.connectOpts) {
            dbUrl += this.config.connectOpts
        }
        this.logger.info('connecting to database [%s] ...', this.config.host)
        from(mongo.connect(dbUrl)).subscribe({
            next: client => {
                this.logger.info('connected to database successfully')
                this._db = client.db(this.config.dbName)
            },
            error: error => {
                this.logger.error('failed to connect to database with error %s', error)
            }
        })
    }
    getCollection(name) {
        this.logger.log('debug', 'getting collection %s', name)
        return this._db.collection(name)
    }
}

module.exports = DbClient

DbClient[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}