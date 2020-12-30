import 'regenerator-runtime/runtime'
import eventMocks from '@serverless/event-mocks'
import awsLambdaMockContext from 'aws-lambda-mock-context'
import logger from '../../utils/logger'

logger.transports.forEach(transport => transport.silent = true)

jest.mock('node-fetch')

// HACK: require('discord.js') fails if `window` is defined (which it is during testing for some reason)
delete global.window

// Mock SQS
const mockDeleteMessageBatch = jest.fn()

mockDeleteMessageBatch.mockImplementation(() => ({
  promise() {
    return Promise.resolve({ Body: 'test document' })
  },
}))

jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    deleteMessageBatch: mockDeleteMessageBatch,
  })),
  config: {
    update: jest.fn(),
  },
}))

jest.mock('../../models/Game', () => {
  const games = {
    'invalid-discord-webhook-protocol': {
      discordWebhookUrl: 'hsdfttps://discordapp.com/api/webhooks/invalid',
    },
    'd096960f-d4ac-44be-ab1b-aa415b73ff7f': {
      discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdfghjkl',
    },
    'invalid-discord-webhook-url': {
      discordWebhookUrl: 'https://discordapp.com/api/webhooks/invalid',
    },
    'deleted-discord-webhook-url': {
      discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasddeleted',
    },
    'inactive-game': {
      discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdinactive',
      state: 'INACTIVE'
    },
  }
  return {
    get: jest.fn(async ({ id }) => {
      const game = games[id]
      if (!game) return null

      return {
        Item: game
      }
    }),
    update: jest.fn(async ({ id, state }) => {
      const game = games[id]
      if (!game) return null

      game.state = state

      return {
        Item: game
      }
    }),
  }
})

const fetch = require('node-fetch')

const { Response, Headers } = jest.requireActual('node-fetch')
const {
  webhookHandler,
  getDiscordUserId,
  getMessageFromTemplate,
  MESSAGE_TEMPLATE,
} = require('./lambda')

describe('webhookHandler: happy paths ', () => {
  test('Works', async () => {
    const context = awsLambdaMockContext()
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [{
          messageAttributes: {
            gameId: {
              stringValue: 'd096960f-d4ac-44be-ab1b-aa415b73ff7f',
            },
          },
          body: JSON.stringify({
            value1: 'Game Name',
            value2: 'Player Name',
            value3: Math.round(Math.random(0, 100) * 100).toString(),
          }),
        }],
      },
    )
    await expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Notifaction sent. Game ID: d096960f-d4ac-44be-ab1b-aa415b73ff7f; Discord Response Text: {}.`,
      },
    ])
  })

  describe('getDiscordUserId', () => {
    const players = {
      'player one': {
        discordUserId: '269379221674000384',
      },
      'player two': {
        discordUserId: '@269379221674000384',
      },
      'player three': {
        discordUserId: '<@269379221674000384>',
      },
      'player four': {
        discordUserId: '<@invalid>',
      },
    }
    test('discordUserId with correct format', async () => {
      expect(getDiscordUserId({
        playerName: 'player one',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId with @ prefix only', async () => {
      expect(getDiscordUserId({
        playerName: 'player two',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId number only', async () => {
      expect(getDiscordUserId({
        playerName: 'player three',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId with incorrect (non-numerical) value', async () => {
      expect(getDiscordUserId({
        playerName: 'player four',
        players,
      })).toEqual('player four')
    })
    test('discordUserId not set for player', async () => {
      expect(getDiscordUserId({
        playerName: 'player five',
        players,
      })).toEqual('player five')
    })
  })

  describe('getMessageFromTemplate', () => {
    test('discordUserId with correct format', async () => {
      expect(getMessageFromTemplate({
        messageTemplate: MESSAGE_TEMPLATE,
        gameName: 'my game',
        playerNameOrDiscordUserId: 'player one',
        turnNumber: 3,
      })).toEqual(`player one, it's your turn.
Turn: 3
Game: my game`)
    })
  })
})

describe('webhookHandler: unhappy paths ', () => {
  beforeEach(() => {
    fetch.mockReset()
  })
  test('Fails on an invalid event object', async () => {
    const context = awsLambdaMockContext()
    await expect(webhookHandler({}, context)).rejects.toThrow('Lambda didn\'t receive a `Records` array')
  })

  test('Rejected count increases on fetch error', async () => {
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'invalid-discord-webhook-protocol',
              },
            },
            body: JSON.stringify({
              value1: 'Game Name',
              value2: 'Player Name',
              value3: Math.round(Math.random(0, 100) * 100).toString(),
            }),
          },
        ],
      },
    )
    const context = awsLambdaMockContext()
    const rejectedReasons = 'Only HTTP(S) protocols are supported'
    fetch.mockRejectedValueOnce(new Error(rejectedReasons))
    await expect(webhookHandler(event, context)).resolves.toEqual([{
      reason: new Error(rejectedReasons),
      status: 'rejected',
    }])
  })

  test('No game found is handled instead of rejected', async () => {
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'missing',
              },
            },
            body: JSON.stringify({
              value1: 'Game Name',
              value2: 'Player Name',
              value3: Math.round(Math.random(0, 100) * 100).toString(),
            }),
          },
        ],
      },
    )
    const context = awsLambdaMockContext()
    await expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: 'No game found. Game ID: missing.',
      },
    ])
  })

  test('Rejected count increases on non-2xx HTTP status code', async () => {
    const context = awsLambdaMockContext()
    const meta = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    }
    const headers = new Headers(meta)
    const responseInit = {
      status: 400,
      statusText: '{ message: \'400\' }',
      headers,
    }
    const responseBody = { message: '400' }

    const response = new Response(JSON.stringify(responseBody), responseInit)
    fetch.mockResolvedValueOnce(Promise.resolve(response))
    const rejectedReasons = 'HTTP response from Discord not ok. Status: 400; Text: {"message":"400"}.'
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'invalid-discord-webhook-url',
              },
            },
            body: JSON.stringify({
              value1: 'Game Name',
              value2: 'Player Name',
              value3: Math.round(Math.random(0, 100) * 100).toString(),
            }),
          },
        ],
      },
    )
    await expect(webhookHandler(event, context)).resolves.toEqual([{
      reason: new Error(rejectedReasons),
      status: 'rejected',
    }])
  })

  test(`Game is marked as inactive when discord webhook doesn't exist`, async () => {
    const context = awsLambdaMockContext()
    const meta = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    }
    const headers = new Headers(meta)
    const responseInit = {
      status: 404,
      statusText: '{"message": "Unknown Webhook", "code": 10015}',
      headers,
    }
    const responseBody = {message: "Unknown Webhook", "code": 10015}

    const response = new Response(JSON.stringify(responseBody), responseInit)
    fetch.mockResolvedValueOnce(Promise.resolve(response))
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'deleted-discord-webhook-url',
              },
            },
            body: JSON.stringify({
              value1: 'Game Name',
              value2: 'Player Name',
              value3: Math.round(Math.random(0, 100) * 100).toString(),
            }),
          },
        ],
      },
    )
    await expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Game marked as inactive. Game ID: deleted-discord-webhook-url.`,
      },
    ])
  })

  test(`Game marked as inactive is skipped`, async () => {
    const context = awsLambdaMockContext()
    const meta = {
      'Content-Type': 'application/json',
      Accept: '*/*',
    }
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'inactive-game',
              },
            },
            body: JSON.stringify({
              value1: 'Game Name',
              value2: 'Player Name',
              value3: Math.round(Math.random(0, 100) * 100).toString(),
            }),
          },
        ],
      },
    )
    await expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Skipping inactive game. Game ID: inactive-game.`,
      },
    ])
  })
})
