const awilix = require('awilix'),
    { asClass, asValue } = awilix

const subjectProvider = require('../provider/subject-provider'),
    config = require('config')

const dbClient = require('../repository/db-client'),
    transactionRepository = require('../repository/transaction-repository'),
    jobRepository = require('../repository/job-repository')

const loggerService = require('./logger-service'),
    jobService = require('./job-service'),
    transactionService = require('./transaction-service'),
    transactionValidation = require('../validation/transaction-validation')

const jobRoute = require('../../rest/route/job-route'),
    transactionRoute = require('../../rest/route/transaction-route')

module.exports.init = function(app) {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    })
    container.register({
        app: asValue(app),
        logger: asValue(loggerService())
    })
    if(process.env.NODE_ENV == 'test') {
        const dbClientMock = require('../../test/mocks/repository/db-client-mock')
        const jobRepositoryMock = require('../../test/mocks/repository/job-repository-mock')
        const transactionRepositoryMock = require('../../test/mocks/repository/transaction-repository-mock')
        container.register({
            dbClient: asClass(dbClientMock),
            jobRepository: asClass(jobRepositoryMock),
            transactionRepository: asClass(transactionRepositoryMock),

        })
    }
    else {
        container.register({
            dbClient: asClass(dbClient)
                .inject(() => ({ 
                    config: config.get('db')
                })),
            transactionRepository: asClass(transactionRepository),
            jobRepository: asClass(jobRepository)
        })
    }

    container.register(
        {
            subjectProvider: asClass(subjectProvider),
            jobService: asClass(jobService),
            transactionService: asClass(transactionService),
            transactionValidation: asClass(transactionValidation),
            jobRoute: asClass(jobRoute),
            transactionRoute: asClass(transactionRoute)
        })
    
    container.cradle.dbClient
    container.cradle.subjectProvider
    container.cradle.transactionRepository
    container.cradle.jobRepository
    container.cradle.jobService
    container.cradle.transactionService
    container.cradle.transactionValidation

    return container
}

