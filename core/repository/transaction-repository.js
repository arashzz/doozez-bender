const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix')    

class TransactionRepository {
    constructor({ logger, dbClient, subjectProvider }) {
        this.namespace = 'core.repository.transaction-repository'
        this.collectionName = 'transaction'
        this.logger = logger
        this.dbClient = dbClient
        this.subjectProvider = subjectProvider
        this.subscribe()
    }
    subscribe() {
        this.subjectProvider.transaction.insert().subscribe({
            next: (dataModel) => this.insert(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.insert]', this.namespace)

        this.subjectProvider.transaction.find().subscribe({
            next: (dataModel) => this.find(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [transactionSubject.find]', this.namespace)
    }
    insert(dataModel) {
        this.logger.log('debug', '<%s.insert> is called with model %s', this.namespace, dataModel.data)
        from(this.dbClient.getCollection(this.collectionName).insertOne(dataModel.data)).subscribe({
            next: res => {
                if(res.result.ok == 1) {
                    this.subjectProvider.transaction.enrich().next(dataModel)
                }
                else {
                    this.logger.log('debug', '<%s.insert> failed to save transaction model %s ', this.namespace, dataModel.data)
                    dataModel.result = 'something unexpected happened while saving the transaction'
                    this.subjectProvider.transaction.insert().error(dataModel)
                }
            },
            error: err => {
                this.logger.log('debug', '<%s.insert> failed to save transaction model %s with error %s', this.namespace, dataModel.data, err)
                dataModel.result = 'something unexpected happened while saving the transaction'
                this.subjectProvider.transaction.insert().error(dataModel)
            }
        })
    }
    find(dataModel) {
        this.logger.log('debug', '<%s.find> is called with filter %s', this.namespace, dataModel.data)
        from(this.dbClient.getCollection(this.collectionName).find(dataModel.data).toArray()).subscribe({
            next: res => {
                dataModel.data = res
                this.subjectProvider.transaction.enrichList().next(dataModel)
            },
            error: err => {
                this.logger.log('debug', '<%s.find> failed to find transactions with filter %s and jobId %s with error %s', 
                    this.namespace, dataModel.data, dataModel.jobId, err)
                dataModel.result = 'something unexpected happened while searching transactions'
                this.subjectProvider.transaction.find().error(dataModel)
            }
        })
    }
}

module.exports = TransactionRepository

TransactionRepository[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}