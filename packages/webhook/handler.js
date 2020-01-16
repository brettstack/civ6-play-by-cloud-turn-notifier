const AWS = require('aws-sdk')
const _ = require('lodash')
const fetch = require('node-fetch')

const sqs = new AWS.SQS()

async function webhookHandler(event) {
  const { Records } = event
  if (!Records || !Array.isArray(Records)) {
    throw new Error(`Lambda didn't receive a \`Records\` array in the \`event\` object. Received: ${Records}.`)
  }

  const requestPromises = Records.map(async (record, index) => {
    const {
      messageId,
      body,
      messageAttributes,
      // receiptHandle,
      // eventSourceARN,
    } = record

    if (!messageId) {
      throw new Error(`Records[${index}] is missing \`messageId\`.`)
    }

    // TODO: Check if `messageId` has been processed

    if (!body) {
      throw new Error(`Records[${index}].body is missing.`)
    }

    const bodyJson = JSON.parse(body)

    const {
      discordWebhook,
      botUsername = 'Civ6 Turnbot',
      avatarUrl = 'http://www.megabearsfan.net/image.axd/2017/8/CivVI-JohnCurtin_250x250.png',
      messageTemplate = '{{playerName}}, it\'s your turn. Game: {{gameName}}; Turn: {{turnNumber}}.',
    } = getMessageAttributeStringValues({ messageAttributes })


    if (!discordWebhook) {
      throw new Error(`Records[${index}].messageAttributes is missing \`discordWebhook\`.`)
    }

    const {
      value1: gameName,
      value2: playerName,
      value3: turnNumber,
    } = bodyJson
    const message = getMessageFromTemplate({
      messageTemplate,
      gameName,
      playerName,
      turnNumber,
    })
    const targetWebhookBody = {
      username: botUsername,
      avatar_url: avatarUrl,
      content: message,
      /*
      // TODO: Add Civ6 memes
      "embeds": [
        {
          "image": {
            "url": avatarUrl
          }
        }
      ]
      */
    }
    const response = await fetch(discordWebhook, {
      body: JSON.stringify(targetWebhookBody),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`HTTP response not ok: ${response.status} ${text}`)
    }

    return response
  })

  const settledPromises = await Promise.allSettled(requestPromises)
  const [fulfilled, rejected] = _.partition(settledPromises, { status: 'fulfilled' })
  const rejectedReasons = rejected.map((r) => r.reason && r.reason.message)
  const rejectedRecords = Records.filter((r, index) => settledPromises[index].status === 'rejected')
  const fulfilledRecords = Records.filter((r, index) => settledPromises[index].status === 'fulfilled')
  const result = {
    successCount: fulfilled.length,
    failCount: rejected.length,
    rejectedRecords,
    fulfilledRecords,
  }

  if (rejectedReasons.length) {
    result.rejectedReasons = rejectedReasons
  }

  return result
}

function getMessageFromTemplate({
  messageTemplate, gameName, playerName, turnNumber,
}) {
  return messageTemplate
    .replace(/{{gameName}}/g, gameName)
    .replace(/{{playerName}}/g, playerName)
    .replace(/{{turnNumber}}/g, turnNumber)
}

function getMessageAttributeStringValues({ messageAttributes }) {
  const messageAttributeValues = {}

  Object.entries(messageAttributes).forEach(([key, value]) => {
    messageAttributeValues[key] = value.stringValue
  })

  return messageAttributeValues
}

async function deleteSqsMessages({ fulfilledRecords }) {
  if (!fulfilledRecords || !fulfilledRecords.length) return null

  const Entries = fulfilledRecords.map((rejectedRecord, key) => ({
    Id: key.toString(),
    ReceiptHandle: rejectedRecord.receiptHandle,
  }))
  const [, , , region, accountId, queueName] = fulfilledRecords[0].eventSourceARN.split(':')
  const QueueUrl = `${sqs.endpoint.href}${accountId}/${queueName}`
  // `https://${region}/queue.|api-domain|/${accountId}/${queueName}`

  const params = {
    Entries,
    QueueUrl,
  }
  return sqs.deleteMessageBatch(params).promise()
}

function sqsHandlerWrapper(handler) {
  return async (event, context, callback) => {
    const handlerResponse = await handler(event, context, callback)
    const { fulfilledRecords, rejectedReasons } = handlerResponse

    if (!rejectedReasons || !rejectedReasons.length) return null
    /*
    ** Since we're dealing with batch records, we need to manually delete messages from the queue.
    ** On function failure, the remaining undeleted messages will automatically be retried and then
    ** eventually be automatically put on the DLQ if they continue to fail.
    ** If we didn't manually delete the successful messages, the entire batch would be retried/DLQd.
    */
    await deleteSqsMessages({ fulfilledRecords })


    throw new Error(rejectedReasons.join('\n'))
  }
}

module.exports.webhookHandler = sqsHandlerWrapper(webhookHandler)
