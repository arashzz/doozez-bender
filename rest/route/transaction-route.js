const routes = require('express').Router()


const { RESOLVER, Lifetime, InjectionMode } = require('awilix')    

class TransactionRoute {
    constructor({ logger, jobService, transactionService, subjectProvider, app}) {
        this.logger = logger 
        this.jobService = jobService
        this.transactionService = transactionService
        this.subjectProvider = subjectProvider
        app.use(routes.post('/api/v1/transactions', function(req, res) {
            this.post(req, res)
        }.bind(this)))
        app.use(routes.get('/api/v1/transactions', function(req, res) {
            this.get(req, res)
        }.bind(this)))
    }
    post(req, res) {
        let transaction = this.transactionService.getRawTransaction()
        if(req.body) {
            transaction.amount = req.body.amount
            transaction.username = req.body.username
            transaction.transactionDate = req.body.transactionDate
            transaction.commodityId = req.body.commodityId
        }
        let jobCreationModel = {
            job: this.jobService.getRawJob(),
            task: {
                name: 'subjectProvider.transaction.validatePost',
                subject: this.subjectProvider.transaction.validatePost(),
                data: transaction
            }
        }
        this.subjectProvider.job.create().next(jobCreationModel)

        res.status(202)
        res.json({
            jobId: jobCreationModel.job.id
        })
    }
    get(req, res) {
        let jobCreationModel = {
            job: this.jobService.getRawJob(),
            task: {
                name: 'subjectProvider.transaction.validateGet',
                subject: this.subjectProvider.transaction.validateGet(),
                data: req.query
            }
        }
        this.subjectProvider.job.create().next(jobCreationModel)
        res.status(200)
        res.json({
            jobId: jobCreationModel.job.id
        })
    }
}

module.exports = TransactionRoute

TransactionRoute[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}