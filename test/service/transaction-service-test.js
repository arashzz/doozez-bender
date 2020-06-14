const server = require('../../app'),
    container = require('../../core/service/injection-manager').get(),
    chai = require('chai'),
    { expect } = chai
    
let mockData = require('../mocks/data/transaction.json')

describe('Transaction Service', function() {
    let subjectProvider = container.resolve('subjectProvider')
    let jobService = container.resolve('jobService')
    let transactionRepository = container.resolve('transactionRepository')

    before(function() {
        jobService.unsubscribe()
        transactionRepository.unsubscribe()    
    })

    it("should create filter and send it to <transaction.find> subject", (done) => {
        let dataModel = {
            jobId: 'some-random-id',
            data: {
                username: "john-doe@example.com",
                from: 123456789,
                to: 123456789,
                commodityId: "3"
            }
        }
        subjectProvider.transaction.find().subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.be.an('object')
                expect(resultModel).to.have.keys([ 'jobId', 'data'])
                expect(resultModel.data).to.be.an('object')
                expect(resultModel.data).to.have.keys([ 'createdAt', 'username', 'commodity.external_id'])
                expect(resultModel.data.createdAt).to.be.an('object')
                expect(resultModel.data.createdAt).to.have.keys([ '$gt', '$lt'])
                expect(resultModel.data['commodity.external_id']).to.be.an('object')
                expect(resultModel.data['commodity.external_id']).to.have.key('$eq')
                done()
            })
        })
        subjectProvider.transaction.createFilter().next(dataModel)
    }).timeout(1000)

    it("should create an enriched transaction and send it to <job.updateResult> subject", (done) => {
        let dataModel = {
            jobId: 'some-random-id',
            data: mockData.valid
        }
        let sub = subjectProvider.job.updateResult().subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.be.an('object')
                expect(resultModel).to.have.keys([ 'jobId', 'data', 'result'])
                expect(resultModel.result).to.be.an('object')
                expect(resultModel.result).to.have.keys([ 'amount', 'type', 'transactionDate', 'commodity'])
                expect(resultModel.data.commodity).to.be.an('object')
                expect(resultModel.data.commodity).to.have.keys([ 'name', 'has_priodic', 'is_debit', 'is_credit', 'external_id'])
                sub.unsubscribe()
                done()
            })
        })
        subjectProvider.transaction.enrich().next(dataModel)
    }).timeout(3000)

    
    it("should create an enriched transactions and send it to <job.updateResult> subject", (done) => {
        let dataModel = {
            jobId: 'some-random-id',
            data: [mockData.valid, mockData.valid]
        }
        let sub = subjectProvider.job.updateResult().subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.be.an('object')
                expect(resultModel).to.have.keys([ 'jobId', 'data', 'result'])
                expect(resultModel.result).to.be.an('array').that.is.not.empty
                sub.unsubscribe()
                done()
            })
        })
        subjectProvider.transaction.enrichList().next(dataModel)
    }).timeout(1000)
})