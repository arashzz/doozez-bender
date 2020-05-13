const express = require("express"),
    bodyParser = require("body-parser"),
    transactionRoutes = require("./rest/route/transaction-route"),
    jobRoutes = require("./rest/route/job-route"),
    subscribeManager = require("./core/service/subscribe-manager"),
    hateoasLinker = require('express-hateoas-links'),
    config = require('./config'),
    dbClient = require('./core/repository/db-client')

let app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(hateoasLinker)

subscribeManager.init()
dbClient.connect()

app.use("/api", transactionRoutes)
app.use("/api", jobRoutes)

app.listen(config.app.port, function () {
    console.log("Running on port " + config.app.port);
});