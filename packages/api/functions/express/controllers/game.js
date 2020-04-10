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
