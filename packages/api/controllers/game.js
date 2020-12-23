import shortId from 'shortid'
import Game from '../models/Game'
import { dynamoDbDocumentClient } from '../dynamodb-init'

export async function createGame({
  discordWebhookUrl,
}) {
  const id = shortId.generate()
  const item = {
    id,
    discordWebhookUrl,
  }
  const game = await Game.update(item, { returnValues: 'ALL_NEW'})
  return game.Attributes
}

export async function updateGame({
  gameId,
  players,
}) {
  const game = await Game.update({
    id: gameId,
    players,
  }, { returnValues: 'ALL_NEW'})

  return sanitizeGame({ gameData: game.Attributes })
}

export async function markGameInactive({
  gameId,
}) {
  const game = await Game.update({
    id: gameId,
    state: 'INACTIVE',
  }, { returnValues: 'ALL_NEW'})

  return sanitizeGame({ gameData: game.Attributes})
}

export async function getGame({
  gameId,
  includeDiscordWebhookUrl
}) {
  const game = await Game.get({ id: gameId })

  if (!game) {
    return null
  }

  return sanitizeGame({ gameData: game.Item, includeDiscordWebhookUrl})
}

function sanitizeGame({gameData, includeDiscordWebhookUrl = false}) {
  if (!gameData) return null

  if (!includeDiscordWebhookUrl) {
    // Don't return sensitive data
    delete gameData.discordWebhookUrl
  }

  return gameData
}
