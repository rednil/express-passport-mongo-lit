import { getDb, createUser } from "../db.js"
import request from 'supertest'
import app from '../app.js'

export const adminCredentials = {
	username: process.env.ADMIN_USERNAME,
	password: process.env.ADMIN_PASSWORD,
	role: 'ADMIN'
}

export const userCredentials = {
	username: 'user',
	password: 'userpass',
	role: 'USER'
}

export async function getAuthAgent(credentials){
	const user = request.agent(app)
  await user
	.post('/api/auth/login')
	.send(credentials)
	.expect(200)
	return user
}

export async function getAuthAdmin(){
	return getAuthAgent(adminCredentials)
}

export async function getAuthUser(){
	return getAuthAgent(userCredentials)
}

beforeEach(async () => {
	const db = await getDb()
	await db.collection('users').drop()
	await createUser(adminCredentials)
	await createUser(userCredentials)
})

