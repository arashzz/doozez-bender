const server = require('../../app'),
    container = require('../../core/service/injection-manager').get(),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    { expect } = chai

chai.use(chaiHttp)
chai.should()

describe('GET - Commodity List', function() {
    let jobId
    it("should return list commodities", (done) => {

        chai.request(server)
            .get('/api/v1/commodities')
            .end((err, res) => {
                expect(res).to.be.json
                expect(res).to.have.status(200)
                res.body.should.be.an('array').that.is.not.empty
                expect(res.body[0]).should.be.an('object')
                expect(res.body[0]).to.have.keys(['external_id', 'name', 'has_priodic', 'is_debit', 'is_credit'])
                done()
            })
    }).timeout(500)
})
