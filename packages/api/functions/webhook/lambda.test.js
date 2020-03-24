import 'regenerator-runtime/runtime'
import eventMocks from '@serverless/event-mocks'
import awsLambdaMockContext from 'aws-lambda-mock-context'

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

jest.mock('../../models/Game', () => ({
  get: jest.fn((gameId) => {
    const games = {
      'f41l960f-d4ac-44be-ab1b-aa415b73ff7f': 'hsdfttps://discordapp.com/api/webhooks/invalid',
      'd096960f-d4ac-44be-ab1b-aa415b73ff7f': 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdfghjkl',
    }

    return {
      discordWebhookUrl: games[gameId],
    }
  }),
}))

const fetch = require('node-fetch')

const { Response, Headers } = jest.requireActual('node-fetch')
const { webhookHandler } = require('./lambda')

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
        value: '{}',
      },
    ])
  })
})

describe('webhookHandler: unhappy paths ', () => {
  //   beforeEach(() => {
  //     mockS3GetObject.mockReset()
  // })
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
                stringValue: 'f41l960f-d4ac-44be-ab1b-aa415b73ff7f',
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
    fetch.mockRejectedValueOnce(new Error('Only HTTP(S) protocols are supported'))
    const rejectedReasons = 'Only HTTP(S) protocols are supported'
    await expect(webhookHandler(event, context)).rejects.toThrow(rejectedReasons)
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
    const rejectedReasons = 'HTTP response not ok: 400 {"message":"400"}'
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [
          {
            messageAttributes: {
              gameId: {
                stringValue: 'https://discordapp.com/api/webhooks/invalid',
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
    await expect(webhookHandler(event, context)).rejects.toThrow(rejectedReasons)
  })
})
