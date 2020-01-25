const eventMocks = require('@serverless/event-mocks').default
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
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [{
          messageAttributes: {
            resolveOrReject: {
              stringValue: 'resolve',
            },
          },
          body: '',
        }],
      },
    )
    const settledRecords = await Promise.allSettled(event.Records.map((r) => Promise.resolve(r)))
    const originalHandler = jest.fn(() => Promise.resolve(settledRecords))
    const handler = middy(originalHandler)
      .use(lambdaBatchSqsErrorCleanerMiddleware())
    await expect(handler(event)).resolves.toEqual(null)
  })
  test('throws with failure reasons', async () => {
    const event = eventMocks(
      'aws:sqs',
      {
        Records: [{
          receiptHandle: 'successfulMessageReceiptHandle',
          messageAttributes: {
            resolveOrReject: {
              stringValue: 'resolve',
            },
          },
        }, {
          messageAttributes: {
            resolveOrReject: {
              stringValue: 'reject',
            },
          },
        }],
      },
    )
    const settledRecords = await Promise.allSettled(event.Records.map((r) => {
      if (r.messageAttributes.resolveOrReject.stringValue === 'resolve') return Promise.resolve(r.messageId)
      return Promise.reject(new Error('Error message...'))
    }))
    const originalHandler = jest.fn(() => Promise.resolve(settledRecords))
    const handler = middy(originalHandler)
      .use(lambdaBatchSqsErrorCleanerMiddleware())
    await expect(handler(event)).rejects.toThrow('Error message...')
    expect(mockDeleteMessageBatch).toHaveBeenCalledWith({
      Entries: [{
        Id: '0',
        ReceiptHandle: 'successfulMessageReceiptHandle',
      }],
      QueueUrl: 'https://...123456789012/my-queue',
    })
  })
})
