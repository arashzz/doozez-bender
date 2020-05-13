const routes = require("express").Router(),
    jobService = require('../../core/service/job-service')

routes.get("/v1/jobs/:id", function(req, res) {
    jobService.getJobById(req.params.id).subscribe(data => {
        res.json(data)
        res.status(200)
    })
})

module.exports = routes