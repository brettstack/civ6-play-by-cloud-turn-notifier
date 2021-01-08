import 'regenerator-runtime/runtime'
import createEvent from '@serverless/event-mocks'
import { logger } from '../../utils/logger'

logger.level = 'error'

function makeContext() {
  return {
    awsRequestId: 'ef6e0ff0-4d67-11eb-87d2-3192f87a25ff',
  }
}

const {
  handler,
} = require('./lambda')

describe('api: happy paths ', () => {
  test('Get game', async (done) => {
    const context = makeContext()
    const path = 'game/existing-game'
    const event = createEvent(
      'aws:apiGateway',
      {
        path: `/${path}`,
        pathParameters: {
          proxy: path
        }
      },
    )
    const response = await handler(event, context)
    expect(response).toEqual({
      body: '{"id":"existing-game","state":"INACTIVE"}',
      "isBase64Encoded": false,
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "content-length": ["41"],
        "content-type": ["application/json; charset=utf-8"],
        "etag": ["W/\"29-burXaNM8wKUv8eQx0nPgTNGAGBM\""],
        "x-powered-by": ["Express"]
      },
      "statusCode": 200
    })
    done()
  }, 10000)

  test('Create game', async (done) => {
    const context = makeContext()
    const path = 'game'
    const event = createEvent(
      'aws:apiGateway',
      {
        method: 'post',
        httpMethod: 'post',
        path: `/${path}`,
        pathParameters: {
          proxy: path
        },
        body: JSON.stringify({
          discordWebhookUrl: 'https://example.com'
        }),
        multiValueHeaders: {
          'Content-Type': ['application/json']
        }
      },
    )
    const response = await handler(event, context)
    const responseBody = JSON.parse(response.body)
    delete response.body
    expect(typeof responseBody.id).toEqual('string')
    expect(responseBody.discordWebhookUrl).toEqual('https://example.com')
    expect(typeof response.multiValueHeaders.etag[0]).toEqual('string')
    delete response.multiValueHeaders.etag
    expect(response).toEqual({
      "isBase64Encoded": false,
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "content-length": ["151"],
        "content-type": ["application/json; charset=utf-8"],
        "x-powered-by": ["Express"]
      },
      "statusCode": 200
    })
    done()
  }, 10000)
})

describe('api: unhappy paths ', () => {
  test('Game not found', async (done) => {
    const context = makeContext()
    const event = createEvent(
      'aws:apiGateway',
      {
        path: '/game/abc123'
      },
    )
    const response = await handler(event, context)
    expect(response).toEqual({
      "isBase64Encoded": false,
      "body": '{"message":"Not Found"}',
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "content-length": ["23"],
        "content-type": ["application/json; charset=utf-8"],
        "etag": ["W/\"17-SuRA/yvUWUo8rK6x7dKURLeBo+0\""],
        "x-powered-by": ["Express"]
      },
      "statusCode": 404
    })
    done()
  }, 10000)

  test('Create game without discordWebhookUrl', async (done) => {
    const context = makeContext()
    const path = 'game'
    const event = createEvent(
      'aws:apiGateway',
      {
        method: 'post',
        httpMethod: 'post',
        path: `/${path}`,
        pathParameters: {
          proxy: path
        },
        body: JSON.stringify({}),
        multiValueHeaders: {
          'Content-Type': ['application/json']
        }
      },
    )
    const response = await handler(event, context)
    expect(typeof response.multiValueHeaders.etag[0]).toEqual('string')
    delete response.multiValueHeaders.etag
    expect(response).toEqual({
      body: '{"message":"discordWebhookUrl is required"}',
      "isBase64Encoded": false,
      "multiValueHeaders": {
        "access-control-allow-origin": ["*"],
        "content-length": ["43"],
        "content-type": ["application/json; charset=utf-8"],
        "x-powered-by": ["Express"]
      },
      "statusCode": 500
    })
    done()
  }, 10000)
})