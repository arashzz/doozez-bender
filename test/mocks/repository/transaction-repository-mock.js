const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionRepositoryMock {
    constructor({ logger, subjectProvider, dbClient }) {
        this.namespace = 'core.repository.transaction-repository-mock'
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.dbClient = dbClient
        this.subscriptions = {}
        this.subscribe()
    }
    subscribe() {
        this.subscriptions['subjectProvider.transaction.insert'] = this.subjectProvider.transaction.insert().subscribe({
            next: (dataModel) => this.insert(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.insert]', this.namespace)

        this.subscriptions['subjectProvider.transaction.find'] = this.subjectProvider.transaction.find().subscribe({
            next: (dataModel) => this.find(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.find]', this.namespace)
    }
    unsubscribe() {
        for(let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe()
            this.logger.log('debug', '<%s> unsubscribed to [s%s]', this.namespace, key)
        }
    }
    insert(dataModel) {
        setTimeout(() => {
            let collection = this.dbClient.getCollection('transaction')
            collection.push(dataModel.data)
            this.subjectProvider.transaction.enrich().next(dataModel)
        }, 1000);
    }
    find(dataModel) {
        dataModel.data = [
            {
                username: 'test@example.com',
                amount: 100,
                transactionDate: transaction,
                commodityId: "3",
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
        ]
        this.subjectProvider.transaction.enrichList().next(dataModel)
    }
}

module.exports = TransactionRepositoryMock

TransactionRepositoryMock[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}