
import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { getAuthAdmin, adminCredentials } from './setup-users.js'

var admin
beforeEach(async ()=> {
	admin = await getAuthAdmin() 
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

