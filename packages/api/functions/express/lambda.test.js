import 'regenerator-runtime/runtime'
import eventMocks from '@serverless/event-mocks'
import awsLambdaMockContext from 'aws-lambda-mock-context'
import { logger } from '../../utils/logger'

logger.transports.forEach(transport => transport.silent = true)

jest.mock('../../models/User', () => {
  return {}
})

jest.mock('../../models/Game', () => {
  const games = {
    'existing-game': {
      discordWebhookUrl: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdinactive',
      state: 'INACTIVE'
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

const {
  handler,
  server
} = require('./lambda')

describe('api: happy paths ', () => {
  test('Get game', async (done) => {
    jest.setTimeout(30000)

    const context = awsLambdaMockContext()
    const path = 'game/existing-game'
    const event = eventMocks(
      'aws:apiGateway',
      {
        path: `/${path}`,
        pathParameters: {
          proxy: path
        }
      },
    )
    const response = await handler(event, context)
    expect(typeof response.multiValueHeaders.date[0]).toEqual('string')
    delete response.multiValueHeaders.date
    expect(response).toEqual({
      body: '{"state":"INACTIVE"}',
      "isBase64Encoded": false,
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "connection": ["close"],
        "content-length": ["20"],
        "content-type": ["application/json; charset=utf-8"],
        "etag": ["W/\"14-0887awgcDIOOWGL9976PtoR9sOs\""],
        "x-powered-by": ["Express"]
      },
      "statusCode": 200
    })
    done()
  })
})

describe('api: unhappy paths ', () => {
  test('Game not found', async (done) => {
    jest.setTimeout(30000)

    const context = awsLambdaMockContext()
    const event = eventMocks(
      'aws:apiGateway',
      {
        path: '/game/abc123'
      },
    )
    const response = await handler(event, context)
    expect(typeof response.multiValueHeaders.date[0]).toEqual('string')
    delete response.multiValueHeaders.date
    expect(response).toEqual({
      "isBase64Encoded": false,
      "body": '{"message":"Not Found"}',
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "connection": ["close"],
        "content-length": ["23"],
        "content-type": ["application/json; charset=utf-8"],
        "etag": ["W/\"17-SuRA/yvUWUo8rK6x7dKURLeBo+0\""],
        "x-powered-by": ["Express"]
      },
      "statusCode": 404
    })
    done()
  })

  test('close server', async (done) => {
    const context = awsLambdaMockContext()
    const event = eventMocks(
      'aws:apiGateway',
      {
        path: '/game/abc123'
      },
    )

    await handler(event, context)

    server.on('close', () => {
      expect(server.listening).toBe(false)
      done()
    })
    server.close()
  })
})