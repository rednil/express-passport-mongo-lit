import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import { getAuthAdmin, getAuthUser, userCredentials } from './setup-users.js'

var admin, user
beforeEach(async ()=> {
	admin = await getAuthAdmin()
	user = await getAuthUser()
})

const path = '/api/auth'

describe('routes : auth', () => {
	
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const username = 'Volzotan Smeik'
      const res = await request(app)
			.post(`${path}/register`)
      .send({
        username,
        password: 'Fogarre'
      })
      .expect(200)
    })
		
    it('should complain if the user exists', async () => {
      const res = await request(app)
      .post(`${path}/register`)
      .send(userCredentials)
      .expect(400)
    })
  })
  /*
  describe('POST api/auth/login', () => {
    it('should login a user', async () => {
      const res = await chai.request(server)
      .post(`${path}/login`)
      .send(helpers.userCredentials)
      helpers.shouldSucceed(res)
      res.body.username.should.eql('user')
    })
    it('should not login an unregistered user', async () => {
      const res = await chai.request(server)
      .post(`${path}/login`)
      .send({
        username: 'Blaubär',
        password: 'Herbert'
      })
      res.redirects.length.should.eql(0);
      res.status.should.eql(404);
      res.type.should.eql('application/json');
      res.body.error.should.eql('WRONG_USERNAME_OR_PASSWORD');
    })
  })
  
  describe(`DELETE ${path}/login`, () => {
    it('should logout a user', async () => {
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server)
      .delete(`${path}/login`)
      helpers.shouldSucceed(res)
    })
    it('should throw an error if a user is not logged in', async () => {
      const res = await chai.request(server)
      .delete(`${path}/login`)
      helpers.should401(res)
    })
    
  })
  describe('GET /self', () => {
    it('should return the correct username', async () => {
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server)
      .get('/api/self')
      helpers.shouldSucceed(res)
      res.body.username.should.eql(helpers.userCredentials.username)
    })
    it('should throw an error if a user is not logged in', async () => {
      const res = await chai.request(server)
      .get('/api/self')
      helpers.should401(res)
    })
  })
		*/
})