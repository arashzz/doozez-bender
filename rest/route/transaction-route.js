const routes = require('express').Router(),
    transactionSubject = require('../../core/provider/transaction-subject-provider'),
    jobSubject = require('../../core/provider/job-subject-provider'),
    jobService = require('../../core/service/job-service'),
    transactionService = require('../../core/service/transaction-service')


routes.get('/v1/transactions', function (req, res) {
    let job = jobService.getRawJob()
    jobSubject.create().next(job)
    let dataModel = {
        jobId: job.id,
        filter: req.query
    }
    transactionSubject.validateGet().next(dataModel)
    res.status(202)
    res.json({
        jobId: job.id
    })
});

routes.post('/v1/transactions', function(req, res) {
    let transaction = transactionService.getRawTransaction()
    if(req.body) {
        transaction.amount = req.body.amount
        transaction.username = req.body.username
        transaction.transactionDate = req.body.transactionDate
        transaction.commodityId = req.body.commodityId
    }
    let jobCreationModel = {
        job: jobService.getRawJob(),
        task: {
            name: 'transactionSubject.validatePost',
            subject: transactionSubject.validatePost(),
            data: transaction
        }
    }

    jobSubject.create().next(jobCreationModel)
   
    // transactionSubject.validatePost().next({
    //     jobId: job.id,
    //     transaction: transaction
    // })


    res.status(202)
    res.json({
        jobId: jobCreationModel.job.id
    })
})

module.exports = routes;