import express from 'express'
import wrapAsync from '../wrap-async'
import { createGame, getGame } from '../controllers/game'

const gameRouter = express.Router()
gameRouter.post('/', wrapAsync(async (req, res) => {
  const { discordWebhookUrl } = req.body
  const game = await createGame({ discordWebhookUrl })
  res.json(game)
}))
gameRouter.get('/:gameId', wrapAsync(async (req, res) => {
  const { gameId } = req.params
  const game = await getGame({ gameId })

  // Don't return sensitive data
  delete game.discordWebhookUrl

  res.json(game)
}))

export default gameRouter
