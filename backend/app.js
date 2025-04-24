import express from 'express'
//import { MongoClient } from "mongodb"
import createHttpError from 'http-errors'
//import path from 'path'
import { uri } from './db.js'
import morgan from 'morgan'
import session from 'express-session'
import passport from 'passport'
import selfRouter from './routes/self.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import { fileURLToPath } from 'url'
import path from 'path'
import ConnectMongoDBSession from 'connect-mongodb-session'
import { attachDb } from './middleware/attachDb.js'
const MongoDBStore = ConnectMongoDBSession(session)
const store = new MongoDBStore({
  uri,
	databaseName: 'upupa',
  collection: 'sessions'
})
/*
var usersRouter =   require('./routes/users')
var authRouter =    require('./routes/auth')
*/
const environment = process.env.NODE_ENV = process.env.NODE_ENV || 'development'
//console.log('NODE_ENV', process.env.NODE_ENV)

var app = express()

/*
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
*/

if(environment != 'test') app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
console.log(__filename, __dirname)
app.use(express.static(path.join(__dirname, 'public')))


app.use(session({
  secret: process.env.SESSION_SECRET || 'Keyboard Cat',
  resave: false,
  saveUninitialized: true,
  store
}))
app.use(attachDb)
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/self', selfRouter)

app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createHttpError(404))
});

// error handler
app.use(function(err, req, res, next) {
  console.error('error', err)
  const body = {
    error: err.message
  }
  if(environment == 'development') body.stack = err.stack?.split('\n')
  res.status(err.status || 500).json(body)
})

export default app