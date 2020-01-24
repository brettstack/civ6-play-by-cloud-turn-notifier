const middy = require('@middy/core')
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
    endpoint: { href: 'https://...' },
  })),
}))
const lambdaBatchSqsErrorCleanerMiddleware = require('./index')

describe('lambdaBatchSqsErrorCleanerMiddleware', () => {
  test('resolves with null when there are no failed messages', async () => {
    const Records = [{
      messageId: 'abc123',
      receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
      eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
      messageAttributes: {
        resolveOrReject: {
          stringValue: 'resolve',
        },
      },
      body: '',
    }]
    const event = { Records }
    const settledRecords = await Promise.allSettled(Records.map((r) => Promise.resolve(r)))
    const originalHandler = jest.fn(() => Promise.resolve(settledRecords))
    const handler = middy(originalHandler)
      .use(lambdaBatchSqsErrorCleanerMiddleware())
    await expect(handler(event)).resolves.toEqual(null)
  })
  test('throws with failure reasons', async () => {
    const Records = [{
      messageId: 'abc123',
      receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
      eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
      messageAttributes: {
        resolveOrReject: {
          stringValue: 'resolve',
        },
      },
      body: '',
    }, {
      messageId: 'def456',
      receiptHandle: 'BQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
      eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
      messageAttributes: {
        resolveOrReject: {
          stringValue: 'reject',
        },
      },
      body: '',
    }]
    const event = { Records }
    const settledRecords = await Promise.allSettled(Records.map((r) => {
      if (r.messageAttributes.resolveOrReject.stringValue === 'resolve') return Promise.resolve(r.messageId)
      return Promise.reject(new Error(r.messageId))
    }))
    const originalHandler = jest.fn(() => Promise.resolve(settledRecords))
    const handler = middy(originalHandler)
      .use(lambdaBatchSqsErrorCleanerMiddleware())
    await expect(handler(event)).rejects.toThrow('def456')
  })
})
