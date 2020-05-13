const routes = require("express").Router(),
    transactionSubject = require("../../core/provider/transaction-subject-provider"),
    jobService = require("../../core/service/job-service"),
    transactionService = require('../../core/service/transaction-service'),
    jobEnums = require('../../core/enum/job-enums')
    

// routes.get('/v1/transactions/:id', function (req, res) {
//     res.json(trnx_service.getTransaction(req.params.id))
// });

routes.get('/v1/transactions', function (req, res) {
    transactionService.getTransactions(req.query).subscribe(data => {
        res.json({ transactions: data })
        res.status(200)
    })
});

routes.post("/v1/transactions", function(req, res) {
    let job = jobService.generateRawJob()
    let trnx = transactionService.generateRawTransaction()
    job.resource.externalId = trnx.externalId
    job.resource.type = jobEnums.resourceType.TRANSACTION
    if(req.body) {
        trnx.amount = req.body.amount
        trnx.username = req.body.username
        trnx.transactionDate = req.body.transactionDate
        trnx.commodityId = req.body.commodityId
    }
    transactionSubject.validationSubject().next({ 
        data: trnx,
        job: job
    })
    res.status(202)
    res.json({
        links: {
            job: 'http://localhost:5000/api/v1/jobs/' + job.id
        }
    })
})

module.exports = routes;