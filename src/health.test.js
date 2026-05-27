const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const targetUrl = process.env.STAGING_URL || 'http://localhost:5000';

describe('Integration Test: Health Check', function() {
  this.timeout(10000);

  it('should return status 200 and "UP" from the health endpoint', (done) => {
    chai.request(targetUrl)
      .get('/health')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status', 'UP');
        done();
      });
  });
});