const routes = require("express").Router(),
    transactionSubject = require("../../core/provider/transaction-subject-provider"),
    uuid = require("uuid"),
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
    let jobId = uuid.v4()
    let data = {}
    if(req.body) {
        data = req.body
        data.external_id = uuid.v4()
    }
    transactionSubject.validationSubject().next({ 
        data: data,
        job: {
            id: jobId,
            resource: {
                external_id: data.external_id,
                type: jobEnums.resourceType.TRANSACTION
            }
        }
    })
    res.status(202)
    res.json({
        links: {
            job: 'http://localhost:5000/api/v1/jobs/' + jobId
        }
    })
})

module.exports = routes;