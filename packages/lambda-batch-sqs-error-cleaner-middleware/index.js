/* eslint no-underscore-dangle:0 */
async function _deleteSqsMessages({ sqs, fulfilledRecords }) {
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

function _getRejectedReasons({ response }) {
  const rejected = response.filter((r) => r.status === 'rejected')
  const rejectedReasons = rejected.map((r) => r.reason && r.reason.message)

  return rejectedReasons
}

function _getFulfilledRecords({ Records, response }) {
  const fulfilledRecords = Records.filter((r, index) => response[index].status === 'fulfilled')

  return fulfilledRecords
}

function _sqsMiddlewareAfter({
  sqs,
  deleteSqsMessages,
  getRejectedReasons,
  getFulfilledRecords,
}) {
  return async (handler, next) => {
    const { event: { Records }, response } = handler
    const rejectedReasons = getRejectedReasons({ response })

    if (!rejectedReasons.length) {
      handler.response = null
      return next()
    }

    /*
    ** Since we're dealing with batch records, we need to manually delete messages from the queue.
    ** On function failure, the remaining undeleted messages will automatically be retried and then
    ** eventually be automatically put on the DLQ if they continue to fail.
    ** If we didn't manually delete the successful messages, the entire batch would be retried/DLQd.
    */
    const fulfilledRecords = getFulfilledRecords({ Records, response })
    await deleteSqsMessages({ sqs, fulfilledRecords })

    // Lambda's native functionality is to not delete messages from the queue when an error is thrown
    throw new Error(rejectedReasons.join('\n'))
  }
}

const sqsMiddleware = ({
  AWS = global.AWS,
  sqs = new AWS.SQS(),
  deleteSqsMessages = _deleteSqsMessages,
  getFulfilledRecords = _getFulfilledRecords,
  getRejectedReasons = _getRejectedReasons,
  after = _sqsMiddlewareAfter({
    sqs,
    deleteSqsMessages,
    getFulfilledRecords,
    getRejectedReasons,
  }),
} = {}) => ({
  // before: (handler, next) => {
  // },
  after,
  // onError: (handler, next) => {
  // },
})


module.exports = sqsMiddleware
