const server = require('../../app'),
    container = require('../../core/service/injection-manager').get(),
    chai = require('chai'),
    { expect } = chai
    
let mockData = require('../mocks/data/transaction.json')

describe('Job Service', function() {
    let subjectProvider = container.resolve('subjectProvider')
    let jobService = container.resolve('jobService')
    let transactionRepository = container.resolve('transactionRepository')

    before(function() {
        // jobService.unsubscribe()
        // transactionRepository.unsubscribe()    
    })

    it("should run the next given subject", (done) => {
        let rx = require('rxjs')
        let subject = new rx.Subject()
        let dataModel = {
            job: {
                id: 'some-random-id'
            },
            task: {
                name: 'some-random-subject',
                subject: subject,
                data: {
                    a: "sample-a",
                    b: "sample-b",
                    c: "sample-c"
                }
            }
        }
        let sub = subject.subscribe({
            next: (resultModel =>  {
                expect(resultModel).to.be.an('object')
                expect(resultModel).to.have.keys([ 'jobId', 'data'])
                expect(resultModel.jobId).to.be.equal(dataModel.job.id)
                expect(resultModel.data).to.be.an('object')
                expect(resultModel.data).to.be.eq(dataModel.task.data)
                sub.unsubscribe()
                done()
            })
        })
        subjectProvider.job.runTask().next(dataModel)
    }).timeout(1000)
})