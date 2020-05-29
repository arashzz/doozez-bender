const injectionManager = require('./core/service/injection-manager')
const express = require("express"),
    bodyParser = require("body-parser"),
//     transactionRoutes = require("./rest/route/transaction-route"),
//     jobRoutes = require("./rest/route/job-route"),
    appConfig = require('config').get('app')

let app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.injectionContainer = injectionManager.init(app)

// const container = injectionManager.init(app)

// container.cradle.jobRoute
// container.cradle.transactionRoute

app.injectionContainer.cradle.jobRoute
app.injectionContainer.cradle.transactionRoute



// app.use("/api", transactionRoutes)
// app.use("/api", container.cradle.jobRoute.get())

let server = app.listen(appConfig.port, function () {
    console.log(">>>>>>> Doozez is running on port " + appConfig.port);
});

function stop() {
    server.close();
}

module.exports = app
module.exports.stop = stop