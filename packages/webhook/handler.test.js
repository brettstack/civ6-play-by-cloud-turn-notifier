jest.mock('node-fetch')
const AWS = require('aws-sdk')

// Emulate Lambda's global AWS object
global.AWS = AWS

const mockDeleteMessageBatch = jest.fn()
mockDeleteMessageBatch.mockImplementation((params) => ({
  promise() {
    return Promise.resolve({ Body: 'test document' })
  },
}))
jest.mock('aws-sdk', () => ({
  SQS: jest.fn(() => ({
    deleteMessageBatch: mockDeleteMessageBatch,
  })),
}))

const fetch = require('node-fetch')

const { Response, Headers } = jest.requireActual('node-fetch')
const { webhookHandler } = require('./handler')

describe('webhookHandler: happy paths ', () => {
  test('Works', async () => {
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'https://discordapp.com/api/webhooks/123456789/1234567890qwertyuiopasdfghjkl;',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).resolves.toEqual(null)
  })
})

describe('webhookHandler: unhappy paths ', () => {
  //   beforeEach(() => {
  //     mockS3GetObject.mockReset()
  // })
  test('Fails on an invalid event object', async () => {
    await expect(webhookHandler({})).rejects.toThrow('Lambda didn\'t receive a `Records` array')
  })

  test('Rejected count increases on fetch error', async () => {
    fetch.mockRejectedValueOnce(new Error('Only HTTP(S) protocols are supported'))

    const rejectedReasons = 'Only HTTP(S) protocols are supported'
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'hsdfttps://discordapp.com/api/webhooks/invalid',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).rejects.toThrow(rejectedReasons)
  })

  test('Rejected count increases on non-2xx HTTP status code', async () => {
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
    await expect(webhookHandler({
      Records: [{
        messageId: 'abc123',
        receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
        eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
        messageAttributes: {
          discordWebhook: {
            stringValue: 'https://discordapp.com/api/webhooks/invalid',
          },
        },
        body: JSON.stringify({
          value1: 'Game Name',
          value2: 'Player Name',
          value3: Math.round(Math.random(0, 100) * 100).toString(),
        }),
      }],
    })).rejects.toThrow(rejectedReasons)
  })
})
