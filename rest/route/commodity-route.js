const routes = require("express").Router()
    
const { RESOLVER, Lifetime, InjectionMode } = require('awilix')        

class CommodityRoute {
    constructor({ logger, commodityService, app}) {
        this.logger = logger 
        this.commodityService = commodityService
        app.use(routes.get('/api/v1/commodities/', function(req, res) {
            this.getAll(req, res)
        }.bind(this)))
    }
    getAll(req, res) {
        this.commodityService.getAll().subscribe(data => { 
            res.json(data) 
            res.status(200)  
        })
    }
}

module.exports = CommodityRoute

CommodityRoute[RESOLVER] = {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.PROXY
}