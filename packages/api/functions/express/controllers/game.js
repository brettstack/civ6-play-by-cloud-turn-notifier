import shortId from 'shortid'
import Game from '../../../models/Game'

export function createGame({
  discordWebhookUrl,
}) {
  return Game.create({
    id: shortId.generate(),
    discordWebhookUrl,
  })
}

export async function updateGame({
  gameId,
  players,
}) {
  const game = await Game.update({
    id: gameId,
    players,
  })

  return sanitizeGame(game)
}

export async function getGame({
  gameId,
}) {
  const game = await Game.get(gameId)

  return sanitizeGame(game)
}

function sanitizeGame(game) {
  if (!game) return null

  const gameData = game.get()

  // Don't return sensitive data
  delete gameData.discordWebhookUrl

  return gameData
}
