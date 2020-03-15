const fetch = require('node-fetch')
const middy = require('@middy/core')
const sqsPartialBatchFailureMiddleware = require('@middy/sqs-partial-batch-failure')
// const sampleLogging = require('@dazn/lambda-powertools-middleware-sample-logging')
// const captureCorrelationIds = require('@dazn/lambda-powertools-middleware-correlation-ids')
// const logTimeout = require('@dazn/lambda-powertools-middleware-log-timeout')

async function webhookHandler(event) {
  const { Records } = event

  if (!Records || !Array.isArray(Records)) {
    throw new Error(`Lambda didn't receive a \`Records\` array in the \`event\` object. Received: ${Records}.`)
  }

  const recordPromises = Records.map(processMessage)

  return Promise.allSettled(recordPromises)
}

async function processMessage(record, index) {
  const {
    messageId,
    body,
    messageAttributes,
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
    botUsername,
    avatarUrl,
    messageTemplate,
  } = getMessageAttributeStringValues({ messageAttributes })


  if (!discordWebhook) {
    throw new Error(`\`Records[${index}].messageAttributes.discordWebhook\` is missing.`)
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

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`HTTP response not ok: ${response.status} ${responseText}`)
  }

  return responseText
}

function getMessageFromTemplate({
  messageTemplate,
  gameName,
  playerName,
  turnNumber,
}) {
  return messageTemplate
    .replace(/{{gameName}}/g, gameName)
    .replace(/{{playerName}}/g, playerName)
    .replace(/{{turnNumber}}/g, turnNumber)
}

function getMessageAttributeStringValues({ messageAttributes }) {
  const messageAttributeValues = {
    botUsername: 'Civ6 Turnbot',
    avatarUrl: 'http://www.megabearsfan.net/image.axd/2017/8/CivVI-JohnCurtin_250x250.png',
    messageTemplate: `{{playerName}}, it's your turn.
Turn: {{turnNumber}}
Game: {{gameName}}`,
  }

  Object.entries(messageAttributes).forEach(([key, value]) => {
    messageAttributeValues[key] = value.stringValue
  })

  return messageAttributeValues
}
const handler = middy(webhookHandler)

handler
  // .use(captureCorrelationIds({
  //   sampleDebugLogRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(sampleLogging({
  //   sampleRate: parseFloat(process.env.SAMPLE_DEBUG_LOG_RATE || '0.01'),
  // }))
  // .use(logTimeout())
  .use(sqsPartialBatchFailureMiddleware())

module.exports.webhookHandler = handler
