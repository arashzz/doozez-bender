const moment = require('moment')
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')

class TransactionValidation {
    constructor({ logger, subjectProvider }) {
        this.logger = logger
        this.subjectProvider = subjectProvider
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
    validateQueryModel(dataModel) {
        this.logger.log('debug', '<%s.validateQueryModel> is called with dataModel %s', this.namespace, dataModel.data)
        let errors = []
    
        if(errors.length == 0) {
            this.subjectProvider.transaction.createFilter().next(dataModel)
        }
        else {
            dataModel.result = errors
            this.subjectProvider.transaction.validateGet().error(dataModel)
        }
    }
    validateCreateModel(dataModel) {
        this.logger.log('debug', '<%s.validateCreateModel> is called with dataModel %s', this.namespace, dataModel.data)
        let errors = []
        if(!dataModel.data) {
            errors.push("transaction is null")
        }
        if(!dataModel.data.commodityId) {
            errors.push("commodity cannot be empty")
        }
        if(!dataModel.data.amount || isNaN(dataModel.data.amount) || dataModel.data.amount <= 0) {
            errors.push("transaction amount is invalid")
        }
        if(!dataModel.data.transactionDate || !moment(dataModel.data.transactionDate, "yyyy-MM-dd").isValid()) {
            errors.push("transaction date is invalid")
        }
        if(errors.length == 0) {
            this.subjectProvider.transaction.insert().next(dataModel)
        }
        else {
            dataModel.result = errors
            this.subjectProvider.transaction.validatePost().error(dataModel)
        }
    }
}

module.exports = TransactionValidation

TransactionValidation[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}
