const _ = require('lodash')
const AWS = require('aws-sdk')

const sqs = new AWS.SQS()

async function deleteSqsMessages({ fulfilledRecords }) {
  if (!fulfilledRecords || !fulfilledRecords.length) return null

  const Entries = fulfilledRecords.map((rejectedRecord, key) => ({
    Id: key.toString(),
    ReceiptHandle: rejectedRecord.receiptHandle,
  }))
  const [, , , , accountId, queueName] = fulfilledRecords[0].eventSourceARN.split(':')
  const QueueUrl = `${sqs.endpoint.href}${accountId}/${queueName}`
  const params = {
    Entries,
    QueueUrl,
  }

  return sqs.deleteMessageBatch(params).promise()
}

function sqsMiddlewareAfter(config) {
  return async (handler, next) => {
    const { event, response } = handler
    const { Records } = event
    console.log('handler', handler)

    const [, rejected] = _.partition(response, { status: 'fulfilled' })
    const rejectedReasons = rejected.map((r) => r.reason && r.reason.message)

    handler.response = null
    if (!rejectedReasons || !rejectedReasons.length) return next()

    /*
    ** Since we're dealing with batch records, we need to manually delete messages from the queue.
    ** On function failure, the remaining undeleted messages will automatically be retried and then
    ** eventually be automatically put on the DLQ if they continue to fail.
    ** If we didn't manually delete the successful messages, the entire batch would be retried/DLQd.
    */
    const fulfilledRecords = Records.filter((r, index) => response[index].status === 'fulfilled')
    await deleteSqsMessages({ fulfilledRecords })

    // Lambda's native functionality is to not delete messages from the queue when an error is thrown
    throw new Error(rejectedReasons.join('\n'))
  }
}
const sqsMiddleware = (config) => ({
  // before: (handler, next) => {
  // },
  after: sqsMiddlewareAfter(config),
  // onError: (handler, next) => {
  // },
})


module.exports = sqsMiddleware
