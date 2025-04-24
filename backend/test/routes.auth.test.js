process.env.NODE_ENV = 'test'
const path = '/api/auth'

const chai =          require('chai')
const chaiHttp =      require('chai-http')
const passportStub =  require('passport-stub')
const server =        require('../app')
const knex =          require("../helpers/knex")
const helpers =       require("../helpers/test")
const should = chai.should()
chai.use(chaiHttp)
passportStub.install(server)

describe('routes : auth', () => {

  beforeEach(helpers.beforeEach)
  afterEach(helpers.afterEach)

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const username = 'Volzotan Smeik'
      const res = await chai.request(server)
      .post(`${path}/register`)
      .send({
        username,
        password: 'Fogarre'
      })
      helpers.shouldSucceed(res)
      res.body.username.should.eql(username)
      const existing = await knex('users').where({ username })
      existing.length.should.eql(1)
    })
    it('should complain if the user exists', async () => {
      const res = await chai.request(server)
      .post(`${path}/register`)
      .send(helpers.userCredentials)
      res.redirects.length.should.eql(0)
      res.status.should.eql(400)
      res.type.should.eql('application/json')
    })
  })
  
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
})