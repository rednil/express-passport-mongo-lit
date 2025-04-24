import { MongoClient } from 'mongodb'
import { genSaltSync, hashSync } from 'bcrypt'
const uri = "mongodb://admin:admin@localhost:27017"
const client = new MongoClient(uri)
var db
client.on('open', _=> { 
	console.log('DB connected.')
})
client.on('topologyClosed', _=> {
	db = false
	console.log('DB disconnected.')
})

async function getDb() {
  if(db) return db
	try {
    await client.connect()
		db = client.db('upupa')
		await ensureAdmin()
		return db
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

async function ensureAdmin(){
	const admin = await db.collection('users').findOne({ role: 'ADMIN' })
	if(admin) return
	const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin'
  const salt = genSaltSync();
  const hash = hashSync(password, salt);
	const result = await db.collection('users').insertOne({
		username,
		password: hash,
		role: 'ADMIN', 
    createdAt: new Date().getTime()
	})
}

export { getDb, client, uri }