import shortId from 'shortid'
import Game from '../models/Game'
import { log } from '../utils/logger'

export async function createGame({
  discordWebhookUrl,
}) {
  const id = shortId.generate()
  const item = {
    id,
    discordWebhookUrl,
  }
  const game = await Game.update(item, { returnValues: 'ALL_NEW'})

  log.info('GAME_CONTROLLER:GAME_CREATED', { game })

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

  log.info('GAME_CONTROLLER:GAME_UPDATED', { game })

  return sanitizeGame({ gameData: game.Attributes })
}

export async function markGameInactive({
  gameId,
}) {
  const game = await Game.update({
    id: gameId,
    state: 'INACTIVE',
  }, { returnValues: 'ALL_NEW'})

  log.info('GAME_CONTROLLER:GAME_MARKED_INACTIVE', { game })

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

export async function queryOpenGames({
  includeDiscordWebhookUrl = false
} = {}) {
  const games = await Game.query('GAME_STATE#OPEN', {
    index: 'GSI1'
  })

  log.debug('GAME_CONTROLLER:QUERY_OPEN_GAMES:RESULT', { games })

  console.log('games', games)

  if (!games) {
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
