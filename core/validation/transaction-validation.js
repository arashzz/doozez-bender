const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionValidation {
    constructor({ logger, subjectProvider, transactionEnum }) {
        this.logger = logger
        this.subjectProvider = subjectProvider
        this.transactionEnum = transactionEnum
        this.namespace = 'core.validation.transaction-validation'
        this.subscribe()
    }
    subscribe() {
        this.subjectProvider.transaction.validatePost().subscribe({
            next: (dataModel) => this.validateCreateModel(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.validatePost]', this.namespace)
        
        this.subjectProvider.transaction.validateGet().subscribe({
            next: (dataModel) => this.validateQueryModel(dataModel)
        })
        this.logger.log('debug', '<%s> subscribed to subject [subjectProvider.transaction.validateGet]', this.namespace)
    }
    unsubscribe() {
        this.subjectProvider.transaction.validatePost().unsubscribe()
        this.logger.log('debug', '<%s> unsubscribed to subject [subjectProvider.transaction.validatePost]', this.namespace)
        
        this.subjectProvider.transaction.validateGet().unsubscribe()
        this.logger.log('debug', '<%s> unsubscribed to subject [subjectProvider.transaction.validateGet]', this.namespace)
    }
    validateQueryModel(dataModel) {
        this.logger.log('debug', '<%s.validateQueryModel> is called with dataModel %s', this.namespace, dataModel.data)
        let errors = []
    
        if(errors.length == 0) {
            this.subjectProvider.transaction.createFilter().next(dataModel)
        }
        else {
            dataModel.result = errors
            dataModel.isError = true
            this.subjectProvider.job.updateResult().next(dataModel)
        }
    }
    validateCreateModel(dataModel) {
        this.logger.log('debug', '<%s.validateCreateModel> is called with dataModel %s', this.namespace, dataModel.data)
        let errors = []
        if(!dataModel.data) {
            errors.push("transaction is null")
        }
        if(!dataModel.data.username) {
            errors.push("username cannot be empty")
        }
        if(!dataModel.data.type) {
            errors.push("transaction type cannot be empty")
        }
        else if(dataModel.data.type != this.transactionEnum.type.DEBIT && dataModel.data.type != this.transactionEnum.type.CREDIT) {
            errors.push(`transaction type is invalid. Only [${this.transactionEnum.type.DEBIT}] and [${this.transactionEnum.type.CREDIT}] are supported`)
        }

        if(!dataModel.data.commodity) {
            errors.push("commodity cannot be empty")
        }
        if(!dataModel.data.amount || isNaN(dataModel.data.amount) || dataModel.data.amount <= 0) {
            errors.push("transaction amount is invalid")
        }
        if(!dataModel.data.is_priodic && !dataModel.data.transactionDate) {
            errors.push("transaction date is required for non-priodic transactions")
        }
        if(errors.length == 0) {
            this.subjectProvider.transaction.insert().next(dataModel)
        }
        else {
            dataModel.result = errors
            dataModel.isError = true
            this.subjectProvider.job.updateResult().next(dataModel)
        }
    }
}

module.exports = TransactionValidation

TransactionValidation[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}
