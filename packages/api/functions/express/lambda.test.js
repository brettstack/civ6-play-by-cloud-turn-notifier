import 'regenerator-runtime/runtime'
import eventMocks from '@serverless/event-mocks'
import awsLambdaMockContext from 'aws-lambda-mock-context'

jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    deleteMessageBatch: mockDeleteMessageBatch,
  })),
  config: {
    update: jest.fn(),
  },
}))

jest.mock('../../models/User', () => {
  return {}
})

jest.mock('../../models/Game', () => {
  const games = {
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
  test('Works', async (done) => {
    const context = awsLambdaMockContext()
    const event = eventMocks(
      'aws:apiGateway',
      {
        path: '/game/abc123'
      },
    )
    
    const response = await handler(event, context)
    const responseBodyJson = JSON.parse(response.body)
    expect(responseBodyJson.message).toEqual('Not Found')
    expect(typeof response.multiValueHeaders.date[0]).toEqual('string')
    delete response.body
    delete response.multiValueHeaders.date
    expect(response).toEqual({
      "isBase64Encoded": false,
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "connection": ["close"],
        "content-length": ["1061"],
        "content-type": ["application/json; charset=utf-8"],
        "etag": ["W/\"425-ASJPpKsRe9wK952sx6h6kgu6W5Q\""],
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