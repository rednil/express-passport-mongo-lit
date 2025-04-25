import { getDb,createUser } from "../db.js"

before(async () => {
	console.log('setup.before')
	const db = await getDb()
	const username = 'user'
	const password = 'user'
	if(!await db.collection('users').findOne({ username })){
		await createUser(username, password, 'USER')
	}
})