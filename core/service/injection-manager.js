const awilix = require('awilix'),
    { asClass, asValue } = awilix

const subjectProvider = require('../provider/subject-provider'),
    config = require('config')

const dbClient = require('../repository/db-client'),
    transactionRepository = require('../repository/transaction-repository'),
    jobRepository = require('../repository/job-repository'),
    commodityRepository = require('../repository/commodity-repository')

const loggerService = require('./logger-service'),
    commodityService = require('./commodity-service'),
    jobService = require('./job-service'),
    transactionService = require('./transaction-service'),
    transactionValidation = require('../validation/transaction-validation')

const jobRoute = require('../../rest/route/job-route'),
    transactionRoute = require('../../rest/route/transaction-route'),
    commodityRoute = require('../../rest/route/commodity-route')

const transactionEnum = require('./../enum/transaction-enum')

let container
module.exports.get = function(app) {
    if(container) {
        return container
    }
    container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    })
    container.register({
        app: asValue(app),
        logger: asValue(loggerService()),
        subjectProvider: asClass(subjectProvider)
    })
    if(process.env.NODE_ENV == 'test') {
        const dbClientMock = require('../../test/mocks/repository/db-client-mock')
        const jobRepositoryMock = require('../../test/mocks/repository/job-repository-mock')
        const transactionRepositoryMock = require('../../test/mocks/repository/transaction-repository-mock')
        const commodityRepositoryMock = require('../../test/mocks/repository/commodity-repository-mock')
        container.register({
            dbClient: asClass(dbClientMock),
            jobRepository: asClass(jobRepositoryMock),
            transactionRepository: asClass(transactionRepositoryMock),
            commodityRepository: asClass(commodityRepositoryMock)
        })
    }
    else {
        container.register({
            dbClient: asClass(dbClient)
                .inject(() => ({ 
                    config: config.get('db')
                })),
            transactionRepository: asClass(transactionRepository),
            jobRepository: asClass(jobRepository),
            commodityRepository: asClass(commodityRepository)
        })
    }

    container.register(
        {
            commodityService: asClass(commodityService),
            jobService: asClass(jobService)
            .inject(() => ({ 
                uuid: require('uuid')
            })),
            transactionService: asClass(transactionService)
            .inject(() => ({ 
                transactionEnum: transactionEnum
            })),
            transactionValidation: asClass(transactionValidation)
            .inject(() => ({ 
                transactionEnum: transactionEnum
            })),
            commodityRoute: asClass(commodityRoute),
            jobRoute: asClass(jobRoute),
            transactionRoute: asClass(transactionRoute)
        })
    
    container.cradle.subjectProvider
    container.cradle.dbClient
    container.cradle.transactionRepository
    container.cradle.jobRepository
    container.cradle.jobService
    container.cradle.transactionService
    container.cradle.transactionValidation

    return container
}

