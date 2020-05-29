const app = require('../app'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    { expect } = chai,
    JobRepositoryMock = require('./test/mocks/repository/job-repository-mock')
    

chai.use(chaiHttp)
chai.should()

describe('Transaction', function() {
    
    let InstanceOfA

    after(async () => {
        require('../app').stop()
    })
    it("POST - Should get 202 with jobId", (done) => {

        let jobId
        chai.request(app)
            .post('/api/v1/transactions')
            .end((err, res) => {
                expect(res).to.be.json
                expect(res).to.have.status(202)
                expect(res.body).to.have.property('jobId')
        jobId = res.body.jobId
        // chai.request(app)
        //     .get(`/api/v1/jobs/${jobId}`)
        done()
        })
    })
})