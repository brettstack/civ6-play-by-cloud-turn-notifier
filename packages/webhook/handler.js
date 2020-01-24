const fetch = require('node-fetch')
const middy = require('@middy/core')
const sqsHandlerWrapper = require('../sqs')

async function webhookHandler(event) {
  const { Records } = event

  if (!Records || !Array.isArray(Records)) {
    throw new Error(`Lambda didn't receive a \`Records\` array in the \`event\` object. Received: ${Records}.`)
  }

  const recordPromises = Records.map(async (record, index) => {
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

  const settledRecords = await Promise.allSettled(recordPromises)
  return settledRecords
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
const handler = middy(webhookHandler)

handler.use(
  sqsHandlerWrapper({
    option1: 'foo',
    option2: 'bar',
  }),
)

module.exports.webhookHandler = handler
