process.env.NODE_ENV = 'test'

const chai =          require('chai')
const passportStub =  require('passport-stub')
const server =        require('../app')
const knex =          require("../helpers/knex")

const should = chai.should()
passportStub.install(server)


const should401 = res => {
  res.redirects.length.should.eql(0)
  res.status.should.eql(401)
  res.type.should.eql('application/json')
  res.body.error.should.eql('UNAUTHENTICATED')
}

const shouldFail = (res, status) => {
  res.redirects.length.should.eql(0)
  res.status.should.not.eql(200)
  if(status) {
    res.status.should.eql(status)
    if(status == 401) res.body.error.should.eql('UNAUTHENTICATED')
  }
}
const shouldSucceed = res => {
  res.redirects.length.should.eql(0)
  res.status.should.eql(200)
  res.type.should.eql('application/json')
}

const userCredentials = {
  username: 'user',
  password: 'userpass',
  role: 'USER'
}
const adminCredentials = {
  username: 'admin',
  password: 'adminpass',
  role: 'ADMIN'
}

async function beforeEach(){
  await knex.migrate.rollback()
  await knex.migrate.latest()
  await knex.seed.run({specific: 'create_users.js'})
}

async function afterEach(){
  passportStub.logout()
  await knex.migrate.rollback()
}

module.exports = { should401, userCredentials, beforeEach, afterEach, shouldSucceed, shouldFail, adminCredentials }