const chai =          require('chai')
const chaiHttp =      require('chai-http')
const passportStub =  require('passport-stub')
const server =        require('../app')
const helpers =       require("../helpers/test")

const should = chai.should()
chai.use(chaiHttp)
passportStub.install(server)

describe('routes : self', () => {

  beforeEach(helpers.beforeEach)
  afterEach(helpers.afterEach)
 
  describe('GET /self', () => {
    it('should return the correct username', async () => {
      passportStub.login(helpers.userCredentials)
      const res = await chai.request(server).get('/api/self')
      helpers.shouldSucceed(res)
      res.body.username.should.eql(helpers.userCredentials.username)
      passportStub.logout()
    })
    it('should throw an error if a user is not logged in', async () => {
      const res = await chai.request(server).get('/api/self')
      helpers.should401(res)
    })
  })
  
})