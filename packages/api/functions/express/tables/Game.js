import dynamo from 'dynamodb'
import Joi from '@hapi/joi'

const Game = dynamo.define('Game', {
  hashKey: 'id',

  // add the timestamp attributes (updatedAt, createdAt)
  timestamps: true,

  schema: {
    id: dynamo.types.uuid(),
    discordWebhookUrl: Joi.string().uri(),
  },
  tableName: 'Game',
})

export default Game
