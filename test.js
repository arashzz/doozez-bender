// const {from, of } = require('rxjs')
// const { concatMap, delay, switchMap } = require('rxjs/operators')

// let arr = [1,2,3,4];

// let observable = from(arr).pipe(
//     concatMap(val => {
//         return of(val).pipe(
//             delay(2000)
//         )
//       })
// )
  
  
// observable.subscribe(val => console.log('000000 ' + val));

// setTimeout(() => {
//     console.log('arr modified')
//     arr.push(6)
//     arr.push(7)
// }, 5000);


// setTimeout(() => {
//     observable.pipe(
//         switchMap(val => {
//             return of(val).pipe(
//                 delay(2000)
//             )
//         })
//     ).subscribe(val => console.log('111111 ' + val))
// }, 6000);

// const  { bindNodeCallback } = require('rxjs'),
//     { replay, flatMap } = require('rxjs/operators'),
//     mongo = require('mongodb'),
//     config = require('./config')

// function getClient() {
//     var connect = bindNodeCallback(mongo.connect)
//     return connect(config.db.url + config.db.database)
// }

// let client = getClient().subscribe()
// console.log(client)

// let ins = getClient().pipe(
//     flatMap((client) => {
//         var c = client.db('dooze_transaction').collection('transaction')
//         c.find = c.find.bind(c)
//         var obs = bindNodeCallback(c.find)
//         return obs()
//       })
// )

// ins.subscribe(console.log('111'))

// setTimeout(() => {
//     ins.subscribe(console.log('222'))    
// }, 5000);


///////////===============

// var connectObservable = bindNodeCallback(mongo.connect, mongo)
// let dbUrl = config.db.url + config.db.database
// var db$ = connect(dbUrl)
// // var connectionDisposable = db$.connect();
// connect().subscribe(console.log('ok'))



// const express = require("express"),
//     bodyParser = require("body-parser"),
//     transactionRoutes = require("./rest/route/transaction-route"),
//     jobRoutes = require("./rest/route/job-route"),
//     subscribeManager = require("./core/service/subscribe-manager"),
//     hateoasLinker = require('express-hateoas-links')




// const dbClient = require('./core/repository/db-client')

// dbClient.initDatabase().subscribe({
//     next: event => {
//         console.log('>>>>>>>>>>>>>>>')
//         let app = express();

//         app.use(bodyParser.urlencoded({ extended: true }))
//         app.use(bodyParser.json())
//         app.use(hateoasLinker)

//         subscribeManager.init()

//         var port = 5000;

//         // app.use("/api", commodity_routes)
//         app.use("/api", transactionRoutes)
//         app.use("/api", jobRoutes)

//         app.listen(port, function () {
//             console.log("Running on port " + port);
//         });        
//     },
//     error: error => {
//         console.log('^^^^^^^^^^^^^^')
//         console.log(error)
//     }
// })

// const dbClient = require('./core/repository/db-client')
// let dbSubscription = dbClient.initDatabase().subscribe({
//     next: client => { 
//         console.log('ok')
//         console.log(dbClient.getDb())
//     },
//     complete: client => {
//         console.log('completed')
//         dbSubscription.unsubscribe()
//     }
// })

// const jobEnums = require('./core/enum/job-enums')
// jobEnums.status.FAILED = 'arash'
// console.log(jobEnums.status.FAILED)


// let commodities = '1,2,3'
// let predicate = {}
// if(commodities) {
//     predicate.commodityId = {
//         $in: commodities.split(',')
//     }
// }
// console.log(predicate)

// const winston = require('winston');
// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console()
//     ]
// });

// logger.info('What rolls down stairs');
try {
  let s = f  
} catch(e) {
    console.log('poof')
    console.log(e)
}