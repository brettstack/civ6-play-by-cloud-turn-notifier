import express from 'express'
import wrapAsync from '../wrap-async'
import { createGame } from '../controllers/game'

const gameRouter = express.Router()
gameRouter.post('/', wrapAsync(async (req, res) => {
  const { discordWebhookUrl } = req.body
  const game = await createGame({ discordWebhookUrl })
  res.json(game)
}))

export default gameRouter
