const server = require('../../app'),
    container = require('../../core/service/injection-manager').get(),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    jobEnum = require('../../core/enum/job-enums'),
    { expect } = chai

let mockData = require('../mocks/data/transaction.json')

chai.use(chaiHttp)
chai.should()

describe('POST - Valid Transaction', function() {
    let jobId
    it("should create transaction and return job id", (done) => {

        chai.request(server)
            .post('/api/v1/transactions')
            .send(mockData.valid)
            .end((err, res) => {
                expect(res).to.be.json
                expect(res).to.have.status(202)
                res.body.should.be.an('object')
                expect(res.body).to.have.property('jobId')
                jobId = res.body.jobId
                done()
            })
    }).timeout(500)

    it("should get job with status 'successful' with the given id", (done) => {
        setTimeout(() => {
            chai.request(server)
                .get(`/api/v1/jobs/${jobId}`)
                .end((err, res) => {
                    expect(res).to.be.json
                    expect(res).to.have.status(200)
                    res.body.should.be.an('object')
                    expect(res.body).to.have.keys(['id', 'result', 'status', 'createdAt', 'updatedAt'])
                    expect(res.body.status).to.eq(jobEnum.status.SUCCESS)
                    res.body.result.should.be.an('object')
                    expect(res.body.result).to.have.keys(['commodity', 'amount', 'transactionDate', 'type'])
                    res.body.result.commodity.should.be.an('object')
                    expect(res.body.result.commodity).to.have.keys(['name', 'external_id', 'has_priodic', 'is_credit', 'is_debit'])
                    expect(res.body.result.amount).to.eq(mockData.valid.amount)
                    expect(res.body.result.commodityId).to.eq(mockData.valid.commodityId)
                    expect(res.body.result.transactionDate).to.eq(mockData.valid.transactionDate)
                    done()
            })
        }, 1000);
    }).timeout(5000)
})

describe('POST - Invalid Transaction Amount', function() {
    let jobId
    it("should fail to create transaction with invalid amount but still return job Id", (done) => {
        chai.request(server)
            .post('/api/v1/transactions')
            .send(mockData.invalid_amount)
            .end((err, res) => {
                expect(res).to.be.json
                expect(res).to.have.status(202)
                expect(res.body).to.have.property('jobId')
                jobId = res.body.jobId
                done()
            })
    }).timeout(1000)

    it("should get job with status 'failed' with the given id", (done) => {
        setTimeout(() => {
            chai.request(server)
                .get(`/api/v1/jobs/${jobId}`)
                .end((err, res) => {
                    expect(res).to.be.json
                    expect(res).to.have.status(200)
                    expect(res.body).to.include.all.keys(['result', 'id', 'status'])
                    res.body.result.should.be.an('array').that.is.not.empty
                    // expect(res.body.result).to.be.an('array').that.is.not.empty
                    done()
            })
        }, 1000);
    }).timeout(2000)
})


describe('POST - Invalid Transaction Type', function() {
    let jobId
    it("should fail to create transaction with invalid type but still return job Id", (done) => {
        chai.request(server)
            .post('/api/v1/transactions')
            .send(mockData.invalid_type)
            .end((err, res) => {
                expect(res).to.be.json
                expect(res).to.have.status(202)
                expect(res.body).to.have.property('jobId')
                jobId = res.body.jobId
                done()
            })
    }).timeout(1000)

    it("should get job with status 'failed' with the given id", (done) => {
        setTimeout(() => {
            chai.request(server)
                .get(`/api/v1/jobs/${jobId}`)
                .end((err, res) => {
                    expect(res).to.be.json
                    expect(res).to.have.status(200)
                    expect(res.body).to.include.all.keys(['result', 'id', 'status'])
                    res.body.result.should.be.an('array').that.is.not.empty
                    done()
            })
        }, 1000);
    }).timeout(2000)
})