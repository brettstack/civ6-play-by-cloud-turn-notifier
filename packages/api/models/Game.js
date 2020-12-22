import { Table, Entity } from 'dynamodb-toolbox'
import { dynamoDbDocumentClient } from '../dynamodb-init'

const GameTable = new Table({
  name: process.env.GAME_TABLE,
  partitionKey: 'id',
  DocumentClient: dynamoDbDocumentClient,
})

const Game = new Entity({
  name: 'Game',
  attributes: {
    id: { partitionKey: true },
    name: { type: 'string' },
    discordWebhookUrl: { type: 'string' },
    players: { type: 'map' },
    state: { type: 'string' }
  },
  table: GameTable,
})

export default Game
