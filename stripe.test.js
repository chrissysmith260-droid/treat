const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const targetUrl = process.env.STAGING_URL || 'http://localhost:5000';

describe('Integration Test: Stripe Payment Intent', function() {
  this.timeout(10000);

  describe('POST /api/create-payment-intent', () => {
    
    it('should successfully create a payment intent for a valid amount', (done) => {
      const payload = { amount: 5000 };

      chai.request(targetUrl)
        .post('/api/create-payment-intent')
        .send(payload)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('clientSecret');
          expect(res.body.clientSecret).to.be.a('string');
          expect(res.body.clientSecret).to.match(/^pi_/);
          done();
        });
    });

    it('should return 400 error when amount is missing', (done) => {
      chai.request(targetUrl)
        .post('/api/create-payment-intent')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should return 400 error for invalid amounts', (done) => {
      chai.request(targetUrl)
        .post('/api/create-payment-intent')
        .send({ amount: 'not-a-number' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });
});