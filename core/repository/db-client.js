const  { from } = require('rxjs'),
    { map } = require('rxjs/operators'),
    mongo = require('mongodb'),
    dbConfig = require('config').get('db'),
    logger = require('../service/logger-service').logger

const collections = {
    TRANSACTION: 'transaction',
    JOB: 'job'
}

this._db
exports.connect = function() {
    logger.info('connecting to database...')
    from(mongo.connect(dbConfig.host + dbConfig.dbName)).subscribe({
        next: client => {
            logger.info('connected to database successfully')
            this._db = client.db(dbConfig.dbName)
        },
        error: error => {
            logger.error('failed to connect to database with error %s', error)
        }
    })
}

exports.getDb = function() {
    return this._db
}

exports.getCollection = function(name) {
    logger.log('debug', 'getting collection %s', name)
    return this._db.collection(name)
}

// exports.disconnect = function() {
//     // this._db.disconnect()
// }