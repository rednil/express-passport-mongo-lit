const chai =          require('chai')
const chaiHttp =      require('chai-http')
const passportStub =  require('passport-stub')
const server =        require('../app')
const helpers =       require("../helpers/test")
const knex =          require("../helpers/knex")

const should = chai.should()
chai.use(chaiHttp)
passportStub.install(server)

async function getUser(){
  const user = await knex('users').where({username: helpers.userCredentials.username}).first()
  return user
}
describe('routes : users', () => {

  beforeEach(helpers.beforeEach)
  afterEach(helpers.afterEach)
 
  describe('GET /users', () => {
    it('should return a list of users', async () => {
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).get('/api/users')
      helpers.shouldSucceed(res)
      const users = await knex('users')
      res.body.length.should.eql(users.length)
    })
    it('should throw an error if a user is not logged in', async () => {
      const res = await chai.request(server).get('/api/users')
      helpers.should401(res)
    })
  })
  describe('GET /users/:id', () => {
    it('should return the respective user', async () => {
      const user = await getUser()
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).get(`/api/users/${user.id}`)
      helpers.shouldSucceed(res)
      res.body.username.should.eql(user.username)
    })
    it('should throw an error if a user is not logged in', async () => {
      const user = await getUser()
      const res = await chai.request(server).get(`/api/users/${user.id}`)
      helpers.should401(res)
    })
    it('should throw an error if the id doesnt exist', async () => {
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).get(`/api/users/340970`)
      helpers.shouldFail(res, 404)
    })
  })
  describe('DELETE /users/:id', () => {
    it('should delete the respective user', async() => {
      const user = await getUser()
      passportStub.login(helpers.adminCredentials)
      const res = await chai.request(server).delete(`/api/users/${user.id}`)
      helpers.shouldSucceed(res)
      const deletedUser = await getUser()
      should.not.exist(deletedUser)
    })
    it('should throw an error if a user is not logged in', async() => {
      const user = await getUser()
      const res = await chai.request(server).delete(`/api/users/${user.id}`)
      helpers.shouldFail(res, 401)
      const deletedUser = await getUser()
      should.exist(deletedUser)
    })
    it('should throw an error if called by user without admin privileges', async() => {
      const user = await getUser()
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).delete(`/api/users/${user.id}`)
      helpers.shouldFail(res, 403)
      const deletedUser = await getUser()
      should.exist(deletedUser)
    })
  })
  describe('POST /users/', () => {
    it('should create the respective user', async() => {
      const user = {
        username: 'Quert Zuiopü',
        password: 'sEcrEt',
        role: 'USER'
      }
      passportStub.login(helpers.adminCredentials)
      const res = await chai.request(server).post(`/api/users/`).send(user)
      helpers.shouldSucceed(res)
      res.body[0].id.should.be.a('number')
      res.body[0].username.should.eql(user.username)
      res.body[0].role.should.eql(user.role)
    })
    
  })
  describe('PUT /users/:id', () => {
    it('should modify the respective user', async() => {
      const changes = {
        username: 'Quert Zuiopü',
        password: 'sEcrEt',
        role: 'ADMIN'
      }
      const user = await getUser()
      passportStub.login(helpers.adminCredentials)
      const res = await chai.request(server).put(`/api/users/${user.id}`).send(changes)
      helpers.shouldSucceed(res)
      res.body.id.should.eql(user.id)
      res.body.username.should.eql(changes.username)
      res.body.role.should.eql(changes.role)
      const modifiedUser = await knex('users').where({id: user.id}).first()
      modifiedUser.password.should.not.equal(user.password)
    })
    it('should keep unchanged properties', async() => {
      const changes = {
        username: 'Quert Zuiopü',
      }
      const user = await getUser()
      passportStub.login(helpers.adminCredentials)
      const res = await chai.request(server).put(`/api/users/${user.id}`).send(changes)
      helpers.shouldSucceed(res)
      res.body.id.should.eql(user.id)
      res.body.username.should.eql(changes.username)
      res.body.role.should.eql(user.role)
      const modifiedUser = await knex('users').where({id: user.id}).first()
      modifiedUser.password.should.equal(user.password)
    })
    it('should throw an error if a user is not logged in', async() => {
      const changes = {
        username: 'Quert Zuiopü',
      }
      const user = await getUser()
      const res = await chai.request(server).put(`/api/users/${user.id}`).send(changes)
      helpers.shouldFail(res, 401)
      const modifiedUser = await knex('users').where({id: user.id}).first()
      modifiedUser.username.should.equal(user.username)
    })
    it('should throw an error if called by user without admin privileges', async() => {
      const changes = {
        username: 'Quert Zuiopü',
      }
      const user = await getUser()
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).put(`/api/users/${user.id}`).send(changes)
      helpers.shouldFail(res, 403)
      const modifiedUser = await knex('users').where({id: user.id}).first()
      modifiedUser.username.should.equal(user.username)
    })
  })

})