import { Entity } from 'dynamodb-toolbox'
import { MainTable } from '../dynamodb-init'

const Game = new Entity({
  name: 'Game',
  attributes: {
    id: {
      partitionKey: true,
    },
    discordWebhookUrl: {
      type: 'string',
      required: 'always',
    },
    players: {
      type: 'map',
    },
    state: {
      type: 'string',
      map: 'data'
    },
  },
  table: MainTable,
})

export default Game
