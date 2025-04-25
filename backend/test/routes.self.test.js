
import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

const adminCredentials = {
  username: 'admin', 
  password: 'admin'
}

var admin = request.agent(app);
before((done) => {
  admin
    .post('/api/auth/login')
    .send(adminCredentials)
    .end((err, response) => {
      expect(response.statusCode).to.equal(200)
      done()
    })
})

describe('routes : self', () => {
  describe('GET /self', () => {
    it(
			'should return the correct username',
			() => admin.get('/api/self')
			.expect(200)
			.then(({body}) =>
				expect(body.username).to.equal(adminCredentials.username)
			)
    )
    it('should throw an error if a user is not logged in', done => {
      request(app).get('/api/self')
      .expect(401, done)
    })
  })
})

