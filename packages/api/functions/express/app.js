import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import usersRouter from './routes/users'
import gameRouter from './routes/game'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const app = express()
const router = express.Router()
// router.use(cookieParser())
router.use(cors())
router.use(bodyParser.json())
app.use('/', router)
// app.use('/users', usersRouter)
app.use('/game', gameRouter)

app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.statusCode = 404
  next(err)
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  const response = {
    message: err.message,
  }

  /* istanbul ignore next */
  if (IS_DEVELOPMENT) {
    response.trace = err.stack
  }

  res
    .status(statusCode)
    .json(response)
})

export default app
