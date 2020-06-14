const server = require('../../app'),
    container = require('../../core/service/injection-manager').get(),
    chai = require('chai'),
    { expect } = chai

let mockData = require('../mocks/data/transaction.json')

describe('Transaction Validation', function() {
    let subjectProvider = container.resolve('subjectProvider')
    let jobService = container.resolve('jobService')
    let transactionRepository = container.resolve('transactionRepository')

    before(function() {
        jobService.unsubscribe()
        transactionRepository.unsubscribe()    
    })

    it("should trigger subject <transaction.insert>", (done) => {
        let dataModel = {
            jobId: 'some-random-id',
            data: mockData.valid
        }
        subjectProvider.transaction.insert().subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.eql(dataModel)
                done()
            })
        })
        subjectProvider.transaction.validatePost().next(dataModel)
    }).timeout(1000)

    it("should trigger subject <job.updateResult>", (done) => {
        let dataModel = {
            jobId: 'some-random-id',
            data: mockData.invalid_username
        }
        subjectProvider.job.updateResult().subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.eql(dataModel)
                done()
            })
        })
        subjectProvider.transaction.validatePost().next(dataModel)
    }).timeout(1000)
})