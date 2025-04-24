import express from 'express'
import { loginRequired, adminRequired, getHash, createUser } from '../helpers/auth.js'

var router = express.Router()

/* GET users listing. */
router.get('/', loginRequired, async (req, res, next) => {
		const {role, username} = req.user
		const query = (role == 'ADMIN') ? {} : {username}
    const users = await req.db
		.collection('users')
		.find(query, {
      _id: true,
      username: true,
      role: true
    })
		.toArray()
    return res.json(users);
  
})

router.get('/:id', loginRequired, async (req, res, next) => {
	const user = await req.db
	.collection('users')
	.findOne({ _id: req.params.id })
  if(user) res.json(user)
	else res.status(404).json({error: 'ID_UNKNOWN'})
})

router.delete('/:id', adminRequired, async (req, res, next) => {
	console.log('delete', req.params)
	const result = await req.db
	.collection('users')
	.deleteOne({ _id: req.params.id })
	console.log('delete', result)
	if(result.deletedCount) res.json()
	else throw ('DELETE_FAILED')
})
router.post('/', adminRequired, async (req, res, next) => {
  const user = await createUser(req, res)
  res.json(user)
})
router.put('/:id', adminRequired, async (req, res, next) => {
	const users = req.db.collection('users')
	const changes = req.body
	const existingUser = await users.findOne({ _id: req.params.id })
	if(changes.username != existingUser.username){
		const conflictingUser = await users.findOne({ username: changes.username })
		if(conflictingUser) throw ('NAME_EXISTS')
	}
	if(changes.password) {
    changes.password = getHash(changes.password)
  }
	const result = users.updateOne({ _id: req.params.id }, {
		$set: { changes },
		$currentDate: { updatedAt: true }
	})
	if(result.acknowledged) {
		const modifiedUser = await users.findOne({ _id: req.params.id })
		res.json(modifiedUser)
	}
	else throw('WRITE_FAILED')
})

export default router

