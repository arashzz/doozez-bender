const { from } = require('rxjs'),
    { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionRepositoryMock {
    constructor({ logger, subjectProvider }) {
        this.namespace = 'core.repository.transaction-repository'
        this.logger = logger
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
        this.subjectProvider.transaction.enrich().next(dataModel)
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