const routes = require("express").Router()
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')        

class JobRoute {
    constructor({ logger, jobService, app}) {
        this.logger = logger 
        this.jobService = jobService
        app.use(routes.get('/api/v1/jobs/:id', function(req, res) {
            this.getById(req, res)
        }.bind(this)))
    }
    getById(req, res) {
        this.jobService.getJobById(req.params.id).subscribe(data => {    
            res.json(data)
            res.status(200)
        })
    }
}

module.exports = JobRoute

JobRoute[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}