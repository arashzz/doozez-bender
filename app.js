const injectionManager = require('./core/service/injection-manager')
const express = require("express"),
    bodyParser = require("body-parser"),
    appConfig = require('config').get('app')

let app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const container = injectionManager.get(app)

container.cradle.jobRoute
container.cradle.transactionRoute
container.cradle.commodityRoute

let server = app.listen(appConfig.port, function () {
    console.log(">>>>>>> Doozez is running on port " + appConfig.port);
});

module.exports = server