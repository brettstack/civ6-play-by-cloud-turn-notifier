require('dotenv').config()
const webhookLambda = require('../functions/webhook/lambda')

const {
  GAME_ID,
} = process.env
const EVENT = {
  Records: [{
    messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
    receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
    body: JSON.stringify({
      value1: 'Game Name',
      value2: 'Player Name',
      value3: Math.round(Math.random(1, 100) * 100).toString(),
    }),
    attributes: {
      ApproximateReceiveCount: '1',
      SentTimestamp: '1545082649183',
      SenderId: 'AIDAIENQZJOLO23YVJ4VO',
      ApproximateFirstReceiveTimestamp: '1545082649185',
    },
    messageAttributes: {
      gameId: {
        stringValue: GAME_ID,
        stringListValues: [],
        binaryListValues: [],
        dataType: 'String',
      },
    },
    md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
    awsRegion: 'us-east-2',
  }],
}

webhookLambda.webhookHandler(EVENT)
