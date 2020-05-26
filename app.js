require('./core/repository/db-client').init()
require("./core/service/subscribe-manager").init()

const express = require("express"),
    bodyParser = require("body-parser"),
    transactionRoutes = require("./rest/route/transaction-route"),
    jobRoutes = require("./rest/route/job-route"),
    appConfig = require('config').get('app'),
    logger = require('./core/service/logger-service').logger

let app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.use("/api", transactionRoutes)
app.use("/api", jobRoutes)

app.listen(appConfig.port, function () {
    logger.info(">>>>>>> Doozez is running on port " + appConfig.port);
});

module.exports = app