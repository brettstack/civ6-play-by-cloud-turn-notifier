import express from 'express'
import wrapAsync from '../wrap-async'
import { createGame, getGame, queryOpenGames, updateGame } from '../../../controllers/game'

const gameRouter = express.Router()

gameRouter.post('/', wrapAsync(async (req, res) => {
  const { discordWebhookUrl } = req.body
  const game = await createGame({ discordWebhookUrl })
  
  res.json(game)
}))

gameRouter.put('/:gameId', wrapAsync(async (req, res) => {
  const { gameId } = req.params
  const { players } = req.body
  const game = await updateGame({ gameId, players })

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

  return res.json(game)
}))

gameRouter.get('/open-games', wrapAsync(async (req, res) => {
  const games = await queryOpenGames()

  if (!games) {
    return res
      .status(404)
      .json({})
  }

  return res.json(games)
}))

export default gameRouter
