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

  if (!game) {
    return res
      .status(404)
      .json({})
  }

  const gameData = game.get()

  // Don't return sensitive data
  delete gameData.discordWebhookUrl

  return res.json(gameData)
}))

export default gameRouter
