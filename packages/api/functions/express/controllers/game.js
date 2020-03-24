import Game from '../../../models/Game'

export function createGame({
  discordWebhookUrl,
}) {
  return Game.create({ discordWebhookUrl })
}
