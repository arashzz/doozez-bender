const { from } = require('rxjs'),
    { map } = require('rxjs/operators')
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionService {
    constructor({ logger, subjectProvider, transactionEnum }) {
        this.namespace = 'core.service.transaction-service'
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.transactionEnum = transactionEnum
        this.subscriptions = {}
        this.subscribe()
    }
    subscribe() {
        this.subscriptions['transaction.enrich'] = this.subjectProvider.transaction.enrich().subscribe({
            next: (dataModel) => this.enrichTransaction(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.enrich]', this.namespace)
    
        this.subscriptions['transaction.enrichList'] = this.subjectProvider.transaction.enrichList().subscribe({
            next: (dataModel) => this.enrichTransactions(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.enrichList]', this.namespace)
    
        this.subscriptions['transaction.createFilter'] = this.subjectProvider.transaction.createFilter().subscribe({
            next: (dataModel) => this.createFilter(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.createFilter]', this.namespace)
    }
    unsubscribe() {
        for(let key in this.subscriptions) {
            this.subscriptions[key].unsubscribe()
            this.logger.log('debug', '<%s> unsubscribed to [%s]', this.namespace, key)
        }
    }
    getRawTransaction() {
        return {
            username: undefined,
            amount: undefined,
            transactionDate: undefined,
            commodity: undefined,
            type: undefined,
            is_priodic: false,
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
            filter['commodity.external_id'] = { $eq: dataModel.data.commodityId }
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
            type: transaction.type,
            transactionDate: transaction.transactionDate,
            commodity: transaction.commodity
        }
    }
}

module.exports = TransactionService

TransactionService[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}