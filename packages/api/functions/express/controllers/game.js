import Game from '../tables/Game'

export async function createGame({
  discordWebhookUrl,
}) {
  return Game.create({ discordWebhookUrl })
}
