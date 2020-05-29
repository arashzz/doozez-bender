const { from } = require('rxjs'),
    { map } = require('rxjs/operators')
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionService {
    constructor({ logger, subjectProvider }) {
        this.namespace = 'core.service.transaction-service'
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.subscribe()
    }
    subscribe() {
        this.subjectProvider.transaction.enrich().subscribe({
            next: (dataModel) => this.enrichTransaction(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.enrich]', this.namespace)
    
        this.subjectProvider.transaction.enrichList().subscribe({
            next: (dataModel) => this.enrichTransactions(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.enrichList]', this.namespace)
    
        this.subjectProvider.transaction.createFilter().subscribe({
            next: (dataModel) => this.createFilter(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.createFilter]', this.namespace)
    }
    getRawTransaction() {
        return {
            username: undefined,
            amount: undefined,
            transactionDate: undefined,
            commodityId: undefined,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime()
        }
    }
    createFilter(dataModel) {
        let filter = {
            username: dataModel.data.username,
            createdAt: {
                $gt: parseInt(dataModel.data.from),
                $lt: parseInt(dataModel.data.to)
            }
        }
        if(dataModel.data.commodityId) {
            filter.commodityId = commodityId
        }
        dataModel.data = filter
        this.subjectProvider.transaction.find().next(dataModel)
    }
    enrichTransactions(dataModel) {
        dataModel.result = []
        from(dataModel.data).pipe(
            map(it => this.toApiModel(it))
        ).subscribe({
            next: (it) => dataModel.result.push(it),
            complete: () => this.subjectProvider.job.updateResult().next(dataModel)
        })
    }
    enrichTransaction(dataModel) {
        dataModel.result = this.toApiModel(dataModel.data)
        this.subjectProvider.job.updateResult().next(dataModel)
    }
    toApiModel(transaction) {
        return {
            amount: transaction.amount,
            transactionDate: transaction.transactionDate,
            commodityId: transaction.commodityId
        }
    }
}

module.exports = TransactionService

TransactionService[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}