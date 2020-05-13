const  { from } = require('rxjs'),
    { map } = require('rxjs/operators'),
    mongo = require('mongodb'),
    config = require('../../config')

const collections = {
    TRANSACTION: 'transaction',
    JOB: 'job'
}

this._db
exports.connect = function() {
    console.log('connecting to database...')
    from(mongo.connect(config.db.url + config.db.database)).subscribe({
        next: client => {
            console.log('database connected and initiated')
            this._db = client.db(config.db.database)
        },
        error: error => {
            console.log('failed to connect to database')
            console.log(error)
        }
    })
}

exports.getDb = function() {
    return this._db
}

exports.getCollection = function(name) {
    return this._db.collection(name)
}

exports.disconnect = function() {
    this._db.disconnect()
}

function initCollections() {
    
}