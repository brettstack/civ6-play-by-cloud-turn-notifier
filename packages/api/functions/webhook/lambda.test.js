import 'regenerator-runtime/runtime'
import eventMocks from '@serverless/event-mocks'
import { logger } from '../../utils/logger'
import { getGame } from '../../controllers/game'

// logger.transports.forEach(transport => transport.silent = true)

function makeContext() {
  return {
    awsRequestId: 'ef6e0ff0-4d67-11eb-87d2-3192f87a25ff',
  }
}

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

const fetch = require('node-fetch')

const { Response, Headers } = jest.requireActual('node-fetch')
const {
  webhookHandler,
  getDiscordUserId,
  getMessageFromTemplate,
  MESSAGE_TEMPLATE,
} = require('./lambda')

describe('webhookHandler: happy paths ', () => {
  test('Notification sent', async () => {
    const context = makeContext()
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
    expect(webhookHandler(event, context)).resolves.toEqual([
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
    test('discordUserId with correct format', () => {
      expect(getDiscordUserId({
        playerName: 'player one',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId with @ prefix only', () => {
      expect(getDiscordUserId({
        playerName: 'player two',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId number only', () => {
      expect(getDiscordUserId({
        playerName: 'player three',
        players,
      })).toEqual('<@269379221674000384>')
    })
    test('discordUserId with incorrect (non-numerical) value', () => {
      expect(getDiscordUserId({
        playerName: 'player four',
        players,
      })).toEqual('player four')
    })
    test('discordUserId not set for player', () => {
      expect(getDiscordUserId({
        playerName: 'player five',
        players,
      })).toEqual('player five')
    })
  })

  describe('getMessageFromTemplate', () => {
    test('discordUserId with correct format', () => {
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
    const context = makeContext()
    expect(webhookHandler({}, context)).rejects.toThrow('Lambda didn\'t receive a `Records` array')
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
    const context = makeContext()
    const rejectedReasons = 'Only HTTP(S) protocols are supported'
    fetch.mockRejectedValueOnce(new Error(rejectedReasons))
    expect(webhookHandler(event, context)).resolves.toEqual([{
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
    const context = makeContext()
    expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: 'No game found. Game ID: missing.',
      },
    ])
  })

  test('Rejected count increases on unknown non-2xx HTTP status code', async () => {
    const context = makeContext()
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
    const rejectedReasons = 'HTTP response from Discord not ok. Status: 400; Text: {"message":"400"}.'
    expect(webhookHandler(event, context)).resolves.toEqual([{
      reason: new Error(rejectedReasons),
      status: 'rejected',
    }])
  })

  test(`Game is marked as inactive when discord webhook doesn't exist`, async () => {
    const context = makeContext()
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
    expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Discord Webhook doesn't exist for this Game. Marked as inactive. Game ID: deleted-discord-webhook-url. Discord Webhook URL: https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasddeleted`,
      },
    ])
    
    await sleep(500)
    const game = await getGame({ gameId: 'deleted-discord-webhook-url' })
    expect(game.state).toEqual('INACTIVE')
  })

  test(`Game is marked as inactive when it doesn't have discorodWebhookUrl`, async () => {
    const context = makeContext()
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'no-discord-webhook-url',
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
    expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Game doesn't have \`discordWebhookUrl\`. Marked as inactive. Game ID: no-discord-webhook-url`
      },
    ])
    await sleep(500)
    const game = await getGame({ gameId: 'no-discord-webhook-url', includeDiscordWebhookUrl: true })
    expect(game.state).toEqual('INACTIVE')
    expect(game.discordWebhookUrl).toEqual('NONE')
  })

  test(`Game marked as inactive is skipped`, async () => {
    const context = makeContext()
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
    expect(webhookHandler(event, context)).resolves.toEqual([
      {
        status: 'fulfilled',
        value: `Skipping inactive game. Game ID: inactive-game.`,
      },
    ])
  })
})

function sleep(ms) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(resolve, ms)
    } catch (err) {
      reject(err)
    }
  })
}